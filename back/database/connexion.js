const sqlite3 = require('sqlite3').verbose();

let db = new  sqlite3.Database('./database/insta.db', sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) { console.error(err.message); } else 
        {
            console.log('Connected to insta database.');
        }
    }
);

// export database connexion
module.exports = db;