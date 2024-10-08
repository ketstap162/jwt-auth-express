require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerDocs = require('./swagger')
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.SERVER_PORT || 3000;

const app = express();
const routes = require('./routes/index');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cookieParser());
app.use('', routes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
