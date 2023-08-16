
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const regData = {
  cname: 'Affordmed',
  owner: 'Sai kiran',
  roll: 'S20200010176',
  email: 'saikiran.r20@iiits.in',
  code: 'jYjgQH'
};

let token = '';
let creds ;
axios.post('http://20.244.56.144/train/register', regData)
  .then(response => {
    creds = response.data;
    const authData = {
      name: regData.cname,
      clientID: response.data.clientID,
      owner: regData.owner,
      email: regData.email,
      roll: regData.roll,
      secret: response.data.clientSecret
    };
    return axios.post('http://20.244.56.144/train/auth', authData);
  })
  .then(response => {
    token = response.data.access_token;
  })
  .catch(error => {
    console.error('Error:', error);
  });

app.get('/trains', (req, res) => {
  if (!token) {
    return res.status(500).json({ error: 'Token not obtained' });
  }

  const now = new Date();
  const currentTime = now.getTime();
  const twelveHoursLater = currentTime + 12 * 60 * 60 * 1000;

  axios.get('http://20.244.56.144/train/trains', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    const trains = response.data.filter(train => {
      const departTime = new Date();
      departTime.setHours(train.departureTime.Hours);
      departTime.setMinutes(train.departureTime.Minutes);
      departTime.setSeconds(train.departureTime.Seconds);
      const departTimestamp = departTime.getTime() + train.delayedBy * 60 * 1000;
      return departTimestamp >= currentTime && departTimestamp <= twelveHoursLater;
    });

    trains.sort((a, b) => {
      if (a.price.AC === b.price.AC) {
        if (a.price.sleeper === b.price.sleeper) {
          return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
        }
        return a.price.sleeper - b.price.sleeper;
      }
      return a.price.AC - b.price.AC;
    });

    res.status(200).json(trains);
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching data' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
