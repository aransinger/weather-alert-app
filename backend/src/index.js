const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
app.use(cors());
const weatherRouter = require('./routes/weather');
const alertsRouter = require('./routes/alerts');
const evaluateRouter = require('./routes/evaluate');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Weather Alert API is running.');
});

app.use('/alerts', alertsRouter);
app.use('/weather', weatherRouter);
app.use('/evaluate', evaluateRouter);

console.log("PORT from env:", process.env.PORT);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));