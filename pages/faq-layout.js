// import { Page, TextContainer, Heading } from "@shopify/polaris";
// import Navigation from "../client/components/Navigation.js";

// function FaqLayout() {
//   return (
//     <div>
//       <Navigation />
//       <Page>
//         <TextContainer>
//           <Heading>How to Find Your Pinterest Tag ID</Heading>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>
//             Why there's no data even I added my Pinterest Tag ID?
//           </Heading>
//           <p>
//             Pinterest can take several hours to display collected data. If
//             you’ve waited and still don’t see anything, you can check if the tag
//             is firing.
//           </p>
//           <p>
//             If your tag is firing and there are still no conversions, there may
//             not be any conversions or the users may have been using an ad
//             blocker.
//           </p>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>
//             Why my event history is showing me the wrong numbers?
//           </Heading>
//           <p>
//             The Pinterest tag history is not an accurate count of your tag
//             fires. Pinterest is aware of this issue. At the moment, the tag
//             history is best used as a way to verify Pinterest is receiving some
//             data from your shop. Don’t worry, the inaccurate numbers here don’t
//             affect the accuracy of your actual conversion data.
//           </p>
//           <p>
//             Also if you have added Pinterest tag code previously, Please make
//             sure you delete them before using the app.
//           </p>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>What is Enhanced Match?</Heading>
//           <p>
//             Enhanced match is a feature that allows Pinterest to match your site
//             visitor with a Pinterest user more accurately.
//           </p>
//           <p>
//             When enhanced match is enabled, we’ll send your customer’s email to
//             Pinterest when we know it. And it is abled to know when your
//             customer completed a purchase.
//           </p>
//           <p>
//             As a result, we are usually only able to activate enhanced match for
//             your checkout event.
//           </p>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>
//             What are the status in my Enhanced Match status column mean?
//           </Heading>
//           <p>
//             We can only tracking your customer's email if they made a purchase.
//             In this time, only CHECKOUT Enhanced Match status is available.
//           </p>
//           <ul>
//             <li>'Unverified' : You are not using Enhanced Match.</li>
//             <li>
//               'In progress' : Enhanced Match is working but the customer has not
//               purchased yet.
//             </li>
//             <li>
//               'Verified' : Enhanced Match is working and the customer has
//               purchased.
//             </li>
//           </ul>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>
//             Why the Pinterest Tag Helper extension is not showing me my events
//             or showing Error?
//           </Heading>
//           <p>There are few reason may caused the issue:</p>
//           <ul>
//             <li>
//               If you have an ad blocker enabled, it will block your Pinterest
//               tag from firing. Please disable your ad blocker to see events.
//             </li>
//             <li>
//               Your Pinterest Tag ID is not correct. After changing your
//               Pinterest Tag ID, please make sure you click 'Save Changes' again
//               to implement your new ID
//             </li>
//           </ul>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>
//             Why another analytics service is reporting different conversions?
//           </Heading>
//           <p>There are few reason may caused this happen:</p>
//           <ul>
//             <li>
//               Pinterest will attribute a conversion to a promoted pin if it
//               converts within the attribution window you set – usually 30 days.
//               Other analytics services like Google Analytics work on a
//               last-touch basis. This means the last referrer gets the credit for
//               a conversion even if they clicked on your promoted pin recently.
//             </li>
//             <li>
//               Ad blockers block the Pinterest tag from firing. A portion of your
//               visitors are probably using ad blockers which can skew the
//               conversion count.
//             </li>
//             <li>
//               Another service reporting conversion from Pinterest may be
//               combining organic and paid conversions. Your promoted pin
//               dashboard will only show paid conversions.
//             </li>
//           </ul>
//         </TextContainer>
//         <TextContainer>
//           <br />
//           <hr />
//           <Heading>
//             Do I need to disable the Pinterest tracking from Shopify’s Pinterest
//             sales channel?
//           </Heading>
//           <p>
//             Yes, this is recommended. To disable Shopify’s Pinterest tracking,
//             just follow these steps:
//           </p>
//           <ul>
//             <li>
//               From your Shopify admin page, go to Settings - Sales Channels.
//             </li>
//             <li>Click on the Pinterest sales channel.</li>
//             <li>Scroll down to the Pinterest Tag section, click Disable.</li>
//             <li>Click Save.</li>
//           </ul>
//         </TextContainer>
//         <br />
//         <br />
//       </Page>
//     </div>
//   );
// }

// export default FaqLayout;
