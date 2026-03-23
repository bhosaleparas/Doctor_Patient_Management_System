import axios from "axios";

const tokens = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzc0MDAzMzYxLCJleHAiOjE3NzQyNjI1NjF9.B-kV8E90x9biClAOMskZKUU8Xuy2oF3q44PkQ_qGs1c",

  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzc0MDAzMzg4LCJleHAiOjE3NzQyNjI1ODh9.cmuiJptQ2vHPc6bqjOH7JNSS3BIP6qD8FSUotGg4TKA"
];


const payloads = [
  { name: "Paras Bhosale", patientAge: 17, slotId: 41, date: "2026-04-20" },
  { name: "Rahul Sharma", patientAge: 25, slotId: 41, date: "2026-04-20" }
];

const URL = "http://localhost:8000/user/book";

const requests = tokens.map((token, index) => {
  return axios.post(URL, payloads[index], {
    headers: { Authorization: `bearer ${token}` } 
  });
});

Promise.allSettled(requests).then((results) => {
  results.forEach((res, i) => {
    if (res.status === "fulfilled") {
      console.log(`User ${i + 1}: SUCCESS`);
    } else {
      console.log(`User ${i + 1}: FAILED`, res.reason.response?.data || res.reason);
    }
  });
});