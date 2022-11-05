import React, { useState,useContext,useEffect,useRef } from 'react';
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Toast,
  Layout,
  Card,
} from '@shopify/polaris';
import axios from 'axios';
const config = require('../../server/config/httpConfig.js');

function CreateBase(props) {
  const isInitialMount = useRef(true);
  const [displayPinID, setDisplayPinID] = useState();
  const handlePinIDChange = (value) => setDisplayPinID(value);
  const [current, setCurrent] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [message, setMessage] = useState();
  const [showToast, setToast] = useState(false);
  const toggleToast = () => setToast(!showToast);
  const toastMarkup = showToast ? (
        <Toast content={message} onDismiss={toggleToast} Diduration={2500} />
    ) : null;

  useEffect(() => {
    async function getData() {
      const db_data = {search:props.valueID};
      await axios.post(config.HTTP_API + '/store/search/pin_id', db_data).then(result => {
        setCurrent(result.data[0].pin_id);
      });
    }
    async function fetchData(){
      if (isInitialMount.current && props.valueID) {
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
        title="Basic Setup"
        description="Submit your Pinterest Tag ID to start tracking events"
      >
        <Card sectioned>
          <FormLayout>
            <TextField
              id="pinID"
              value={displayPinID}
              placeholder = {current}
              onChange={handlePinIDChange}
              label="Pinterest Tag ID"
              error={errorMsg}/>
              <Button
              primary
              onClick = {() => {
                setErrorMsg('');
                displayPinID ?
                  axios.put(config.HTTP_API + '/store/' + props.valueID,{pin_id:displayPinID})
                  .then(({data})=>{
                    axios.get('/themeJS/'+displayPinID+'/base/install').then((res) => {
                        setMessage('Successfully Activate!');
                        toggleToast();
                        props.setRefresh(true);
                    });
                  })
                :
                setErrorMsg('Pinterest Tag ID is required');
              }}>Submit</Button>
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
  </Layout>
    </div>
  );
}

export default CreateBase;
