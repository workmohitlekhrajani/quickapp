
export async function customerDataRequest(topic, shop, webhookRequestBody){
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com",
  //   "orders_requested": [
  //     123456,
  //     123456,
  //     123456,
  //   ],
  //   "customer": {
  //     "id": 123456,
  //     "email": "email@email.com",
  //     "phone": "123-123-1231"
  //   },
  //   "data_request": {
  //     "id": 1111
  //   }
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 *
 * CUSTOMER_REDACT
 *
 */

 export async function customerRedact (topic, shop, webhookRequestBody){
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com",
  //   "customer": {
  //     "id": 123456,
  //     "email": "email@email.com",
  //     "phone": "123-123-1234"
  //   },
  //   "orders_to_redact": [
  //     123456,
  //     123456,
  //     123456
  //   ]
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 *
 * SHOP_REDACT
 *
 */

 export async function shopRedact(topic, shop, webhookRequestBody) { 
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com"
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

