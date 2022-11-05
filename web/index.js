// @ts-check
import { join } from "path";
// @ts-ignore
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
// import { setupGDPRWebHooks } from "./gdpr.js";
import { Webhook } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";
// @ts-ignore
import { BillingInterval } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";
import {
  createBlogScript,
  createCollectionSchema,
  createHomepageScript,
  createPageSchema,
  createProductScript,
  deleteBlogScript,
  deleteCollectionSchema,
  deleteHomepageScript,
  deletePageSchema,
  deleteProductScript,
} from "./helpers/scriptTag.js";
import storeModelData from "./model/scripttagModel.js";
import {
  customerDataRequest,
  customerRedact,
  shopRedact,
} from "./gdpr.js";
import {hmacVerify } from "./hmacVerify.js";


const mongoUrl =
  "mongodb+srv://magicschema:K0Ywq8FIqCIXwLcn@cluster0.7qrgbbi.mongodb.net/magic_schema?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log("--> An errorwhile connecting to MongoDB", err.message);
  } else {
    console.log("--> Connected to MongoDB");
  }
});
const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

// @ts-ignore
const PORT = parseInt(process.env.PORT, 10) || 9845;

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;

Shopify.Context.initialize({
  // @ts-ignore
  API_KEY: process.env.SHOPIFY_API_KEY,
  // @ts-ignore
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  // @ts-ignore
  SCOPES: process.env.SCOPES,
  // @ts-ignore
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  // @ts-ignore
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});
//  console.log(process.env)

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop);
  },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: true,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  chargeName: "Magic Schema App Charge",
  amount: 9.99,
  currencyCode: "USD",
  interval: BillingInterval.Every30Days,
};

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
// setupGDPRWebHooks("/webhooks");

// export for test use only
export async function createServer(
  // @ts-ignore
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    // @ts-ignore
    billing: billingSettings,
  });

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.
  app.post("/api/webhooks", async (req, res) => {
    try {
      //
      const test_session = await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });


  //GDPR Compliance Check
  app.post("/gdpr/:topic", hmacVerify, async (req, res) => {
    const { body } = req;
    const { topic } = req.params;
    const shop = req.body.shop_domain;

    console.warn(`--> GDPR request for ${shop} / ${topic} recieved.`);

    let response;
    switch (topic) {
      case "customers_data_request":
        response = await customerDataRequest(topic, shop, body);
        break;
      case "customers_redact":
        response = await customerRedact(topic, shop, body);
        break;
      case "shop_redact":
        response = await shopRedact(topic, shop, body);
        break;
      default:
        console.error(
          "--> Congratulations on breaking the GDPR route! Here's the topic that broke it: ",
          topic
        );
        response = "broken";
        break;
    }

    // @ts-ignore
    if (response.success) {
      res.status(200).send();
    } else {
      res.status(400).send("An error occured");
    }
  });
  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      // @ts-ignore
      billing: billingSettings,
    })
  );

  //custom api calls for schema creation

  //create db schema
  app.get("/api/createScriptTagModel", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    console.log("/api/createScriptTagModel",session);
    // @ts-ignore
    const storeName = session.shop;
    let status = 200;
    let error = null;
    // @ts-ignore
    const shopname = await storeModelData.findOne({ shop: storeName });
    // console.log("shopname",shopname)
    try {
      if (shopname == null) {
        storeModelData.create({
          shop: storeName,
          blog: false,
          collection_script: false,
          page: false,
          product: false,
          homepage: false,
          breadcrumb: false,
          createdAt: new Date(),
        });
      }
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.send({ status: "success", message: "model created" });
  });

  //get getScriptTags
  app.get("/api/getScriptTags", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const storeName = session.shop;
    let status = 200;
    let error = null;

    // console.log("shopname",shopname)
    var storeDetail;
    try {
      // @ts-ignore
      storeDetail = await storeModelData.find({ shop: storeName });
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.send({ status: "success", data: storeDetail });
  });

  //Blog Schema
  app.get("/api/createBlogScript", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      createBlogScript(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.send({ status: "success", data: { scripttag: true } });
  });

  app.get("/api/deleteBlogScript", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      deleteBlogScript(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  // collection schema
  app.get("/api/createCollection", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      createCollectionSchema(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  app.get("/api/deleteCollection", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      deleteCollectionSchema(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  // Page Schema(About us and contact us)
  app.get("/api/createPageSchema", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      createPageSchema(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  app.get("/api/deletePageSchema", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      deletePageSchema(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  // Product Schema
  app.get("/api/createProductScript", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      createProductScript(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  app.get("/api/deleteProductScript", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      deleteProductScript(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  // HomePage or Organaization schema
  app.get("/api/createHomePageScript", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    let error = null;

    try {
      createHomepageScript(accessToken, shop);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  app.get("/api/deleteHomePageScript", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const shop = session.shop;
    let status = 200;
    var scriptstatus;
    let error = null;

    try {
      var data = await deleteHomepageScript(accessToken, shop, scriptstatus);
      console.log("data", data);
      console.log("scriptstatus", scriptstatus);
    } catch (e) {
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json());

  app.use((req, res, next) => {
    // @ts-ignore
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  // @ts-ignore
  app.use("/*", async (req, res, next) => {
    // @ts-ignore
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (!shop) {
      res.status(500);
      return res.send("No shop provided");
    }

    const appInstalled = await AppInstallations.includes(shop);

    if (shop && !appInstalled) {
      res.redirect(`/api/auth?shop=${encodeURIComponent(shop)}`);
    } else {
      const fs = await import("fs");
      const fallbackFile = join(
        isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
        "index.html"
      );
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(fallbackFile));
    }
  });


  return { app };
}

// @ts-ignore
var server = createServer().then(({ app }) => app.listen(PORT));
