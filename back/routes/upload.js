var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');

router.post('/', async (req, res, next) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if(files != null) {
            let file = files.fileToUpload;
            let oldpath = file.path;
            let newpath = process.env.UPLOAD_PATH + '/' + file.name;
            // copy the file to a new location
            fs.rename(oldpath, newpath, (err) => {
                if (err) throw err;
                // you may respond with another html page
                res.status(200).json({ value: 'http://' + process.env.APP_DOMAIN + ':' + process.env.PORT + '/' + newpath.substring(2) });
            });
        }
    });
});

module.exports = router;