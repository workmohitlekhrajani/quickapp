
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

var blogs=new RegExp("(\\bblogs\\b)",'g')
var about_us=new RegExp("(\\babout-us\\b)",'g')
var contact_us=new RegExp("(\\bcontact-us\\b)",'g')
var contact=new RegExp("(\\bcontact\\b)",'g')

// Creating Script
script = document.createElement("script")
script.type = "application/ld+json";
script.async = true;

if(about_us.test(window.location.href)||contact_us.test(window.location.href) || contact.test(window.location.href)){
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
    headline: about_us.test(window.location.href)?"About Us":contact_us.test(window.location.href)?"Contact Us":"Contact Us",
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
    blogPost: []
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
          name: about_us.test(window.location.href)?"About Us":contact_us.test(window.location.href)?"Contact Us":"Contact Us",
        },
      },
    ],
  },
]
   );
}

console.log("Schema Script:-", script);

document.getElementsByTagName("head")[0].appendChild(script);
