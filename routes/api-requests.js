var express = require('express');
const indexHelper = require('../helpers/index-helper');
var apiHelper = require('../helpers/api-helper');
var router = express.Router();
const { lookup } = require('geoip-lite');
const collections = require('../configurations/collection');

router.get('/register', (req, res) => {
    res.render('index/api-registration');
})
router.post('/register', (req, res) => {
    let data = req.body;
    apiHelper.registerApi(data).then((response) => {
        res.json(response)
    })
})
router.get('/news/', (req, res) => {
    let key = req.query.api_key;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = lookup(ip);
    apiHelper.checkApi(key).then((response) => {
        apiHelper.updateApiAccessLog(req.originalUrl, response._id, ip, location).then(() => {
            indexHelper.getAllActiveNews().then((news) => {
                if (news) {
                    news.forEach(element => {
                        element.filename = req.protocol + '://' + req.headers.host + '/images/news-images/' + element.filename;
                    });
                }
                res.json({ news })
            })
        })
    })
        .catch((response) => {
            res.json(response);
        })
})

router.get('/gallery/photos', (req, res) => {
    let key = req.query.api_key;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = lookup(ip);
    apiHelper.checkApi(key).then((response) => {
        apiHelper.updateApiAccessLog(req.originalUrl, response._id, ip, location).then(() => {
            indexHelper.getGalleryData(collections.PHOTO_GALLERY_COLLECTION).then((items) => {
                items.forEach(element => {
                    var pathArray = element.files;
                    pathArray.forEach((link, index) => {
                        pathArray[index] = req.protocol + '://' + req.headers.host + '/images/gallery/' + link;
                    });
                });
                res.json(items);
            })
        })
    })
        .catch((response) => {
            res.json(response);
        })
})

router.get('/gallery/videos', (req, res) => {
    let key = req.query.api_key;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = lookup(ip);
    apiHelper.checkApi(key).then((response) => {
        apiHelper.updateApiAccessLog(req.originalUrl, response._id, ip, location).then(() => {
            indexHelper.getGalleryData(collections.VIDEO_GALLERY_COLLECTION).then((items) => {
                items.forEach(element => {
                    var pathArray = element.files;
                    pathArray.forEach((link, index) => {
                        pathArray[index] = req.protocol + '://' + req.headers.host + '/videos/gallery/' + link;
                    });
                });
                res.json(items);
            })
        })
    })
        .catch((response) => {
            res.json(response);
        })
})


module.exports = router;