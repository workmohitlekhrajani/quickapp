
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

var product_p = new RegExp("(^(.*?(\\bproducts\\b)[^$]*)$)", "ig");
var products_p = new RegExp("(^(.*?(\\bproducts\\b)[^$]*)$)", "ig");
var collections_p = new RegExp("(^(.*?(\\bcollections\\b)[^$]*)$)", "ig");


var product_variants = productDetail.product != undefined?productDetail.product.variants:[]; 

if (product_review.length !== 0) {
  ratingValue = product_review.split("rating")[0];
  ratingCount = product_review.split("(")[1].split("votes")[0];
}

if (product_variants.length !== 0) {
  product_variants.forEach(i => {
    if(i.public_title != null){
    color.push('"'+i.public_title.split('/')[0]+'"');
    size.push(i.public_title.split('/')[1])
      }
})};
color = [...new Set(color)];
size = [...new Set(size)];


var offers = [];
var D = new Date(new Date(doc_last_modify).setFullYear(new Date(doc_last_modify).getFullYear() + 10)).toISOString().split("T")[0];
if(product_variants.length !=0){
product_variants.map((m,i) =>{
    var offer = {
        "@type": "Offer",
        availability: "http://schema.org/InStock",
        name: `"${m.public_title}"`,
        "@id": `"${m.id}"`,
        inventoryLevel: { "@type": "QuantitativeValue", value: "100"},
        price: `"${(m.price)/100}"`,
        priceCurrency: "USD",
        description:` "USD-${m.price}""`,
        priceValidUntil: `"${D}""`,
        itemCondition: "http://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: `"${site_name}""`,
          "@id":`"${base_url_one}/#organization"`,
        },
        sku:` ${m.sku}`,
        mpn: `${m.id}`,
        url: `${window.location.origin+window.location.pathname+"?variant="+m.id}`,
      }
offers.push(offer);
  // console.log(offers)
});
}
var getImage=document.querySelectorAll('.product-gallery--media-thumbnail-img-wrapper img');
var product_var_images=[];
if(getImage.length != 0){
for (let i = 0; i < getImage.length; i++) {
 product_var_images.push(getImage[i].currentSrc)
}}



script = document.createElement("script")
script.type = "application/ld+json";
script.async = true;

if ((product_p.test(window.location.href) &&collections_p.test(window.location.href)) ||products_p.test(window.location.href)) {
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
      "@id":`${document.baseURI}#webpage_MagicSchemaApp`,
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
      offers:offers,
      productID:`${productDetail.product !== undefined ? productDetail.product.id : " "}`,
      productionDate: "",
      purchaseDate: "",
      releaseDate: "",
      review: [],
      sku: `${productDetail.product !== undefined ?productDetail.product.variants[0].sku:" "}`,
      mpn: `${productDetail.product !== undefined ?productDetail.selectedVariantId:" "}`,
      width: "",
      description: description,
      image: product_var_images,
      name: title,
      url: url,
    },
  ]
  );
}

console.log("Schema Script:-", script);

document.getElementsByTagName("head")[0].appendChild(script);