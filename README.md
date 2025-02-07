
# Daily Stock Market Summarizer

The Daily Stock Market Summarizer is designed to provide a concise and accessible overview of daily stock market activity. Whether you’re a market expert or a beginner, this app makes understanding the stock market easier by summarizing key events and trends in simple language. This information is gathered from two sources, Alpha Vantange and Financial Modeling Prep. 

## Features
- **Most Actively Traded:** The day's most actively traded stocks. 
- **Top Movers:** The top three gainer and loser stocks of the day.
- **Ticker Info:** Specific data for each ticker that falls into the above categories, along with recent relevant news articles. 

---

## Server Details

### Repository
The repo for the server can be found here: https://github.com/dcurtin91/stock-market-summary-server


### How It Works

`server.js` has three main functions:

1. The 'fetchAlphaVantageData' function gets raw stock market data from the Alpha Vantage API.
2. This data is processed using OpenAI's chat completion API ('getCompletion' function), which summarizes the information into easy-to-understand terms and formats it accordingly.
3. Then 'app.get' receives the data and uses Firebase's 'setDoc' property to store the summary as a doc in a Firestore database for the front-end to access.

### Running the Server Locally
1. **Clone the repository** and navigate to the project folder.
2. Install dependencies, found in `package.json`:
   ```bash
   npm install
   ```
3. **Set Up Firebase:**
   - Create your own Firestore database.
   - Replace the Firebase config values in `server.js` with your database details.
4. **Create a `.env` file** with your API keys for Firebase, OpenAI, and Alpha Vantage:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   FINANCIAL_MODELING_PREP_API_KEY=your_financial_modeling_prep_api_key
   ```
5. **Run the server:**
   ```bash
   node server.js
   ```

### Automation
- A Firebase function sends a GET request to the server daily so that reports are generated. 

---

## Front-End Details

### Deployment
The front end is currently deployed at:
- **URL:** [Stock Market Summarizer](https://stock-market-summarizer.netlify.app/)

### How It Works
- The front end is a React TSX app built via Vite for production, hence the files `index.html` and `vite.config.ts`.


1. The Firestore database is configured.
2. A Summary object is defined, so that the json received from the server can be parsed properly.
3. Firebase's 'unsubscribe' method is used to retrieve data from the configured database.
4. 'RenderSummaries' is declared to print out the docs within the database, and a filter is applied to ensure only the most recent doc is rendered.

Styles are applied via `App.css` and `index.css`.

`App.tsx` imports `Firebase.tsx` for production and is published via `main.tsx`.


### Running the Client Locally
1. **Clone the repository** and navigate to the client folder.
2. Install dependencies, found in `package.json`:
   ```bash
   npm install
   ```
3. **Set Up Firebase:**
   - Replace the Firebase config values in `Firebase.tsx` with your database details.
4. **Create a `.env` file** with your Firebase API key:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   ```
5. **Run the app:**
   ```bash
   npm run dev
   ```

### Future Goals
- Allow users to access past summaries stored in Firebase.
- Once past summaries can be accessed, add options for trend analysis over time, giving users deeper insights into market performance.
- Mobile app version. 

---


## Contribution
Contributions are welcome.

---

### License
This project is licensed under dcurtin91.


