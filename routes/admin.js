var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin-helper');
var dateFormat = require('dateformat');
const fs = require('fs');
const genThumbnail = require('simple-thumbnail')
var collections = require('../configurations/collection');

router.get('/create-company', (req, res) => {
    res.render('admin/create-company');
})

router.post('/create-company', function (req, res) {
    let companyInfo = req.body;
    adminHelper.createCompany(companyInfo).then(() => {
        res.redirect('/admin/create-company');
    })
    console.log(companyInfo);
})

router.get('/view-companies', (req, res) => {
    adminHelper.getAllCompanies().then((response) => {
        if (response) {
            response.forEach((element, index) => {
                element.serial = index + 1;
            });
        }
        res.render('admin/view-companies', { companies: response });
    })
})
router.get('/company/:id/home', async (req, res) => {
    let companyId = req.params.id;
    let companyDetails = await adminHelper.getCompanyInfo(companyId);
    res.render('admin/company-home', { company: companyDetails });
})

router.post('/block-company', (req, res) => {
    let comapanyCode = req.body.company;
    let status = req.body.opt;
    console.log(status);
    status = (status === 'true')
    adminHelper.setBlockStatus(comapanyCode, !status).then(() => {
        res.json({ status: true });
    })
})


















router.get('/buildings', (req, res) => {

    adminHelper.getAllBuildings().then((response) => {
        res.render('admin/buildings', { buildings: response });
    })
})

router.post('/add-building', (req, res) => {
    let data = req.body;
    console.log(body);
})

router.get('/news/news-dashboard', (req, res) => {
    adminHelper.getAllNews().then((response) => {
        if (response) {
            response.forEach((element, index) => {
                element.serial = index + 1;
                element.publishdate = dateFormat(element.publishdate, "dd-mm-yyyy hh:MM:ss TT")
            });
        }
        res.render('admin/news-dashboard', { news: response });
    })
})
router.get('/news/create-news', (req, res) => {
    res.render('admin/create-news')
})
router.post('/news/create-news', (req, res) => {
    let news = req.body;
    let image = req.files.photo;
    adminHelper.createNews(news).then((response) => {
        let fileName = '' + response.insertedId + image.name;
        let path = './public/images/news-images/' + fileName
        console.log(path)
        image.mv(path, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                adminHelper.updateImagePath(response.insertedId, fileName).then(() => {
                    res.redirect('/admin/news/news-dashboard/');
                })
            }
        });

    })
})
router.get('/news/disable-news/:id', (req, res) => {
    let newsId = req.params.id;
    adminHelper.disableNews(newsId).then(() => {
        res.redirect('/admin/news/news-dashboard/')
    })
})
router.get('/news/reactivate-news/:id', (req, res) => {
    let newsId = req.params.id;
    adminHelper.reactivateNews(newsId).then(() => {
        res.redirect('/admin/news/news-dashboard/')
    })
})
router.get('/news/modify-news/:id', (req, res) => {
    let newsId = req.params.id;
    adminHelper.getNewsDetails(newsId).then((result) => {
        res.render('admin/edit-news', { news: result });
    })
})
router.get('/gallery/photo', (req, res) => {
    adminHelper.getPhotoGalleryData().then((resp) => {
        res.render('admin/picture-gallery-dashboard', { pics: resp });

    })
})
router.get('/gallery/new-photo-gallery', (req, res) => {
    res.render('admin/new-photo-gallery');
})
router.post('/gallery/new-photo-gallery', (req, res) => {
    let data = req.body;
    let files = req.files.photos;
    if (!Array.isArray(files)) {
        files = [files];
    }
    // console.log(data);
    adminHelper.createPhotoGallery(data).then((id) => {
        console.log(files)
        files.forEach((element) => {
            let filename = id + element.name;
            element.mv('./public/images/gallery/' + filename, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    adminHelper.pushImageFiles(id, filename).then(() => {
                        //NOTHING TO DO
                        genThumbnail('./public/images/gallery/' + filename, './public/images/gallery/thumbnail/' + filename, '250x?')
                            .then(() => console.log('done!'))
                            .catch(err => console.error(err))
                    });
                }
            })
        });
        res.redirect('/admin/gallery/photo')
    })
    // console.log(files);
})
router.get('/gallery/delete-gallery/:id', (req, res) => {
    let id = req.params.id;
    adminHelper.getFiles(collections.PHOTO_GALLERY_COLLECTION, id).then((files) => {
        files.forEach(element => {
            fs.unlinkSync('./public/images/gallery/' + element);
        });
        adminHelper.removeGallery(collections.PHOTO_GALLERY_COLLECTION, id).then(() => {
            res.redirect('/admin/gallery/photo')
        })
    })
})

