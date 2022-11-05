import React, { useState,useCallback } from 'react';
import {
  Modal,
  TextContainer
} from '@shopify/polaris';
import '../css/appStyle.css';

function Navigation() {
  const [support, setSupport] = useState(false);
  const handleSupport = useCallback(() => setSupport(!support),[support]);
  const [analytics, setAnalytics] = useState(false);
  const handleAnalytics = useCallback(() => setAnalytics(!analytics),[analytics]);

  return (
    <div>
      <div className="navigationMain">
        <div><p><a style={{'color':'#5c6ac4'}} href="/index">Home Page</a></p></div>
        <div><p><a onClick={handleSupport} href="#">Support</a></p></div>
        <div><p><a onClick={handleAnalytics} href="#">Pinterest Analytics</a></p></div>
        <div><p><a href="https://ads.pinterest.com/audiences/" target="_blank">Pinterest Audiences</a></p></div>
      </div>
      <Modal
        open={support}
        onClose={handleSupport}
        title="Support"
        secondaryActions={[
          {
            content:'Close',
            onAction:handleSupport
          }
        ]}>
        <Modal.Section>
        <TextContainer>
            <p>Feel free to reach us by email: <a href="mailto:olivia@smartecomtech.com" target="_blank">olivia@smartecomtech.com</a>.
            <br/>(Monday - Friday, 9am to 5pm)</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
      <Modal
        open={analytics}
        onClose={handleAnalytics}
        title="Pinterest Analytics"
        secondaryActions={[
          {
            content:'Close',
            onAction:handleAnalytics
          }
        ]}>
        <Modal.Section>
        <TextContainer>
          <ul>
            <li>Head over to your Pinterest ads dashboard at <a href="https://ads.pinterest.com/" target="_blank">ads.pinterest.com</a></li>
            <li>Click the "View all" button next to the type of campaign that you want to analyze.</li>
            <li>Scroll down and select "Columns: Performance".</li>
          </ul>
          <p>You can now see all of your conversion statistics. Pinterest can take anywhere from a couple minutes to several hours to update these stats so check back if you’re not seeing the stats you expect.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  )
}

export default Navigation;
