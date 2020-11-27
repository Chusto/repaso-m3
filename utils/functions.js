const datos = require('./datos');

let addUser = (name, tasks) => {
  const err = {};

  if (datos[name]) {
    err.message = 'This user already exists.';
    err.status = 400;

    return err;
  }

  if (Array.isArray(tasks)) {
    datos[name] = tasks;

    return datos[name];
  }

  if (tasks instanceof Object) {
    datos[name] = [tasks];

    return datos[name];
  }

  err.message = 'Wrong task.';
  err.status = 400;

  return err;
};

module.exports = {
  addUser
};