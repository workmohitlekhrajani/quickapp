import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Toast,
  Layout,
  Card,
  PageActions,
  Checkbox,
  Stack,
  Badge,
} from "@shopify/polaris";
import axios from "axios";
const config = require("../../server/config/httpConfig.js");

function EventOptions({ valueID }) {
  const isInitialMount = useRef(true);
  const [enhanced, setEnhanced] = useState();
  const [queries, setQueries] = useState();
  const [cart, setCart] = useState();
  const [checkout, setCheckout] = useState();
  const [checkoutStatus, setCheckoutStatus] = useState("dafault");
  const [cartStatus, setCartStatus] = useState("dafault");
  const [queriesStatus, setQueriesStatus] = useState("dafault");
  const [visit, setVisit] = useState();
  const [pinID, setPinID] = useState();
  const handleEnhanced = useCallback((newChecked) => setEnhanced(newChecked));
  const handleQueries = useCallback((newChecked) => setQueries(newChecked));
  const handleCart = useCallback((newChecked) => setCart(newChecked));
  const handleCheckout = useCallback((newChecked) => setCheckout(newChecked));
  const handleVisit = useCallback((newChecked) => setVisit(newChecked));
  const [message, setMessage] = useState();
  const [showToast, setToast] = useState(false);
  const toggleToast = () => setToast(!showToast);
  const toastMarkup = showToast ? (
    <Toast content={message} onDismiss={toggleToast} Diduration={2500} />
  ) : null;

  useEffect(() => {
    async function getData() {
      const db_data = { search: valueID };
      await axios
        .post(config.HTTP_API + "/store/search/event", db_data)
        .then((result) => {
          setEnhanced(result.data[0].enhanced);
          setQueries(result.data[0].queries);
          if (result.data[0].queries != 0) setQueriesStatus("success");
          setCart(result.data[0].cart);
          if (result.data[0].cart != 0) setCartStatus("success");
          setCheckout(result.data[0].checkout);
          if (result.data[0].checkout != 0) setCheckoutStatus("success");
          setVisit(result.data[0].visit);
          setPinID(result.data[0].pin_id);
        });
    }
    async function fetchData() {
      if (isInitialMount.current && valueID) {
        isInitialMount.current = false;
        await getData();
      }
    }
    fetchData();
  });
  return (
    <div>
      {toastMarkup}
      <Layout>
        <Layout.AnnotatedSection
          title="Event Options"
          description="Select the conversions you want to track. Make sure you Save Changes after you changing your Pinterest Tag ID"
        >
          <Card sectioned>
            <FormLayout>
              <Checkbox
                label="Enhanced Match"
                checked={enhanced}
                onChange={handleEnhanced}
                helpText="Find more conversions by tracking checkout actions when there's no Pinterest cookie present."
              />
              <Checkbox
                label="Checkout"
                checked={checkout}
                onChange={handleCheckout}
                helpText="Track people who complete transactions"
              />
              {checkout ? (
                <div style={{ paddingLeft: "23px", marginTop: "-25px" }}>
                  <Stack>
                    <Badge status={checkoutStatus}>Value</Badge>
                    <Badge status={checkoutStatus}>Currency</Badge>
                    <Badge status={checkoutStatus}>Order ID</Badge>
                    <Badge status={checkoutStatus}>Order Quantity</Badge>
                    <Badge status={checkoutStatus}>Line Item</Badge>
                  </Stack>
                </div>
              ) : null}
              <Checkbox
                label="AddToCart"
                checked={cart}
                onChange={handleCart}
                helpText="Track people who add items to shopping carts"
              />
              {cart ? (
                <div style={{ paddingLeft: "23px", marginTop: "-25px" }}>
                  <Stack>
                    <Badge status={cartStatus}>Value</Badge>
                    <Badge status={cartStatus}>Currency</Badge>
                    <Badge status={cartStatus}>Order ID</Badge>
                    <Badge status={cartStatus}>Order Quantity</Badge>
                    <Badge status={cartStatus}>Product Name</Badge>
                  </Stack>
                </div>
              ) : null}
              <Checkbox
                label="PageVisit"
                checked={visit}
                onChange={handleVisit}
                helpText="Track people who view primary pages, such as product pages and article pages"
              />
              <Checkbox
                label="Search Queries"
                checked={queries}
                onChange={handleQueries}
                helpText="Track people who perform searches on your website to look for specific products or store locations"
              />
              {queries ? (
                <div style={{ paddingLeft: "23px", marginTop: "-25px" }}>
                  <Stack>
                    <Badge status={queriesStatus}>Query</Badge>
                  </Stack>
                </div>
              ) : null}
              <Button
                primary
                onClick={() => {
                  const init_data = {
                    enhanced: 0,
                    queries: 0,
                    cart: 0,
                    checkout: 0,
                    visit: 0,
                  };
                  axios
                    .put(config.HTTP_API + "/store/" + valueID, init_data)
                    .then(() => {
                      const db_data = {
                        enhanced: enhanced,
                        queries: queries,
                        cart: cart,
                        checkout: checkout,
                        visit: visit,
                      };
                      axios
                        .put(config.HTTP_API + "/store/" + valueID, db_data)
                        .then(async ({ data }) => {
                          //install or uninstall checkout
                          if (checkout != 0) {
                            axios
                              .post(
                                config.HTTP_API + "/store/search/script_id",
                                { search: valueID }
                              )
                              .then(async (ress) => {
                                if (
                                  ress.data[0].script_id &&
                                  ress.data[0].script_id != 0
                                ) {
                                  axios
                                    .delete(
                                      "/deleteCheckout/" +
                                        ress.data[0].script_id
                                    )
                                    .then(async (resD) => {
                                      await axios.put(
                                        config.HTTP_API + "/store/" + valueID,
                                        { script_id: "" }
                                      );
                                      setCheckoutStatus("success");
                                      await axios.post(
                                        "/checkoutJS/" + valueID
                                      );
                                    });
                                } else {
                                  setCheckoutStatus("success");
                                  await axios.post("/checkoutJS/" + valueID);
                                }
                              });
                          } else {
                            setCheckoutStatus("dafault");
                            axios
                              .post(
                                config.HTTP_API + "/store/search/script_id",
                                { search: valueID }
                              )
                              .then(async (res) => {
                                if (
                                  res.data[0].script_id &&
                                  res.data[0].script_id != 0
                                ) {
                                  //if have script id, delete script
                                  axios
                                    .delete(
                                      "/deleteCheckout/" + res.data[0].script_id
                                    )
                                    .then(async (resD) => {
                                      await axios.put(
                                        config.HTTP_API + "/store/" + valueID,
                                        { script_id: "" }
                                      );
                                    });
                                }
                              });
                          }
                          //install cart or uninstall cart
                          if (cart != 0) {
                            setCartStatus("success");
                            await axios.get(
                              config.HTTP_API + "/cartJS/install"
                            );
                            console.log("install success");
                          } else {
                            setCartStatus("default");
                            await axios.get(config.HTTP_API + "/cartJS/delete");
                          }

                          //install or uninstall visit
                          if (visit != 0) {
                            await axios.get(
                              "/themeJS/" + pinID + "/visit/install"
                            );
                          } else {
                            await axios.get(
                              "/themeJS/" + pinID + "/visit/delete"
                            );
                          }

                          //install queries or uninstall queries
                          if (queries != 0) {
                            setQueriesStatus("success");
                            await axios.get("/searchJS/install");
                          } else {
                            setQueriesStatus("default");
                            await axios.get("/searchJS/delete");
                          }

                          setMessage("Changes Saved!");
                          toggleToast();
                        });
                    });
                }}
              >
                Save Changes
              </Button>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </div>
  );
}

export default EventOptions;
