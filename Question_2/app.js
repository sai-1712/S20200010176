//S20200010176
// Sai Kiran

const express = require("express");
const app = express();
const axios = require("axios");

const fetchData = async (endpoints) => {
  const requests = endpoints.map((endpoint) => axios.get(endpoint));
  let responses = [];
  try {
    responses = await Promise.allSettled(requests);
    let responseData = responses.filter(
      (response) => response.status === "fulfilled"
    );
    responseData = responseData.map((response) => response.value.data);
    return responseData;
  } catch (err) {
    return [];
  }
};

app.get("/numbers", async (req, res) => {
  let { url } = req.query;
  if (!Array.isArray(url)) {
    url = [url];
  }
  let unique_integers = new Set();
  let ret_arr = [];
  let data = await fetchData(url);
  data.forEach((obj) => {
    obj.numbers.forEach((number) => {
      unique_integers.add(number);
    });
  });
  unique_integers.forEach((num) => {
    ret_arr.push(num);
  });
  ret_arr.sort((a, b) => a - b);
  res.json({
    numbers: ret_arr,
  });
});

app.listen(3000, () => {
  console.log("Server started on PORT 3000");
});