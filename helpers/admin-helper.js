const Promise = require('promise');
var db = require('../configurations/mongodb-connection');
const collections = require('../configurations/collection');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

module.exports = {
    createCompany: async (info) => {
        info.status = true;
        info.blockStatus = false;
        info.password = await bcrypt.hash(info.password, 8);
        delete info.confirmpassword;
        return new Promise((resolve, reject) => [
            db.get().collection(collections.COMPANY_COLLECTION).insertOne(info).then(() => {
                resolve();
            })
        ])
    },
    getAllCompanies: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COMPANY_COLLECTION).find().toArray().then((result) => {
                resolve(result);
            })
        })
    },
    getCompanyInfo: (companyId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COMPANY_COLLECTION).findOne({ _id: ObjectId(companyId) }).then((response) => {
                resolve(response);
            })
        });
    },
    getAllBuildings: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BUILDING_COLLECTION).find().toArray().then((buildings) => {
                resolve(buildings)
            })
        })
    },
    createNews: (data) => {
        data.publishdate = new Date();
        data.active = true;
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION).insertOne(data).then((response) => {
                resolve(response);
            })
        })
    },
    updateImagePath: (id, fileName) => {
        console.log(id);
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION).updateOne({
                _id: ObjectId(id)
            }, {
                $set: {
                    filename: fileName
                }
            }).then((response) => {
                resolve(response);
            })
        })
    },
    getAllNews: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION).find().toArray().then((response) => {
                resolve(response);
            })
        })
    },
    disableNews: (newsId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION).updateOne({
                _id: ObjectId(newsId),
            }, {
                $set: {
                    active: false,
                }
            }).then(() => {
                resolve();
            })
        })
    },
    reactivateNews: (newsId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION).updateOne({
                _id: ObjectId(newsId),
            }, {
                $set: {
                    active: true,
                }
            }).then(() => {
                resolve();
            })
        })
    },
    getNewsDetails: (newsId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION).findOne({ _id: ObjectId(newsId) }).then((result) => {
                resolve(result);
            })
        })
    },
    createPhotoGallery: (data) => {
        data.timestamp = new Date();
        data.active = true;
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PHOTO_GALLERY_COLLECTION).insertOne(data)
                .then((response) => {
                    // console.log(response);
                    resolve(response.insertedId);
                })
        })
    },
    pushImageFiles: (id, filename) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PHOTO_GALLERY_COLLECTION).updateOne({
                _id: ObjectId(id)
            }, {
                $push: {
                    files: filename,
                }
            }).then(() => {
                resolve();
            })
        })
    },
    getPhotoGalleryData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PHOTO_GALLERY_COLLECTION).aggregate(
                [
                    {
                        '$project': {
                            'title': 1,
                            'subtitle': 1,
                            'active': 1,
                            'count': {
                                '$size': '$files'
                            }
                        }
                    }
                ]
            ).toArray().then((response) => {
                resolve(response);
            })
        })
    },
    getFiles: (coll, galId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(coll).aggregate(
                [
                    {
                        '$match': {
                            '_id': ObjectId(galId)
                        }
                    }, {
                        '$project': {
                            'files': 1,
                            '_id': 0
                        }
                    }
                ]
            ).toArray().then((result) => {
                resolve(result[0].files);
            })
        })
    },
    removeGallery: (coll, id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(coll).remove({
                _id: ObjectId(id),
            }).then(() => {
                resolve();
            })
        })
    },
    changeGalleryVisiblity: (coll, gal_id, status) => {
        return new Promise((resolve, reject) => {
            db.get().collection(coll).updateOne({
                _id: ObjectId(gal_id),
            }, {
                $set: {
                    active: status,
                }
            }).then(() => {
                resolve();
            })
        })
    },
    createVideoGallery: (data) => {
        data.active = true;
        data.timestamp = new Date();
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VIDEO_GALLERY_COLLECTION).insertOne(data)
                .then((response) => {
                    // console.log(response);
                    resolve(response.insertedId);
                })
        })
    },
    pushVideoFiles: (id, filename) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VIDEO_GALLERY_COLLECTION).updateOne({
                _id: ObjectId(id)
            }, {
                $push: {
                    files: filename,
                }
            }).then(() => {
                resolve();
            })
        })
    },
    getVideoGalleryData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VIDEO_GALLERY_COLLECTION).aggregate(
                [
                    {
                        '$project': {
                            'title': 1,
                            'subtitle': 1,
                            'active': 1,
                            'count': {
                                '$size': '$files'
                            }
                        }
                    }
                ]
            ).toArray().then((response) => {
                resolve(response);
            })
        })
    },
    setBlockStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COMPANY_COLLECTION)
                .updateOne({
                    _id: ObjectId(id)
                },
                    {
                        $set: {
                            blockStatus: status,
                        }
                    }).then(() => {
                        resolve();
                    })
        })
    }
}
