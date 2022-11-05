require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const { default: Shopify, ApiVersion } = require("@shopify/shopify-api");
const Router = require("koa-router");
const getSubscriptionUrl = require("./server/install/getSubscriptionUrl");
const cors = require("@koa/cors");
dotenv.config();

const updateSubscription = require("./server/install/updateSubscription");
const deleteUserData = require("./server/install/deleteUserData");
const appUninstall = require("./server/install/appUninstall");

const port = parseInt(process.env.PORT, 10) || 2196;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const routerDB = require("./server/router/routerDB");
const { receiveWebhook } = require("@shopify/koa-shopify-webhooks");
const {
  InstallBaseCode,
  InstallVisitCode,
  DeleteVisitCode,
  InstallCartCode,
  DeleteCartCode,
  InstallSearchCode,
  DeleteSearchCode,
} = require("./server/config/httpConfig");
const Store = require("./server/model/store");

const ACTIVE_SHOPIFY_SHOPS = {};

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SHOPIFY_API_SCOPES.split(","),
  HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.July21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

app.prepare().then(async () => {
  var api_shop = "";
  var api_token = "";

  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(cors());

  await server.use(
    createShopifyAuth({
      accessMode: "offline",
      async afterAuth(ctx) {
        const { shop, scope, accessToken } = ctx.state.shopify;
        api_shop = shop;
        api_token = accessToken;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks/app/uninstall",
          topic: "APP_UNINSTALLED",
          apiVersion: ApiVersion.July21,
          webhookHandler: async (_topic, shop, _body) => {
            await appUninstall(shop);
            delete ACTIVE_SHOPIFY_SHOPS[shop];
            console.log("unistall app");
          },
        });

        const returnUrl = `https://${Shopify.Context.HOST_NAME}?host=${host}&shop=${shop}`;
        const subscriptionUrl = await getSubscriptionUrl(
          accessToken,
          shop,
          returnUrl,
          host
        );
        ctx.redirect(subscriptionUrl);
      },
    })
  );

  //base code
  router.get("/themeJS/:object/:event/:handle", async (ctx) => {
    const results = await fetch(
      "https://" + api_shop + "/admin/api/2022-07/themes.json",
      {
        headers: {
          "X-Shopify-Access-Token": api_token,
        },
      }
    )
      .then(async (response) => await response.json())
      .then(async (json) => {
        var theme_id = 0;
        for (var i = 0; i < json.themes.length; i++) {
          if (json.themes[i].role == "main") {
            theme_id = json.themes[i].id;
          }
        }
        const results2 = await fetch(
          "https://" +
            api_shop +
            "/admin/api/2022-07/themes/" +
            theme_id +
            "/assets.json?asset[key]=layout/theme.liquid",
          {
            headers: {
              "X-Shopify-Access-Token": api_token,
            },
          }
        )
          .then(async (response) => await response.json())
          .then(async (res) => {
            var final = "";
            if (ctx.params.event == "base") {
              final = InstallBaseCode(res.asset.value, ctx.params.object);
            }
            if (ctx.params.event == "visit" && ctx.params.handle == "install") {
              final = InstallVisitCode(res.asset.value, ctx.params.object);
            }
            if (ctx.params.event == "visit" && ctx.params.handle == "delete") {
              final = DeleteVisitCode(res.asset.value);
            }
            const postData = {
              asset: {
                key: "layout/theme.liquid",
                value: final,
              },
            };
            const results3 = await fetch(
              "https://" +
                api_shop +
                "/admin/api/2022-07/themes/" +
                theme_id +
                "/assets.json",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "X-Shopify-Access-Token": api_token,
                },
                body: JSON.stringify(postData),
              }
            )
              .then(async (response) => await response.json())
              .then((res) => {
                return res;
              })
              .catch((e) => {
                return false;
              });
          })
          .catch((e) => {
            return false;
          });
      });
    ctx.body = "done";
  });
  //checkout
  router.post("/checkoutJS/:object", async (ctx) => {
    const postData = {
      script_tag: {
        event: "onload",
        src: "https://cdn.shopify.com/s/files/1/0313/1447/7188/files/checkout.js?v=1583939476",
        display_scope: "order_status",
      },
    };
    const results = await fetch(
      "https://" + api_shop + "/admin/api/2022-07/script_tags.json",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": api_token,
        },
        method: "POST",
        body: JSON.stringify(postData),
      }
    )
      .then(async (response) => await response.json())
      .then(async (res) => {
        await Store.update(
          {
            script_id: res.script_tag.id,
          },
          { where: { id: ctx.params.object } }
        );
        return res;
      });
    ctx.body = {
      status: "success",
      data: results,
    };
  });
  //delete checkout
  router.delete("/deleteCheckout/:object", async (ctx) => {
    const results = fetch(
      "https://" +
        api_shop +
        "/admin/api/2022-07/script_tags/" +
        ctx.params.object +
        ".json",
      {
        headers: {
          "X-Shopify-Access-Token": api_token,
        },
        method: "DELETE",
      }
    )
      .then(async (response) => await response.json())
      .then((res) => {
        return res;
      });
    ctx.body = {
      status: "success",
      data: results,
    };
  });
  //cart
  router.get("/cartJS/:handle", async (ctx) => {
    //get theme id
    const results = await fetch(
      "https://" + api_shop + "/admin/api/2022-07/themes.json",
      {
        headers: {
          "X-Shopify-Access-Token": api_token,
        },
      }
    )
      .then(async (response) => await response.json())
      .then(async (json) => {
        var theme_id = 0;
        for (var i = 0; i < json.themes.length; i++) {
          if (json.themes[i].role == "main") {
            theme_id = json.themes[i].id;
          }
        }
        try {
          await fetch(
            "https://" +
              api_shop +
              "/admin/api/2022-07/themes/" +
              theme_id +
              "/assets.json?asset[key]=sections/product-template.liquid",
            {
              headers: {
                "X-Shopify-Access-Token": api_token,
              },
            }
          )
            .then(async (response) => {
              try {
                await response.json();
              } catch (error) {
                return false;
              }
            })
            .then(async (res) => {
              if (res != undefined) {
                var final = "";
                if (ctx.params.handle == "install") {
                  final = InstallCartCode(res.asset.value);
                }
                if (ctx.params.handle == "delete") {
                  final = DeleteCartCode(res.asset.value);
                }
                const postData = {
                  asset: {
                    key: "sections/product-template.liquid",
                    value: final,
                  },
                };
                const results3 = await fetch(
                  "https://" +
                    api_shop +
                    "/admin/api/2022-07/themes/" +
                    theme_id +
                    "/assets.json",
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Shopify-Access-Token": api_token,
                    },
                    body: JSON.stringify(postData),
                  }
                )
                  .then(async (response) => await response.json())
                  .then((res) => {
                    return res;
                  });
              }
            });
        } catch (err) {
          return false;
        }
      });
    ctx.body = "done";
  });
  //search
  router.get("/searchJS/:handle", async (ctx) => {
    //get theme id
    const results = await fetch(
      "https://" + api_shop + "/admin/api/2022-07/themes.json",
      {
        headers: {
          "X-Shopify-Access-Token": api_token,
        },
      }
    )
      .then(async (response) => await response.json())
      .then(async (json) => {
        var theme_id = 0;
        for (var i = 0; i < json.themes.length; i++) {
          if (json.themes[i].role == "main") {
            theme_id = json.themes[i].id;
          }
        }
        const results2 = await fetch(
          "https://" +
            api_shop +
            "/admin/api/2022-07/themes/" +
            theme_id +
            "/assets.json?asset[key]=templates/search.liquid",
          {
            headers: {
              "X-Shopify-Access-Token": api_token,
            },
          }
        )
          .then(async (response) => {
            try {
              await response.json();
            } catch (e) {
              return false;
            }
          })
          .then(async (res) => {
            var code = "";
            var defalut = true;
            var postData = "";
            if (res != false && res != undefined) {
              if (res.asset.value.indexOf('type="submit"') <= 0) {
                const results2 = await fetch(
                  "https://" +
                    api_shop +
                    "/admin/api/2022-07/themes/" +
                    theme_id +
                    "/assets.json?asset[key]=snippets/search-bar.liquid",
                  {
                    headers: {
                      "X-Shopify-Access-Token": api_token,
                    },
                  }
                )
                  .then(async (response22) => await response22.json())
                  .then((res) => {
                    code = res.asset.value;
                    defalut = false;
                  })
                  .catch((err) => {
                    return false;
                  });
              }
              if (res.asset.value.indexOf('type="submit"') > 0) {
                code = res.asset.value;
              }
              var final = "";
              if (ctx.params.handle == "install") {
                final = InstallSearchCode(code);
              }
              if (ctx.params.handle == "delete") {
                final = DeleteSearchCode(code);
              }
              if (defalut) {
                postData = {
                  asset: { key: "templates/search.liquid", value: final },
                };
              } else {
                postData = {
                  asset: { key: "snippets/search-bar.liquid", value: final },
                };
              }
              const results3 = await fetch(
                "https://" +
                  api_shop +
                  "/admin/api/2022-07/themes/" +
                  theme_id +
                  "/assets.json",
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": api_token,
                  },
                  body: JSON.stringify(postData),
                }
              )
                .then(async (response) => {
                  try {
                    await response.json();
                  } catch (e) {
                    return false;
                  }
                })
                .then((res) => {
                  return res;
                })
                .catch((err) => {
                  return false;
                });
            }
          });
      });
    ctx.body = "done";
  });

  const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });

  router.post("/webhooks/subscription/update", webhook, (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = "OK";
    updateSubscription(
      ctx.request.body.app_subscription.admin_graphql_api_shop_id,
      ctx.request.body.app_subscription.status,
      ctx.request.body.app_subscription.updated_at
    ); //ctx.request.body.app_subscription.status
  });

  // router.post("/webhooks/app/uninstall", webhook, (ctx) => {
  //   ctx.response.status = 200;
  //   ctx.response.body = "OK";
  // });

  router.post("/webhooks/customers/redact", webhook, (ctx) => {
    console.log(ctx.request.body);
    console.log("Got a webhook for customers/redact");
    ctx.response.status = 200;
    ctx.response.body = "OK";
  });
  router.post("/webhooks/shop/redact", webhook, (ctx) => {
    console.log(ctx.request.body);
    console.log("Got a webhook for shop/redact");
    ctx.response.status = 200;
    ctx.response.body = "OK";
  });
  router.post("/webhooks/customers/data_request", webhook, (ctx) => {
    console.log(ctx.request.body);
    console.log("Got a webhook for customers/data_request");
    deleteUserData(ctx.request.body.shop_id);
    ctx.response.status = 200;
    ctx.response.body = "OK";
  });

  router.post("/graphql", verifyRequest(), async (ctx, next) => {
    await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
  });
//changes by Mohit L pls don't remove this comment as this is specific lines which need for reinstallation of app in store 
  router.post("/webhooks/app/uninstall", async (ctx) => {
    await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
    console.log(`Webhook processed with status code 200`);
  });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("(/_next/static/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.use(routerDB.allowedMethods());
  server.use(routerDB.routes());

  server.listen(port, () => {
    console.log(`> It's ready on http://localhost:${port}`);
  });
});
