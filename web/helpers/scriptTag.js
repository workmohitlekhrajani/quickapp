import axios from "axios";
import storeModelData from "../model/scripttagModel.js";


const blog_src ="https://magic-schema-files.s3.ca-central-1.amazonaws.com/blogs.js";
const collection_src ="https://magic-schema-files.s3.ca-central-1.amazonaws.com/collection.js";
const page_src="https://magic-schema-files.s3.ca-central-1.amazonaws.com/page.js";
const product_src="https://magic-schema-files.s3.ca-central-1.amazonaws.com/product.js";
const homepage_src="https://magic-schema-files.s3.ca-central-1.amazonaws.com/organization.js";


//create script for Blog
async function createBlogScript(accessToken,shop) {

  const url = `https://${shop}/admin/api/2022-07/script_tags.json`;

  // let storeModel=new storeModelData();
  

  let scriptTagExist = false;

  // console.log("shop",shop)

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const scriptTagBody = JSON.stringify({
    script_tag: {
      event: "onload",
      src:blog_src,
      cache: true,
      display_scope: "online_store",
    },
  });

  try {
   
    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    getScriptTags.data.script_tags.map((script) => {
      if (script.src == src) {
        scriptTagExist = true;
      }
    });
  } catch (error) {
    console.log("createScriptTag code",error.code);
    console.log("createScriptTag response",error.response);
  }

  if (!scriptTagExist) {
    await axios
      .post(url, scriptTagBody, { headers: shopifyHeader(accessToken) })
      .then(async (response) => {
        await storeModelData.findOneAndUpdate(
          {shop:shop},
          {           
          blog:true,
          });
      })
      .catch((error) => console.log("scriptTagExist error"));
  } else {
    //IF THE SCRIPT TAG IS ALREADY INSTALLED, HERE IS WHERE YOU WILL BE DISPLAYING THE MESSAGE:
    //YOU HAVE ALREADY INSTALLED THE SCRIPTTAG
    return JSON.stringify({ scriptTagStatus: true });
  }
  
}

async function  deleteBlogScript(accessToken,shop){

    
  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  
  try {
    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    
    getScriptTags.data.script_tags.map((script) => {
      try{ 
        if(script.src==blog_src){
       async function deleteScriptTaga (){
       const deleted=await axios.delete(`https://${shop}/admin/api/2021-10/script_tags/${script.id}.json`,{
          headers: shopifyHeader(accessToken),
        });
      } 
      deleteScriptTaga()
    }
      }catch(error){
        console.log("axios",error)
      }     
    });
        await storeModelData.findOneAndUpdate(
          {shop:shop},
          {
            blog:false,
          });
  } catch (error) {
    console.log("getScriptTags",error);
  }
}

//create script for Collection
async function createCollectionSchema(accessToken,shop) {
  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  let scriptTagExist = false;

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const scriptTagBody = JSON.stringify({
    script_tag: {
      event: "onload",
      src:collection_src,
      cache: true,
      display_scope: "online_store",
    },
  });

  try {
    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    getScriptTags.data.script_tags.map((script) => {
      if (script.src == src) {
        scriptTagExist = true;
      }
    });

    
  } catch (error) {
    console.log("createScriptTag code",error.code);
    console.log("createScriptTag response",error.response);
  }

  if (!scriptTagExist) {
    await axios
      .post(url, scriptTagBody, { headers: shopifyHeader(accessToken) })
      .then(async (response) => {
        await storeModelData.findOneAndUpdate(
          {shop:shop},
          {           
          collection_script:true,
          });
      })
      .catch((error) => console.log("collection criptTagExist error"));
  } else {
    //IF THE SCRIPT TAG IS ALREADY INSTALLED, HERE IS WHERE YOU WILL BE DISPLAYING THE MESSAGE:
    //YOU HAVE ALREADY INSTALLED THE SCRIPTTAG
    return JSON.stringify({ scriptTagStatus: true });
  }
}

async function  deleteCollectionSchema(accessToken,shop){
  
  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  console.log(url)
  
  try {
    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });

    // console.log("script Tag_101",getScriptTags.data.script_tags)
    
    getScriptTags.data.script_tags.map((script) => {
      try{ 
        if(script.src==collection_src){
       async function deleteScriptTaga (){
       const deleted=await axios.delete(`https://${shop}/admin/api/2021-10/script_tags/${script.id}.json`,{
          headers: shopifyHeader(accessToken),
        });
      }
      deleteScriptTaga()
    } 
      }catch(error){
        console.log("axios",error)
      }     
    });
    await storeModelData.findOneAndUpdate(
      {shop:shop},
      {
        collection_script:false,
      });
  } catch (error) {
    console.log("getScriptTags",error);
  }
}

// Page Schema
async function createPageSchema(accessToken,shop) {

  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  

  let scriptTagExist = false;

  // console.log("shop",shop)

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const scriptTagBody = JSON.stringify({
    script_tag: {
      event: "onload",
      src:page_src,
      cache: true,
      display_scope: "online_store",
    },
  });

  try {
    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    getScriptTags.data.script_tags.map((script) => {
      if (script.src == src) {
        scriptTagExist = true;
      }
    });
  } catch (error) {
    console.log("createScriptTag code",error.code);
    console.log("createScriptTag response",error.response);
  }

  if (!scriptTagExist) {
    await axios
      .post(url, scriptTagBody, { headers: shopifyHeader(accessToken) })
      .then(async (response) => {
        await storeModelData.findOneAndUpdate(
          {shop:shop},
          {           
            page:true,
          });
      })
      .catch((error) => console.log("scriptTagExist error"));
  } else {
    //IF THE SCRIPT TAG IS ALREADY INSTALLED, HERE IS WHERE YOU WILL BE DISPLAYING THE MESSAGE:
    //YOU HAVE ALREADY INSTALLED THE SCRIPTTAG
    return JSON.stringify({ scriptTagStatus: true });
  }
}

