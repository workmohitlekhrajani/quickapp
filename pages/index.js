import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Page,
  Banner,
  Card,
  Frame,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
Heading,
  Scrollable,
} from "@shopify/polaris";
const config = require("../server/config/httpConfig.js");
import axios from "axios";
import CreateBase from "../client/components/CreateBase.js";
import EventOptions from "../client/components/EventOptions.js";
import Navigation from "../client/components/Navigation.js";
import Recommend from "../client/components/Recommend.js";

function Index() {
  const isInitialMount = useRef(true);
  const [pinID, setPinID] = useState();
  const approve = useRef("block");
  const [pending, setPending] = useState(true);
  const deadline = useRef(0);
  const [refresh, setRefresh] = useState(false);
  const [dataID, setDataID] = useState();
const handleRefresh = () => {setRefresh(!refresh);}
  useEffect(() => {
    async function getID(shop) {
      const data = await axios.post(config.HTTP_API + "/store/getid", {
        shop: shop,
      });
      return data.data[0].id;
    }

    async function checkStatus() {
      const url = new URL(window.location);
      const shop = url.searchParams.get("shop") + "";
      deadline.current++;
      //get id
      const id = await getID(shop);
      setDataID(id);
      await axios
        .post(config.HTTP_API + "/store/getcharge/" + id)
        .then(async (result) => {
          if (result.data == "active") setPending(false);
          else {
            setPending(true);
            approve.current = "none";
            window.top.location = result.data;
          }
        });
    }

    async function getData() {
      const db_data = { search: dataID };
      await axios
        .post(config.HTTP_API + "/store/search/pin_id", db_data)
        .then((result) => {
          try {
            setPinID(result.data[0].pin_id);
          } catch (e) {
            setPinID("");
          }
        });
    }
    async function fetchData() {
      if (isInitialMount.current) {
        await checkStatus();
        isInitialMount.current = false;
        await getData();
      }
      if (!isInitialMount.current && refresh) {
        await getData();
        setRefresh(true);
      }
    }
    fetchData();
  });
  return (
    <div>
      {!pending ? <Navigation /> : null}
      <Frame>
        <Page>
<Card title="FAQ" sectioned>
                  <Scrollable style={{ height: "300px" }} focusable>
                    <TextContainer>
          <Heading>How to Find Your Pinterest Tag ID</Heading>
          <ul>
            <li>
              Log in to your Pinterest business account and open{" "}
              {/* <a
                href="https://ads.pinterest.com/conversion_tags/"
                target="_blank"
              >
                Ads manager
              </a>{" "} */}
              to find an existing or generate your Pinterest Tag ID.
            </li>
            <li>
              Your Pinterest Tag ID supposed to start with "26". Copy and paste
              the ID to the app's Basic Setup section
            </li>
            {/* <img
              alt="How your ID looks like"
              src="https://cdn.shopify.com/s/files/1/0313/1447/7188/files/pin1.png?v=1583422478"
            /> */}
          </ul>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>
            Why there's no data even I added my Pinterest Tag ID?
          </Heading>
          <p>
            Pinterest can take several hours to display collected data. If
            you've waited and still don't see anything, you can check if the tag
            is firing.
          </p>
          {/* <p>
            To check if the event tracking is working, go to{" "}
            <a href="https://ads.pinterest.com/conversion_tags" target="_blank">
              https://ads.pinterest.com/conversion_tags
            </a>{" "}
            and click "See history". If there are events there, that means
            Pinterest is receiving data from your site. If you're not receiving
            data, please email{" "}
            <a href="mailto:support@smartecomtech.com" target="_blank">
              support@smartecomtech.com
            </a>{" "}
            and we will help you ASAP.
          </p> */}
          <p>
            If your tag is firing and there are still no conversions, there may
            not be any conversions or the users may have been using an ad
            blocker.
          </p>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>
            Why my event history is showing me the wrong numbers?
          </Heading>
          <p>
            The Pinterest tag history is not an accurate count of your tag
            fires. Pinterest is aware of this issue. At the moment, the tag
            history is best used as a way to verify Pinterest is receiving some
            data from your shop. Don't worry, the inaccurate numbers here don't
            affect the accuracy of your actual conversion data.
          </p>
          <p>
            Also if you have added Pinterest tag code previously, Please make
            sure you delete them before using the app.
          </p>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>What is Enhanced Match?</Heading>
          <p>
            Enhanced match is a feature that allows Pinterest to match your site
            visitor with a Pinterest user more accurately.
          </p>
          <p>
            When enhanced match is enabled, we'll send your customer's email to
            Pinterest when we know it. And it is abled to know when your
            customer completed a purchase.
          </p>
          <p>
            As a result, we are usually only able to activate enhanced match for
            your checkout event.
          </p>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>
            What are the status in my Enhanced Match status column mean?
          </Heading>
          <p>
            We can only tracking your customer's email if they made a purchase.
            In this time, only CHECKOUT Enhanced Match status is available.
          </p>
          <ul>
            <li>'Unverified' : You are not using Enhanced Match.</li>
            <li>
              'In progress' : Enhanced Match is working but the customer has not
              purchased yet.
            </li>
            <li>
              'Verified' : Enhanced Match is working and the customer has
              purchased.
            </li>
          </ul>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>
            Why the Pinterest Tag Helper extension is not showing me my events
            or showing Error?
          </Heading>
          <p>There are few reason may caused the issue:</p>
          <ul>
            <li>
              If you have an ad blocker enabled, it will block your Pinterest
              tag from firing. Please disable your ad blocker to see events.
            </li>
            <li>
              Your Pinterest Tag ID is not correct. After changing your
              Pinterest Tag ID, please make sure you click 'Save Changes' again
              to implement your new ID
            </li>
          </ul>
          <p>
            If something still going wrong, don't hesitate to reach us by{" "}
            {/* <a href="mailto:support@smartecomtech.com" target="_blank">
              support@smartecomtech.com
            </a>{" "} */}
            and we will help you ASAP.
          </p>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>
            Why another analytics service is reporting different conversions?
          </Heading>
          <p>There are few reason may caused this happen:</p>
          <ul>
            <li>
              Pinterest will attribute a conversion to a promoted pin if it
              converts within the attribution window you set - usually 30 days.
              Other analytics services like Google Analytics work on a
              last-touch basis. This means the last referrer gets the credit for
              a conversion even if they clicked on your promoted pin recently.
            </li>
            <li>
              Ad blockers block the Pinterest tag from firing. A portion of your
              visitors are probably using ad blockers which can skew the
              conversion count.
            </li>
            <li>
              Another service reporting conversion from Pinterest may be
              combining organic and paid conversions. Your promoted pin
              dashboard will only show paid conversions.
            </li>
          </ul>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>
            Do I need to disable the Pinterest tracking from Shopify's Pinterest
            sales channel?
          </Heading>
          <p>
            Yes, this is recommended. To disable Shopify's Pinterest tracking,
            just follow these steps:
          </p>
          <ul>
            <li>
              From your Shopify admin page, go to Settings - Sales Channels.
            </li>
            <li>Click on the Pinterest sales channel.</li>
            <li>Scroll down to the Pinterest Tag section, click Disable.</li>
            <li>Click Save.</li>
          </ul>
        </TextContainer>
                  </Scrollable>
                </Card>
<br/>

          {!pending ? (
            !pinID ? (
              <div>
                <Banner
                  className="index-banner"
                  title="Events are not activated."
                  status="warning"
                >
                  <p>
                    You need to submit your Pinterest Tage Id before to activate
                    the events.
                  </p>
                </Banner>
                <br />
                  <CreateBase valueID={dataID} />
              </div>
            ) : (
              <div>
                <Banner
                  className="index-banner"
                  title="Congratulation! Events are now availabled."
                  status="success"
                >
                  <p>
                    You can now start event tracking by selecting from the event
                    options list.
                  </p>
                </Banner>
                <br />

                  <CreateBase valueID={dataID} setRefresh={handleRefresh}/>
                <br />
                <EventOptions valueID={dataID} />
                <br />
                <br />
                <Recommend />
                <br />
                <br />
              </div>
            )
          ) : (
            <SkeletonPage title="Preparing...">
              <Layout>
                <Layout.Section>
                  <Card subdued>
                    <Card.Section>
                      <TextContainer>
                        <SkeletonDisplayText size="small" />
                        <SkeletonBodyText lines={2} />
                      </TextContainer>
                    </Card.Section>
                    <Card.Section>
                      <SkeletonBodyText lines={2} />
                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </SkeletonPage>
          )}
        </Page>
      </Frame>
    </div>
  );
}

export default Index;
