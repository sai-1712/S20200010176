// const express = require("express");
// const axios = require("axios");
// const app = express();
// const port = 3000;

// const registrationData = {
//     companyName: "Train Central",
//     ownerName: "Rahul",
//     rollNo: "1",
//     ownerEmail: "rahul@abc.edu",
//     accessCode: "FKDLjg",
// };

// let authToken = "";

// axios
//     .post("http://20.244.56.144/train/register", registrationData)
//     .then((response) => {
//         console.log("Company registered:", response.data);
//         const authData = {
//             companyName: registrationData.companyName,
//             clientID: response.data.clientID,
//             ownerName: registrationData.ownerName,
//             ownerEmail: registrationData.ownerEmail,
//             rollNo: registrationData.rollNo,
//             clientSecret: response.data.clientSecret,
//         };
//         return axios.post("http://20.244.56.144/train/auth", authData);
//     })
//     .then((response) => {
//         authToken = response.data.access_token;
//         console.log("Authorization token obtained:", authToken);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });

// app.get("/trains", (req, res) => {
//     if (!authToken) {
//         return res.status(500).json({ error: "Authorization token not obtained" });
//     }

//     const now = new Date();
//     const currentTime = now.getTime();
//     const twelveHoursLater = currentTime + 12 * 60 * 60 * 1000;

//     axios
//         .get("http://20.244.56.144/train/trains", {
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             },
//         })
//         .then((response) => {
//             const trains = response.data.filter((train) => {
//                 const departureTime = new Date();
//                 departureTime.setHours(train.departureTime.Hours);
//                 departureTime.setMinutes(train.departureTime.Minutes);
//                 departureTime.setSeconds(train.departureTime.Seconds);
//                 const departureTimestamp =
//                     departureTime.getTime() + train.delayedBy * 60 * 1000;
//                 return (
//                     departureTimestamp >= currentTime &&
//                     departureTimestamp <= twelveHoursLater
//                 );
//             });

//             trains.sort((a, b) => {
//                 if (a.price.AC === b.price.AC) {
//                     if (a.price.sleeper === b.price.sleeper) {
//                         return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
//                     }
//                     return a.price.sleeper - b.price.sleeper;
//                 }
//                 return a.price.AC - b.price.AC;
//             });

//             res.status(200).json(trains);
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//             res.status(500).json({ error: "Error fetching train data" });
//         });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

////////////////////////


const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const regData = {
  name: 'Train Central',
  owner: 'Rahul',
  roll: '1',
  email: 'rahul@abc.edu',
  code: 'FKDLjg'
};

let token = '';

axios.post('http://20.244.56.144/train/register', regData)
  .then(response => {
    const authData = {
      name: regData.name,
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
