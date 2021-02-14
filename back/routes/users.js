var express = require('express');
const db = require('../database/connexion');
var router = express.Router();

const { nanoid } = require('nanoid');

/* get a user by id */
router.get('/:id', (req, res, next) => {
  let user = req.headers.userdata ? JSON.parse(req.headers.userdata) : null;
  let query = "SELECT UserName as displayName FROM users WHERE FireBaseId = ?";

  if (user) {
    db.get(query, [req.params.id], (err, row) => {
      if (err) {
          res.status(500).json({ message: err.message });
      } else {
        if (row) {
          res.status(200).json(row);
        } else {
          res.status(404).json({ message: 'Not found' });
        }
      }
    });
  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
});

/* create user */
router.post('/', (req, res, next) => {
  let user = req.headers.userdata ? JSON.parse(req.headers.userdata) : null;
  let query = 'INSERT INTO users(Id, FireBaseId, UserName) VALUES(?, ?, ?)';
  console.log(query);

  if (user) {
    let userInfo = {
        Id: nanoid(),
        FireBaseId: req.body.uid,
        UserName: req.body.displayName
    };
    console.log(userInfo);
    
    db.run(query, objectToArray(userInfo), (err) => {
      if (err) {
          res.status(500).json({ message: err.message });
      } else {
          res.status(200).json(userInfo);
          console.log('User has been created !');
      }
    });

  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
});

function objectToArray(obj) {
  let array = [];
  for ( const [key, value] of Object.entries(obj)) {
      array.push(value);
  } // --
  return array;
}

module.exports = router;