router.get('/gallery/disable-gallery/:id', function (req, res) {
    let id = req.params.id;
    adminHelper.changeGalleryVisiblity(collections.PHOTO_GALLERY_COLLECTION, id, false).then(() => {
        res.redirect('/admin/gallery/photo');
    })

})
router.get('/gallery/enable-gallery/:id', function (req, res) {
    let id = req.params.id;
    adminHelper.changeGalleryVisiblity(id, true).then(() => {
        res.redirect('/admin/gallery/photo');
    })

})
router.get('/gallery/video', (req, res) => {


    adminHelper.getVideoGalleryData().then((resp) => {

        res.render('admin/video-gallery-dashboard', { videos: resp });

    })

})
router.get('/gallery/new-video', (req, res) => {
    res.render('admin/create-video')
})

router.post('/gallery/new-video', (req, res) => {
    let data = req.body;
    let files = req.files.videos;
    if (!Array.isArray(files)) {
        files = [files]
    }
    adminHelper.createVideoGallery(data).then((id) => {
        files.forEach(element => {
            let filename = id + element.name;
            element.mv('./public/videos/gallery/' + filename, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    adminHelper.pushVideoFiles(id, filename).then(() => {
                        //NOTHING TO DO
                        genThumbnail('./public/videos/gallery/' + filename, './public/videos/gallery/thumbnail/' + filename, '250x?')
                            .then(() => console.log('done!'))
                            .catch(err => console.error(err))
                    });
                }
            })
        });
        res.redirect('/admin/gallery/video')
    })
})
router.get('/gallery/delete-video-gallery/:id', (req, res) => {
    let id = req.params.id;
    adminHelper.getFiles(collections.VIDEO_GALLERY_COLLECTION, id).then((files) => {
        files.forEach(element => {
            fs.unlinkSync('./public/videos/gallery/' + element);
        });
        adminHelper.removeGallery(collections.VIDEO_GALLERY_COLLECTION, id).then(() => {
            res.redirect('/admin/gallery/video')
        })
    })
})
router.get('/gallery/disable-video-gallery/:id', (req, res) => {
    let id = req.params.id;
    adminHelper.changeGalleryVisiblity(collections.VIDEO_GALLERY_COLLECTION, id, false).then(() => {
        res.redirect('/admin/gallery/video');
    })
})

router.get('/gallery/enable-video-gallery/:id', (req, res) => {
    let id = req.params.id;
    adminHelper.changeGalleryVisiblity(collections.VIDEO_GALLERY_COLLECTION, id, true).then(() => {
        res.redirect('/admin/gallery/video');
    })
})







//APIs

router.get('/company/home/api', async (req, res) => {
    let companyId = req.query
    let companyDetails = await adminHelper.getCompanyInfo(companyId.id);
    delete companyDetails.password
    res.json({ company: companyDetails });
})
router.get('/view-companies/api', (req, res) => {
    adminHelper.getAllCompanies().then((response) => {
        if (response) {
            response.forEach((element) => {
                delete element.password
                delete element.username
            });
        }
        res.json({ companies: response });
    })
})

module.exports = router;