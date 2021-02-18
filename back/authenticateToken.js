const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function decodeIDToken(req, res, next) {
    const header = req.headers.authorization;
    if (req.headers.authorization != undefined) {
        if (header != 'Bearer null' && req.headers.authorization.startsWith('Bearer ')) {

            const idToken = req.headers.authorization.split('Bearer ')[1];
    
            try {
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                req['currentUser'] = decodeIDToken;
            } catch (e) {
                console.log(err);
            }
        }
    } else {
        req['currentUser'] = null; 
    }

    next();
}

module.exports = decodeIDToken;