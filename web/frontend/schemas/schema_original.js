var script,
  type,
  site_name,
  image,
  url,
  img_width,
  img_height,
  title,
  description,
  prod_amt,
  email,
  product_review,
  ratingValue,
  ratingCount,
  collections,
  doc_last_modify,
  color = [],
  size = [];

//Type
document.querySelectorAll('[property="og:type"]')[0]
  ? (type = document.querySelectorAll('[property="og:type"]')[0].content)
  : (type = " ");
//site_name
document.querySelectorAll('[property="og:site_name"]')[0]
  ? (site_name = document.querySelectorAll('[property="og:site_name"]')[0]
      .content)
  : (site_name = " ");
//url
document.querySelectorAll('[property="og:url"]')[0]
  ? (url = document.querySelectorAll('[property="og:url"]')[0].content)
  : (url = " ");
//image
document.querySelectorAll('[property="og:image"]')[0]
  ? (image = document.querySelectorAll('[property="og:image"]')[0].content)
  : (image = " ");
//img_width
document.querySelectorAll('[property="og:image:width"]')[0]
  ? (img_width = document.querySelectorAll('[property="og:image:width"]')[0]
      .content)
  : (img_width = " ");
//img_height
document.querySelectorAll('[property="og:image:height"]')[0]
  ? (img_height = document.querySelectorAll('[property="og:image:height"]')[0]
      .content)
  : (img_height = " ");
//title
document.querySelectorAll('[property="og:title"]')[0]
  ? (title = document.querySelectorAll('[property="og:title"]')[0].content)
  : (title = " ");
//description
document.querySelectorAll('[property="og:description"]')[0]
  ? (description = document.querySelectorAll('[property="og:description"]')[0]
      .content)
  : (description = " ");
//email
document.querySelectorAll('[title="Email"]')[0]
  ? (email = document.querySelectorAll('[title="Email"]')[0].href)
  : (email = "Email");
//prod_amt
document.querySelectorAll('[property="og:price:amount"]')[0]
  ? (prod_amt = document.querySelectorAll('[property="og:price:amount"]')[0]
      .content)
  : (prod_amt = " ");
//prod_cur
document.querySelectorAll('[property="og:price:currency"]')[0]
  ? (prod_cur = document.querySelectorAll('[property="og:price:currency"]')[0]
      .content)
  : (prod_cur = " ");
//product_review
document.querySelector(["[data-rating]"]) !== null
  ? (product_review = document
      .querySelector(["[data-rating]"])
      .getAttribute("title"))
  : (product_review = []);
//doc_last_modify
document.lastModified !== undefined
  ? (doc_last_modify = document.lastModified)
  : (doc_last_modify = "");

/*website*/
var base_uri = document.baseURI;
var base_url_one = "https://" + document.domain + "/";
var base_url_two = `${url}/collections`;
var productDetail =
  window.ShopifyAnalytics !== undefined ? window.ShopifyAnalytics.meta : "";

var product = new RegExp("(^(.*?(\\bproducts\\b)[^$]*)$)", "ig");
var collections = new RegExp("(^(.*?(\\bcollections\\b)[^$]*)$)", "ig");
var about_us = new RegExp("(\\babout-us\\b)", "g");
var contact_us = new RegExp("(\\bcontact-us\\b)", "g");
var blogs = new RegExp("(\\bblogs\\b)", "g");

//product variants
var product_variants =
  productDetail.product != undefined ? productDetail.product.variants : [];

if (product_review.length !== 0) {
  ratingValue = product_review.split("rating")[0];
  ratingCount = product_review.split("(")[1].split("votes")[0];
}

if (product_variants.length !== 0) {
  product_variants.forEach((i) => {
    color.push('"' + i.public_title.split("/")[0] + '"');
    size.push(i.public_title.split("/")[1]);
  });
}
color = [...new Set(color)];
size = [...new Set(size)];

// console.log("Type:-",type);
// console.log("Site_name:-",site_name);
// console.log("URL:-",url);
// console.log("Image:-",image);
// console.log("Title:-",title);
// console.log("img_width:-",img_width);
// console.log("img_height:-",img_height);
// console.log("description:-",description);
// console.log("prod_amt:-",prod_amt);
// console.log("prod_cur:-",prod_cur);
// console.log("productDetail",productDetail)
//console.log(base_url_one,base_url_one)
// console.log("product_review",product_review)
// console.log("ratingValue",ratingValue)
// console.log("ratingCount",ratingCount)

var offers = [];
// var d = document.lastModified;
var D = new Date(
  new Date(doc_last_modify).setFullYear(
    new Date(doc_last_modify).getFullYear() + 10
  )
)
  .toISOString()
  .split("T")[0];
