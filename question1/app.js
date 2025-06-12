const fetch = require("node-fetch"); // Important for older Node.js

const authUrl = "http://20.244.56.144/evaluation-service/auth";
const dataUrl = "http://20.244.56.144/evaluation-service/stocks";

const userData = {
  email: "2203a52147@sru.edu.in",
  name: "devireddy poojitha reddy",
  rollNo: "2203a52147",
  accessCode: "MVGwEF",
  clientID: "67153b78-a80a-4f1e-8682-6b94919cdb27",
  clientSecret: "VbXGaeytmyWxnChY"
};

async function getAccessToken() {
  try {
    const res = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    if (!res.ok) throw new Error(`Auth failed: ${res.status}`);

    const tokenData = await res.json();
    const token = tokenData.access_token.replace(/^Bearer\s+/i, "");
    return token;
  } catch (err) {
    console.error("Error getting token:", err.message);
  }
}

async function fetchProtectedData() {
  const token = await getAccessToken();

  if (!token) return;

  try {
    const res = await fetch(dataUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`Data fetch failed: ${res.status}`);

    const data = await res.json();
    console.log("Protected API Data:", data);
  } catch (err) {
    console.error("Error fetching protected data:", err.message);
  }
}

fetchProtectedData();
