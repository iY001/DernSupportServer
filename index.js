const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const signup = require("./services/User/auth/signup");
const checkAuthorized = require("./middleware/checkAuthorized");

app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'https://dern-support-server.vercel.app/*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
