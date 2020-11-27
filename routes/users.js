const express = require('express');
const path = require('path');
const datos = require(path.join(__dirname, '../utils/datos'));
const { addUser } = require(path.join(__dirname, '../utils/functions'));

const router = express.Router();


router.get('/', (req, res) => {
  const { user } = req.query;

  if (!user)
    return res.send(datos);

  if (datos[user])
    return res.send(datos[user]);

  return res.status(404).send('PELIGRO!!! User Not Found');
});

router.get('/:user/:status', (req, res) => {
  let { user, status } = req.params;

  if (!datos[user]) {
    res.status(404).send('404 User Not Found');
  }

  if (status !== 'complete' && status !== 'incomplete') {
    res.status(400).send('It has to be either complete or incomplete');
  }

  if (status === 'complete') {
    status = true;
  }

  if (status === 'incomplete') {
    status = false;
  }

  const arr = datos[user].filter(el => el.complete === status);

  res.json(arr);
});

router.post('/add', (req, res) => {
  const { name, tasks } = req.body;
  const add = addUser(name, tasks);

  if (add.status) {
    return res.status(add.status).send(add.message);
  }

  return res.status(201).json(add);
});

router.put('/completeTask/:name', (req, res) => {
  const { id } = req.query;
  const { name } = req.params;

  if (datos[name]) {
    let changes = {};

    datos[name].forEach(el => {
      if (Number(id) === el.id) {
        el.complete = true;
        changes = el;
      }
    });

    if (Object.keys(changes).length === 0) {
      return res.status(400).send(`Id ${id} does not exists.`);
    }

    return res.status(418).send(changes);
  }
});

router.delete('/delete/:user', (req, res) => {
  const { id } = req.query;
  const { user } = req.params;

  if (datos[user]) {
    if (id) {
      const pos = datos[user].findIndex(el => String(el.id) === id);
      if (pos === -1) {
        return res.status(404).send(`Id ${id} not found.`);
      }

      let tmp = datos[user][pos];

      datos[user].splice(pos, 1);
      return res.json(tmp);
    }

    if (Object.keys(req.query).length > 0) {
      res.status(400).send(`The query is not correct.`);
    }

    let tmp = datos[user];
    delete datos[user];
    return res.json(tmp);
  }

  return res.status(404).send(`User ${user} not found.`);
});


module.exports = router;