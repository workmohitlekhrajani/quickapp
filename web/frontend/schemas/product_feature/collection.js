
var script, type,site_name,image,url,img_width,img_height,title,description,prod_amt,email,product_review,ratingValue,ratingCount,collections,doc_last_modify,color = [],size = [];


//Type
  document.querySelectorAll('[property="og:type"]')[0]?type=document.querySelectorAll('[property="og:type"]')[0].content:type =" ";
//site_name
  document.querySelectorAll('[property="og:site_name"]')[0]?site_name=document.querySelectorAll('[property="og:site_name"]')[0].content:site_name = " ";
//url
  document.querySelectorAll('[property="og:url"]')[0]?url=document.querySelectorAll('[property="og:url"]')[0].content:url=" ";
//image
  document.querySelectorAll('[property="og:image"]')[0]?image=document.querySelectorAll('[property="og:image"]')[0].content:image=" ";
//img_width
  document.querySelectorAll('[property="og:image:width"]')[0]?img_width=document.querySelectorAll('[property="og:image:width"]')[0].content:img_width=" ";
//img_height
  document.querySelectorAll('[property="og:image:height"]')[0]?img_height=document.querySelectorAll('[property="og:image:height"]')[0].content:img_height=" ";
//title
  document.querySelectorAll('[property="og:title"]')[0]?title = document.querySelectorAll('[property="og:title"]')[0].content:title=" ";
//description
  document.querySelectorAll('[property="og:description"]')[0]?description = document.querySelectorAll('[property="og:description"]')[0].content: description=" ";
//email
  document.querySelectorAll('[title="Email"]')[0]? (email = document.querySelectorAll('[title="Email"]')[0].href): (email = "Email");
//prod_amt
  document.querySelectorAll('[property="og:price:amount"]')[0]? (prod_amt = document.querySelectorAll('[property="og:price:amount"]')[0] .content): prod_amt=" ";
//prod_cur
  document.querySelectorAll('[property="og:price:currency"]')[0]? (prod_cur = document.querySelectorAll('[property="og:price:currency"]')[0].content): prod_cur=" ";
//product_review
  document.querySelector(["[data-rating]"]) !== null? (product_review = document.querySelector(["[data-rating]"]).getAttribute("title")): (product_review = []);
//doc_last_modify
  document.lastModified !==undefined?doc_last_modify=document.lastModified: doc_last_modify="";

/*website*/
var base_uri = document.baseURI;
var base_url_one = "https://" + document.domain + "/";
var base_url_two = `${url}/collections`;
var productDetail = window.ShopifyAnalytics !==undefined?window.ShopifyAnalytics.meta:"";
var product = new RegExp("(^(.*?(\\bproducts\\b)[^$]*)$)", "ig");
var collections = new RegExp("(^(.*?(\\bcollections\\b)[^$]*)$)", "ig");

// Creating Script
script = document.createElement("script")
script.type = "application/ld+json";
script.async = true;


if ((product.test(window.location.href) &&collections.test(window.location.href)) ||product.test(window.location.href)) {
  console.log("You are in Collections Empty Page");
  script.textContent = JSON.stringify(
    //Collections
    [
      {}]);
    }else if (collections.test(window.location.href)) {
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
        numberOfItems: productDetail.product !== undefined?productDetail.products.length:"",
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
}


console.log("Schema Script:-", script);

document.getElementsByTagName("head")[0].appendChild(script);