async function  deletePageSchema(accessToken,shop){
  
  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  
  try {
    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    
    getScriptTags.data.script_tags.map((script) => {
      try{ 
        if(script.src==page_src){
       async function deleteScriptTaga (){
       const deleted=await axios.delete(`https://${shop}/admin/api/2021-10/script_tags/${script.id}.json`,{
          headers: shopifyHeader(accessToken),
        });
      
      } 
      deleteScriptTaga()
    }
      }catch(error){
        console.log("axios",error)
      }     
    });
    await storeModelData.findOneAndUpdate(
      {shop:shop},
      {
        page:false,
      });
  } catch (error) {
    console.log("getScriptTags",error);
  }
}

// Product Schema
async function createProductScript(accessToken,shop) {

  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  

  let scriptTagExist = false;

  // console.log("shop",shop)

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const scriptTagBody = JSON.stringify({
    script_tag: {
      event: "onload",
      src:product_src,
      cache: true,
      display_scope: "online_store",
    },
  });

  try {
    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    getScriptTags.data.script_tags.map((script) => {
      if (script.src == src) {
        scriptTagExist = true;
      }
    });
  } catch (error) {
    console.log("createScriptTag code",error.code);
    console.log("createScriptTag response",error.response);
  }

  if (!scriptTagExist) {
    await axios
      .post(url, scriptTagBody, { headers: shopifyHeader(accessToken) })
      .then(async (response) => {
        await storeModelData.findOneAndUpdate(
          {shop:shop},
          {           
          product:true,
          });
      })
      .catch((error) => console.log("scriptTagExist error"));
  } else {
    //IF THE SCRIPT TAG IS ALREADY INSTALLED, HERE IS WHERE YOU WILL BE DISPLAYING THE MESSAGE:
    //YOU HAVE ALREADY INSTALLED THE SCRIPTTAG
    return JSON.stringify({ scriptTagStatus: true });
  }
}

async function deleteProductScript(accessToken,shop){
  
  
  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  
  try {
    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    
    getScriptTags.data.script_tags.map((script) => {
      try{ 
        if(script.src==product_src){
       async function deleteScriptTaga (){
       const deleted=await axios.delete(`https://${shop}/admin/api/2021-10/script_tags/${script.id}.json`,{
          headers: shopifyHeader(accessToken),
        });
      
      } 
      deleteScriptTaga()
    }
      }catch(error){
        console.log("axios",error)
      }     
    });
    await storeModelData.findOneAndUpdate(
      {shop:shop},
      {
        product:false,
      })
  } catch (error) {
    console.log("getScriptTags",error);
  }
}

// Homepage or Organaization Schema
async function createHomepageScript(accessToken,shop) {

  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  

  let scriptTagExist = false;

  // console.log("shop",shop)

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const scriptTagBody = JSON.stringify({
    script_tag: {
      event: "onload",
      src:homepage_src,
      cache: true,
      display_scope: "online_store",
    },
  });

  try {
    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    getScriptTags.data.script_tags.map((script) => {
      if (script.src == src) {
        scriptTagExist = true;
      }
    });
  } catch (error) {
    console.log("createScriptTag code",error.code);
    console.log("createScriptTag response",error.response);
  }

  if (!scriptTagExist) {
    await axios
      .post(url, scriptTagBody, { headers: shopifyHeader(accessToken) })
      .then(async (response) => {
        await storeModelData.findOneAndUpdate(
          {shop:shop},
          {           
          homepage:true,
          });
      })
      .catch((error) => console.log("scriptTagExist error"));
  } else {
    //IF THE SCRIPT TAG IS ALREADY INSTALLED, HERE IS WHERE YOU WILL BE DISPLAYING THE MESSAGE:
    //YOU HAVE ALREADY INSTALLED THE SCRIPTTAG
    return JSON.stringify({ scriptTagStatus: true });
  }
}

async function deleteHomepageScript(accessToken,shop,scriptstatus){
  
  
  const url = `https://${shop}/admin/api/2021-04/script_tags.json`;
  
  try {
    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    const getScriptTags = await axios.get(url, {
      headers: shopifyHeader(accessToken),
    });
    
    getScriptTags.data.script_tags.map((script) => {
      try{ 
        if(script.src==homepage_src){
       async function deleteScriptTaga (){
       const deleted=await axios.delete(`https://${shop}/admin/api/2021-10/script_tags/${script.id}.json`,{
          headers: shopifyHeader(accessToken),
        });
      } 
      deleteScriptTaga()
      scriptstatus = false;
      console.log("status",scriptstatus)
      return false;
    }
      }catch(error){
        console.log("axios",error)
      }     
    });
    await storeModelData.findOneAndUpdate(
      {shop:shop},
      {
        homepage:false,
      })
  } catch (error) {
    console.log("getScriptTags",error);
  }
}





export {createBlogScript,deleteBlogScript,createCollectionSchema,deleteCollectionSchema,createPageSchema,deletePageSchema,createProductScript,deleteProductScript,createHomepageScript,deleteHomepageScript}

