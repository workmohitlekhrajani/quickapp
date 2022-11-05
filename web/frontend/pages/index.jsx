import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { trophyImage, Banner} from "../assets";
import {Icon} from '@shopify/polaris';
import {
  AnalyticsMajor, CashDollarMajor,FavoriteMajor,WandMinor,BehaviorMinor
} from '@shopify/polaris-icons';
import "./index.css";


export default function HomePage() {
  return (
    <div>
    <Page >   
      <Layout>
    
        <Image
          source={Banner}
                    alt="magic-schema-app"
                    width={600}
                  />
        
      </Layout>
    </Page>
    <hr style={{margin:"20px"}}></hr>
    <div className="heading">
      <p style={{fontWeight:"700"}}>Key Features of the Application</p>
      </div>
    <div className="features-01">
      <div className="cards">
      <Card>
        <div className="insideCard">
        <AnalyticsMajor className="icons" />
        <p> The best way to get more traffic to your website is through SEO. 
          With the help of Magic Schema, you can attract and bring in new visitors 
          to your websites which will help your e-commerce business to get better results.
        </p>
        </div>
      </Card>
      </div>
      <div className="cards">
      <Card>
      <div className="insideCard">
      <CashDollarMajor className="icons" />
        <p>Magic Schema helps in meeting google merchants' requirements. It is a Shopify plug-in that helps in making products more findable and relevant on google.
          It also provides information on what to change on your website to increase sales and improve your ranking on google.
        </p>
      </div>
      </Card>
    </div>
    <div className="cards">
      <Card>
      <div className="insideCard">
      <FavoriteMajor className="icons" />
        <p> Magic Schema is simple to use and to get started. 
          It provides you with an easy-to-use and comprehensive interface. All you need to do is, Enable the features of the schema and it will be installed on your website.
        </p>
        </div>
      </Card>
    </div>
    </div>
    
    </div>
  );
}
