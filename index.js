const express = require("express");
const compression = require('compression');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const signup = require("./services/User/auth/signup");
const checkAuthorized = require("./middleware/checkAuthorized");

app.use(compression());
app.use(express.json());
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('Dern Support Server!');
});

// Routes setup
app.use('/user', require('./routes/User'));
app.use('/tickets', checkAuthorized, require('./routes/Tickets'));
app.use('/replies' , checkAuthorized, require('./routes/Replies'));
app.use('/problems' , require('./routes/Problems'));
app.use('/images' , require('./routes/Images'));
app.use('/aichat', require('./routes/aiChat'));
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
