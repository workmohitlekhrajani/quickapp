import { useState, useCallback, useEffect } from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Heading,
  Banner,
  Button,
  SettingToggle,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Sidebar } from "./Sidebar";
import "./SchemaSettings.css";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { Breadcrumbimg } from "../assets";

export default function Settings(props) {
  const [blog_txt, setBlog_txt] = useState();
  const [collection_txt, setCollection_txt] = useState();
  const [homepage_txt, setHomePage_txt] = useState();
  const [page_txt, setPage_txt] = useState();
  const [product_txt, setProduct_txt] = useState();

  const [breadcrumb_txt, setBreadcrumb_txt] = useState();
  const [blogpost_txt, setBlogPost_txt] = useState();
  const [faq_txt, setFaq_txt] = useState();
  const [localbusiness_txt, setLocalbusiness_txt] = useState();

  const fetch = useAuthenticatedFetch();

  const handleBlockSetting = (e) => {
    if (e === "blog") {
      if (!blog_txt) {
        createBlogScript();
      } else {
        deleteBlogScript();
      }
      setBlog_txt(!blog_txt);
    } else if (e === "blog_post") {
      setBlogPost_txt(!blogpost_txt);
    } else if (e === "breadcrumb") {
      setBreadcrumb_txt(!breadcrumb_txt);
    } else if (e === "collection") {
      if (!collection_txt) {
        createCollectionSchema();
      } else {
        deleteCollectionSchema();
      }
      setCollection_txt(!collection_txt);
    } else if (e === "faq") {
      setFaq_txt(!faq_txt);
    } else if (e === "homepage") {
      if (!homepage_txt) {
        createHomePageScript();
      } else {
        deleteHomePageScript();
      }
      setHomePage_txt(!homepage_txt);
    } else if (e === "page") {
      if (!page_txt) {
        createPageSchema();
      } else {
        deletePageSchema();
      }
      setPage_txt(!page_txt);
    } else if (e === "product") {
      if (!product_txt) {
        createProductScript();
      } else {
        deleteProductScript();
      }
      setProduct_txt(!product_txt);
    } else if (e === "localbusiness") {
      setLocalbusiness_txt(!localbusiness_txt);
    }
  };

  // API call for schema scriptag creation
  const createBlogScript = async () => {
    await fetch("/api/createBlogScript");
  };

  const deleteBlogScript = () => {
    fetch("/api/deleteBlogScript");
  };

  const createCollectionSchema = async () => {
    await fetch("/api/createCollection");
  };

  const deleteCollectionSchema = () => {
    fetch("/api/deleteCollection");
  };

  const createPageSchema = async () => {
    await fetch("/api/createPageSchema");
  };

  const deletePageSchema = () => {
    fetch("/api/deletePageSchema");
  };

  const createProductScript = async () => {
    await fetch("/api/createProductScript");
  };

  const deleteProductScript = () => {
    fetch("/api/deleteProductScript");
  };

  const createHomePageScript = async () => {
    await fetch("/api/createHomePageScript");
  };

  const deleteHomePageScript = () => {
    fetch("/api/deleteHomePageScript");
  };

  const createScriptTagModel = async () => {
    await fetch("/api/createScriptTagModel");
  };

  const getScriptTagModel = async () => {
    await fetch("/api/getScriptTags")
      .then((res) => res.json())
      .then((res) => {
        res.data.map((item) => {
          setBlog_txt(item.blog);
          setCollection_txt(item.collection_script);
          setHomePage_txt(item.homepage);
          setPage_txt(item.page);
          setProduct_txt(item.product);
          setBreadcrumb_txt(item.collection_script || item.homepage || item.blog||item.page);
        });
      });
  };

  useEffect(() => {
    createScriptTagModel();
    getScriptTagModel();
  }, []);

  return (
    <>
      <div className="layout">
        <Sidebar />
        <div className="RightPage">
          <Page>
            <Card sectioned>
              <Banner
                status={blog_txt ? "success" : " "}
                title={`${
                  blog_txt ? "Blog Schema Enabled" : "Blog Schema Disabled"
                }`}
              >
                <p> Feature will add schema to all your online store’s.</p>
                <Button
                  primary={blog_txt}
                  onClick={() => handleBlockSetting("blog")}
                >
                  {blog_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card>

            {/* <Card sectioned>
              <Banner
                status={blogpost_txt ? "success" : " "}
                title={`${
                  blogpost_txt
                    ? "Blog Post Schema Enabled"
                    : "Blog Post  Schema Disabled"
                }`}
              >
                <p>View a summary of your online store’s performance.</p>
                <Button
                  primary={blogpost_txt}
                  onClick={() => handleBlockSetting("blog_post")}
                >
                  {blogpost_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card> */}

            <Card sectioned>
              <Banner
                status={breadcrumb_txt ? "success" : " "}
                title={`${
                  breadcrumb_txt
                    ? "Breadcrumb Schema Enabled"
                    : "Breadcrumb Schema Disabled"
                }`}
              >
                <p>
                  A Breadcrumb trail on a page indicates the page's position in
                  the site hierarchy. Google Search uses Breadcrumb markup in
                  the body of a web page to categorise the information from the
                  page in search results.
                </p>

                <Button
                  primary={breadcrumb_txt}
                  onClick={() => handleBlockSetting("breadcrumb")}
                >
                  {breadcrumb_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
              <div className="br-img">
              <Banner status="info" title="Note:">
                  Breadcrumb is part of following schemas Blog, Collection, Page and Homepage / Organization, if you enable any of those, Breadcrumb as well get added.
    </Banner>
                <img src={Breadcrumbimg} alt="img" />
              </div>
            </Card>

            <Card sectioned>
              <Banner
                status={collection_txt ? "success" : " "}
                title={`${
                  collection_txt
                    ? "Collection Schema Enabled"
                    : "Collection Schema Disabled"
                }`}
              >
                <p>
                  Collections are group of products that you can create. Adding
                  schema to Collections increases visibility of your online
                  store’s.
                </p>
                <Button
                  primary={collection_txt}
                  onClick={() => handleBlockSetting("collection")}
                >
                  {collection_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card>

            {/* <Card sectioned>
              <Banner
                status={faq_txt ? "success" : " "}
                title={`${
                  faq_txt ? "FAQ Schema Enabled" : "FAQ Schema Disabled"
                }`}
              >
                <p>View a summary of your online store’s performance.</p>
                <Button
                  primary={faq_txt}
                  onClick={() => handleBlockSetting("faq")}
                >
                  {faq_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card> */}

            <Card sectioned>
              <Banner
                status={homepage_txt ? "success" : " "}
                title={`${
                  homepage_txt
                    ? "Homepage / Organazation Schema Enabled"
                    : "Homepage / Organazation Schema Disabled"
                }`}
              >
                <p>
                  It is an important that you add a schema to your Homepage so that
                  search engines can show "sitelinks" and "sitelink search box".
                </p>
                <Button
                  primary={homepage_txt}
                  onClick={() => handleBlockSetting("homepage")}
                >
                  {homepage_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card>

            <Card sectioned>
              <Banner
                status={page_txt ? "success" : " "}
                title={`${
                  page_txt ? "Page Schema Enabled" : "Page Schema Disabled"
                }`}
              >
                <p>
                  Page schema contain information that rarely changes or that
                  customers will reference often, like an "about us" page or a
                  "contact us" page.
                </p>
                <Button
                  primary={page_txt}
                  onClick={() => handleBlockSetting("page")}
                >
                  {page_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card>

            <Card sectioned>
              <Banner
                status={product_txt ? "success" : " "}
                title={`${
                  product_txt
                    ? "Product Schema Enabled"
                    : "Product Schema Disabled"
                }`}
              >
                <p>
                  An add markup to your Product pages so Google can provide
                  detailed Product information in rich search results including
                  Google Images. users can see price, availability, and review
                  ratings right on search results.
                </p>
                <Button
                  primary={product_txt}
                  onClick={() => handleBlockSetting("product")}
                >
                  {product_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card>

            {/* <Card sectioned>
              <Banner
                status={localbusiness_txt ? "success" : " "}
                title={`${
                  localbusiness_txt
                    ? "Local Business Schema Enabled"
                    : "Local Business Schema Disabled"
                }`}
              >
                <p>View a summary of your online store’s performance.</p>
                <Button
                  primary={localbusiness_txt}
                  onClick={() => handleBlockSetting("localbusiness")}
                >
                  {localbusiness_txt ? "Disable" : "Enable"}
                </Button>
              </Banner>
            </Card> */}

            {/* <Button primary onClick={() => createScriptTag()}>
              Create Script
            </Button>

            <Button primary onClick={() => deleteScriptTag()}>
              Delete Script
            </Button> */}
          </Page>
        </div>
      </div>
    </>
  );
}
