
var express = require('express');
const db = require('../database/connexion');
var router = express.Router();

const { nanoid } = require('nanoid')

/* Get posts */
router.get('/', async function(req, res, next) {
    let user = req.headers.userdata ? JSON.parse(req.headers.userdata) : null;
    const auth = req.currentUser;
    /* 
     * Récupère la liste des posts, compte le nombre de likes et retourne l'id du like selon l'utilisateur qui requete
     * il est donc possible de supprimer un like distinct (unlike) avec l'id du like
     */
    let subQuery = 'SELECT Id FROM likes AS subLikes WHERE subLikes.FireBaseId LIKE \'' + user.uid + '\'';
    let subQueryGetName = 'SELECT UserName FROM users WHERE users.FireBaseId LIKE posts.CreatedBy';
    let query = 'SELECT posts.Id, Content, ImgUrl, CreatedAt, UpdatedAt, CreatedBy, COUNT(likes.PostId) AS likes, ' +
                '( ' + subQuery + ' AND subLikes.PostId = posts.Id ) didILikeIt, ' +
                '( ' + subQueryGetName + ' ) UserDisplayName ' +
                'FROM posts ' +
                'LEFT JOIN likes ON posts.Id = likes.PostId ' +
                'GROUP BY posts.Id ' +
                'ORDER BY CreatedAt';
    // console.log(query);

    if (auth) {
        db.all(query, [], (err, rows) => {
            if (err) {
                console.log(err.message);
                throw err;
            } else {
                res.status(200).json(rows);
            }
        });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
});

/* Delete post */
router.delete('/:id', function(req, res, next) {
    let query = "DELETE FROM posts WHERE Id LIKE '" + req.params.id + "'";
    const auth = req.currentUser;

    if (auth) {
        db.run(query, [], (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json({ message: 'post has been removed.' });
                console.log('Post has been removed.');
            }
        });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
});

/* Add new post */
router.post('/', function(req, res, next) {
    let user = req.headers.userdata ? JSON.parse(req.headers.userdata) : null;
    let query = 'INSERT INTO posts(Id, Content, ImgUrl, CreatedAt, UpdatedAt, CreatedBy) VALUES(?, ?, ?, ?, ?, ?)';
    const auth = req.currentUser;

    if (auth) {
        let createdAt = Date.now();
        let post = {
            Id: nanoid(),
            Content: req.body.Content,
            ImgUrl: req.body.ImgUrl,
            CreatedAt: createdAt,
            UpdatedAt: createdAt,
            CreatedBy: user.uid
        };
        
        db.run(query, objectToArray(post), (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(post);
                console.log('Post has been saved.');
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