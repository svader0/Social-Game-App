// Require the express module
const express = require('express');

//setting up swagger for documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

const session = require('express-session');
const cors = require('cors');

// Set port
const port = 3000;

// Configure Swagger
   // Swagger definition
   const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
   components: {
     securitySchemes: {
         bearerAuth: {
             type: 'http',
             scheme: 'bearer',
             bearerFormat: 'JWT', 
         },
     },
 },
    },
    apis: ['./routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true                // Allow cookies / credentials
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(session({
  secret: 'cats', // Change this to a random string
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // Session expires after 1 hour
}));

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.username ? true : false;
  next();
});

// Require and use the router module
const router = require('./routes/router').router;
app.use('/', router);
app.use('/guesthome', router);
app.use('/register', router);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app, server }; // Export the app and server objects for testing