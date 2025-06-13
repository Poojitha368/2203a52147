const authUrl = "http://20.244.56.144/evaluation-service/auth";
const stocksUrl = "http://20.244.56.144/evaluation-service/stocks";
const STOCK_DETAILS_URL = 'http://20.244.56.144/evaluation-service/stocks/';


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

// fetching the stock details for each ticker
async function fetchStockDetails() {
  try {
    // Step 1: Get token
    const tokenRes = await axios.post(TOKEN_URL, authPayload);
    const token = tokenRes.data.access_token;

    // Step 2: Get all stock tickers
    const tickersRes = await axios.get(STOCK_LIST_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const stockMap = tickersRes.data.stocks; // { "Apple Inc.": "AAPL", ... }

    // Step 3: Fetch details of each ticker
    for (const [name, ticker] of Object.entries(stockMap)) {
      try {
        const detailsRes = await axios.get(`${STOCK_DETAILS_URL}${ticker}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const history = detailsRes.data;

        console.log(`\n📊 ${name} (${ticker})`);
        history.forEach(entry => {
          console.log(`Price: ₹${entry.price} | Time: ${entry.lastUpdatedAt}`);
        });

      } catch (stockError) {
        console.error(`❌ Error fetching ${ticker}:`, stockError.response?.status || stockError.message);
      }
    }

  } catch (error) {
    console.error('❌ Token/Stock List Error:', error.response?.status || error.message);
  }
}





// posting the user information to the auth endpoint
postAndLogToken();
// calling the stocks API with the token received from the auth endpoint
callStocksAPI();
fetchStockDetails();
