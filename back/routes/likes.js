
var express = require('express');
const db = require('../database/connexion');
var router = express.Router();

const { nanoid } = require('nanoid');

/* add like */
router.post('/', (req, res, next) => {
    let user = req.headers.userdata ? JSON.parse(req.headers.userdata) : null;
    let query = 'INSERT INTO likes(Id, PostId, FireBaseId) VALUES(?, ?, ?)';
    console.log(req.body);

    if (user) {
        let like = {
            Id: nanoid(),
            PostId: req.body.PostId,
            FireBaseId: req.body.FireBaseId
        };

        db.run(query, objectToArray(like), (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(like);
                console.log('Like has been saved.');
            }
        });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
});

/* delete like */
router.delete('/:id', (req, res, next) => {
    let user = req.headers.userdata ? JSON.parse(req.headers.userdata) : null;
    let query = "DELETE FROM likes WHERE Id LIKE '" + req.params.id + "'";
    console.log(query);

    if (user) {
        db.run(query, [], (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json({ message: 'like has been removed.' });
                console.log('Like has been removed.');
            }
        });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
})

function objectToArray(obj) {
    let array = [];
    for ( const [key, value] of Object.entries(obj)) {
        array.push(value);
    } // --
    return array;
}

module.exports = router;