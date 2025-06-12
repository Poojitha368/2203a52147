const authUrl = "http://20.244.56.144/evaluation-service/auth";
const stocksUrl = "http://20.244.56.144/evaluation-service/stocks";

//user data
const userData = {
  email: "2203a52147@sru.edu.in",
  name: "devireddy poojitha reddy",
  rollNo: "2203a52147",
  accessCode: "MVGwEF",
  clientID: "67153b78-a80a-4f1e-8682-6b94919cdb27",
  clientSecret: "VbXGaeytmyWxnChY"
};

// post
async function postAndLogToken() {
  try {
    const res = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      throw new Error(`Auth failed with status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Response from auth endpoint:");
    console.log(data.access_token);

  } catch (err) {
    console.error("Error during POST:", err.message);
  }
}

//access token retrieval
async function getAccessToken() {
  const res = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  if (!res.ok) throw new Error("Failed to get token");

  const data = await res.json();
  const rawToken = data.access_token.replace(/^Bearer\s+/i, "");
  return `Bearer ${rawToken}`;
}


// calling the stocks API with the token received from the auth endpoint
async function callStocksAPI() {
  try {
    const bearerToken = await getAccessToken();

    const res = await fetch(stocksUrl, {
      method: "GET",
      headers: {
        Authorization: bearerToken
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch stocks: ${res.status}`);

    const stocksData = await res.json();

    console.log("Stocks API Data:");
    console.log(stocksData);
  } catch (err) {
    console.error("Error:", err.message);
  }
}





// posting the user information to the auth endpoint
postAndLogToken();
// calling the stocks API with the token received from the auth endpoint
callStocksAPI();
