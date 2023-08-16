const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const regData = {
  companyName: 'Affordmed',
  ownerName: 'Sai kiran',
  rollNo: 'S20200010176',
  ownerEmail: 'saikiran.r20@iiits.in',
  accessCode: 'jYjgQH'
};

let token = '';
let creds ;
axios.post('http://20.244.56.144/train/register', regData)
  .then(response => {
    creds = response.data;
    const authData = {
      companyName: regData.companyName,
      clientID: response.data.clientID,
      ownerName: regData.ownerName,
      ownerEmail: regData.ownerEmail,
      rollNo: regData.rollNo,
      clientSecret: response.data.clientSecret
    };
    return axios.post('http://20.244.56.144/train/auth', authData);
  })
  .then(response => {
    token = response.data.access_token;
  })
  .catch(error => {
    console.error('Error:', error);
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