if (product_variants.length != 0) {
  product_variants.map((m, i) => {
    var offer = {
      "@type": "Offer",
      availability: "http://schema.org/InStock",
      name: `"${m.public_title}"`,
      "@id": `"${m.id}"`,
      image:
        "https://cdn.shopify.com/s/files/1/0614/0844/4667/products/product-image-1781768731_grande.jpg?v=1645637598",
      inventoryLevel: { "@type": "QuantitativeValue", value: "100" },
      price: `"${m.price / 100}"`,
      priceCurrency: "USD",
      description: ` "USD-${m.price}""`,
      priceValidUntil: `"${D}""`,
      itemCondition: "http://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: `"${name}""`,
        "@id": `"${base_url_one}/#organization"`,
      },
      sku: ` ${m.sku}`,
      mpn: `${m.id}`,
      url: "",
    };
    offers.push(offer);
    console.log(offers);
  });
}

console.log(offers);

var getImage = document.querySelectorAll(
  ".product-gallery--media-thumbnail-img-wrapper img"
);
var product_var_images = [];
if (getImage.length != 0) {
  for (let i = 0; i < getImage.length; i++) {
    product_var_images.push(getImage[i].currentSrc);
  }
}

// console.log("product_var_images",product_var_images)

// Creating Script
script = document.createElement("script");
script.type = "application/ld+json";
script.async = true;

if (
  (product.test(window.location.href) &&
    collections.test(window.location.href)) ||
  product.test(window.location.href)
) {
  console.log("You are in Product Page ");
  script.textContent = JSON.stringify(
    // product
    [
      {
        "@context": "http://schema.org",
        "@type": "Product",
        "@id": url,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${document.baseURI}#webpage_MagicSchemaApp`,
          description: "",
          sdDatePublished: `${new Date(document.lastModified).toISOString()}`,
          sdPublisher: {
            "@context": "http://schema.org",
            "@type": "Organization",
            "@id": "#organization_MagicSchemaApp",
            name: "Magic Schema App",
          },
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Color",
            value: `${color}`,
          },
          {
            "@type": "PropertyValue",
            name: "Size",
            value: `${size}`,
          },
        ],
        brand: {
          "@type": "Brand",
          name: site_name,
          url: url,
        },
        category: "",
        color: "",
        depth: "",
        height: "",
        itemCondition: "http://schema.org/NewCondition",
        logo: "",
        manufacturer: "",
        material: "",
        model: "",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: ratingValue,
          reviewCount: ratingCount,
        },
        offers: offers,
        productID: `${
          productDetail.product !== undefined ? productDetail.product.id : " "
        }`,
        productionDate: "",
        purchaseDate: "",
        releaseDate: "",
        review: [],
        sku: `${
          productDetail.product !== undefined
            ? productDetail.product.variants[0].sku
            : " "
        }`,
        mpn: `${
          productDetail.product !== undefined
            ? productDetail.selectedVariantId
            : " "
        }`,
        width: "",
        description: description,
        image: product_var_images,
        name: title,
        url: url,
      },
    ]
  );
} else if (base_url_one == window.location.href) {
  console.log("You are in Organaization Page");
  script.textContent = JSON.stringify(
    //Organaization
    [
      {
        "@context": "http://schema.org",
        "@type": "Organization",
        "@id": `${base_url_one}/#organaization_MagicSchemaApp`,
        url: base_url_one,
        email: email,
        description: description,
        mainEntityOfPage: { "@type": "WebPage", url: base_url_one },
      },
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        "@id": `${base_url_one}/#website_MagicSchemaApp`,
        name: site_name,
        url: base_url_one,
        potentialAction: {
          "@type": "SearchAction",
          target: `${base_url_one}/search?q={query}`,
          name: `${site_name} Sitelink Schema by Magic Schema App`,
          "query-input": "required name=query",
        },
        publisher: {
          "@type": "Organization",
          "@id": `${base_url_one}/#organaization_MagicSchemaApp`,
        },
      },
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        name: `${site_name} Breadcrumbs Schema by Magic Schema App`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: { "@type": "WebPage", "@id": base_url_one, name: site_name },
          },
        ],
      },
    ]
  );
} else if (collections.test(window.location.href)) {
  console.log("You are in Collections Page");
  script.textContent = JSON.stringify(
    //Collections
    [
      {
        "@context": "http://schema.org",
        "@type": "OfferCatalog",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": document.baseURI,
        },
        description: description,
        name: title,
        url: document.baseURI,
        numberOfItems:
          productDetail.product !== undefined
            ? productDetail.products.length
            : "",
      },
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        name: `${site_name} Sitelink Schema by Magic Schema App`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": `${base_url_one}/collections}`,
              name: "Collections",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${base_uri}#breadcrumb_MagicSchemaApp `,
              name: title,
            },
          },
        ],
      },
    ]
  );
} else if (
  about_us.test(window.location.href) ||
  contact_us.test(window.location.href) ||
  blogs.test(window.location.href)
) {
  console.log("You are in About Us Or Contact Us Or Blogs Page");

  script.textContent = JSON.stringify(
    //About us and contact us
    [
      {
        "@context": "http://schema.org",
        "@type": "WebPage",
        author: { "@type": "Person", name: "" },
        creator: null,
        dateCreated: "",
        dateModified: doc_last_modify,
        datePublished: doc_last_modify,
        headline: about_us.test(window.location.href)
          ? "About Us"
          : contact_us.test(window.location.href)
          ? "Contact Us"
          : "News",
        mainEntityOfPage: {
          "@type": "WebPage",
          url: base_uri,
        },
        publisher: {
          "@type": "Organization",
          name: site_name,
        },
        text: description,
        url: base_uri,
        blogPost: [],
      },
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        name: `${site_name} Breadcrumbs Schema by Magic Schema App`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": document.location.pathname,
              name: about_us.test(window.location.href)
                ? "About Us"
                : contact_us.test(window.location.href)
                ? "Contact Us"
                : "News",
            },
          },
        ],
      },
    ]
  );
}

console.log("Schema Script:-", script);

document.getElementsByTagName("head")[0].appendChild(script);
