var express = require('express');
const indexHelper = require('../helpers/index-helper');
var router = express.Router();
var dateFormat = require('dateformat')
const collections = require('../configurations/collection');

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/news', (req, res) => {
  indexHelper.getAllActiveNews().then((news) => {

    res.render('index/news', { news })
  })
})
router.get('/gallery/photos', (req, res) => {
  indexHelper.getGalleryData(collections.PHOTO_GALLERY_COLLECTION).then((items) => {
    res.render('index/photo-gallery', { items });
  })
})

router.get('/gallery/videos', (req, res) => {
  indexHelper.getGalleryData(collections.VIDEO_GALLERY_COLLECTION).then((items) => {
    res.render('index/video-gallery', { items });
  })
})
router.get('/job-view', function (req, res) {
  indexHelper.getJobPost().then((data) => {
    console.log("today>>>>",data)
    if (data) {
      data.forEach((element) => {
        element.closeDate = dateFormat(element.closeDate, "dd-mm-yyyy")
        console.log("hhhhh", element.closeDate)
      })
    }
    console.log("today>>>>",data)
    res.render('index/job-view', { data })
  })

})
router.get('/job-details/:id', function (req, res) {
  let jobId = req.params.id
  console.log("id", jobId)
  indexHelper.getJobDetails(jobId).then((data) => {
    console.log('data', data)
    if (data) {
      data.postDate = dateFormat(data.postDate, "dd-mm-yyyy")
      data.closeDate = dateFormat(data.closeDate, "dd-mm-yyyy")
    }
    console.log('now', data)
    res.render('index/job-details', { data })
  })
})

router.get('/search', function (req, res) {
  let search = req.query.search

  indexHelper.getSearch(search).then((data) => {
    if (data) {
      data.forEach((element) => {
        element.closeDate = dateFormat(element.closeDate, "dd-mm-yyyy")
        console.log("hhhhh", element.closeDate)
      })
    }
    res.render('index/job-view', { data })
  })
})

module.exports = router;
