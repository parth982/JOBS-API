require('dotenv').config();
require('express-async-errors');

// Security Packages
const rateLimiter = require('express-rate-limit'); 
const helmet = require('helmet'); 
const cors   = require('cors'); 
const xss = require('xss-clean'); 

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

// Load DB Connection Func
const connectDB = require('./db/connect');  
// Authentication MDW Func
const authnticateUser = require('./middleware/authentication');

// Routers 
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Middleware Packages for Security
app.set('trust proxy',1);
app.use(rateLimiter({windows: 15 * 60 * 1000,max: 100}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/',(req,res)=>{
  res.send('<h1>JOBS API</h1> <a href="/api-docs">API Documentation</a>')
});
// For Swagger UI Page
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaaggerDocument));

// Routes
app.use('/api/v1/auth',authRouter);
// Added Auth MDW to all Jobs Route so User should access & perform operation on his Job only not other user ones. 
// So Jobs Routes will be protected for each user  
app.use('/api/v1/jobs',authnticateUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Database Connected!!!!');
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    ); 
  } catch (error) {
    console.log(error);
  }
};

start();
