const express = require('express');
const datos = require('./utils/datos');
const users = require('./routes/users');

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use('/users', users);

server.get('/', (req, res) => {
  res.send('SoyEnrique');
});


server.listen(port, () => console.log(`Listening in port ${port}...`));