const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// API 1: Get a greeting message
app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello, welcome to our API!' });
});

// API 2: Get the current server time
app.get('/api/time', (req, res) => {
  const currentTime = new Date().toISOString();
  res.json({ time: currentTime });
});

// API 3: Get a random quote
app.get('/api/quote', (req, res) => {
  const quotes = [
    'The only limit to our realization of tomorrow is our doubts of today.',
    'Do not go where the path may lead, go instead where there is no path and leave a trail.',
    'In the middle of every difficulty lies opportunity.',
    'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    'The best way to predict the future is to create it.'
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote });
});

// API 4: POST request to print the request body
app.post('/api/print', (req, res) => {
  console.log('Received POST request with body:', req.body);
  res.json({ message: 'Request body received successfully', body: req.body });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
