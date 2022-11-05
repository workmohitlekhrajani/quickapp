import { Card, Page, Button,Banner } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function Dashboard() {
  const featureSupport = useCallback(() =>
    window.open("mailto:support@smartecomtech.com")
  );

  return (
    <Page>
      <p
        style={{
          margin: "0px 0px 30px 0px",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Welcome to Magic Schema App
      </p>
      <Card sectioned>
        <div class="dash-b"
          style={{
            display: "flex",
            padding: "10px",
            border: "solid blue 1px",
            borderRadius: "10px",
         
          }}
        >
          <div style={{ paddingRight: "10%" }}>
            With more features and more web components, Magic Schema is the most
            advanced automatic Schema insertion service for Shopify. Based on
            your content, Magic Schema generates sophisticated mark-up that
            makes it simpler for Google and other search engines to understand
            your website. The complex mark-up code applied to your website is
            called Schema. Web search tools and other crawlers find it easier to
            index websites with Schema, which makes it easier for them to
            understand the content of your shop and serve it to the appropriate
            audience. According to studies, integrating Schema to your website
            can boost organic click-through-rates (CTR) by as much as 30%.
            Additionally, it offers rich content to your website, making it
            easier to reach the target market because features like your reviews
            or product descriptions can appear in search results.
          </div>
          <img
            src="https://cdn.shopify.com/s/files/1/0533/3172/2437/files/popular-content-seo-analysis-illustration-free-vector-removebg-preview_450x450.png?v=1660342966"
            alt="img"    
          />
          <div style={{ marginTop: "10px", float: "right",position:"absolute",bottom:150 }}>
          <Button primary onClick={featureSupport}>
            Ask Support
          </Button>
      </div>
        </div>
      </Card>

      <div style={{ marginTop: "10px"}}>
      <Banner title="Note" status= "info">
      <p>Estimated time for Google to crawl the website is 5-10 business days</p>
    </Banner>
      </div>
    </Page>
  );
}
