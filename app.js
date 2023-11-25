const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());

mongoose.connect('mongodb+srv://mrigankx:mypass@cluster0.khu7t.mongodb.net/StockAnalysis?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

//Schema for stock data
const stockSchema = new mongoose.Schema({
  symbol: String,
  company: String,
  price: Number,
});

const Stock = mongoose.model('Stock', stockSchema);

//Predefined data
const initializeDatabase = async () => {
  const stocks = [
    { symbol: 'AAPL', company: 'Apple Inc.' },
    { symbol: 'GOOGL', company: 'Alphabet Inc.' },
    { symbol: 'MSFT', company: 'Microsoft Corporation' },
    { symbol: 'AMZN', company: 'Amazon.com Inc.' },
	{ symbol: 'WIPRO', company: 'Wipro Ltd' },
	{ symbol: 'ITC', company: 'ITC Ltd.' },
	
  ];

  for (const stock of stocks) {
    stock.price = await generateSampleData();
    await Stock.create(stock);
  }
};

const generateSampleData = () => {
  return Promise.resolve((Math.random() * (2000 - 100) + 100).toFixed(2));
};

// API endpoint to get stock prices
app.get('/stock-prices', async (req, res) => {
  try {
    // Get stock prices from the database
    const stockPrices = await Stock.find({}, { _id: 0, __v: 0 });

    res.json(stockPrices);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

initializeDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
