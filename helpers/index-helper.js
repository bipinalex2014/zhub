const Promise = require('promise');
var db = require('../configurations/mongodb-connection');
const collections = require('../configurations/collection');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

module.exports = {
    getAllActiveNews: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.NEWS_COLLECTION)
                .find({ active: true })
                .sort({ publishdate: -1 })
                .toArray()
                .then((response) => {
                    resolve(response);
                })
        })
    },
    getGalleryData: (coll) => {
        return new Promise((resolve, reject) => {
            db.get().collection(coll)
                .find({ active: true })
                .toArray()
                .then((response) => {
                    resolve(response);
                })
        })
    },
    getJobPost: () => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collections.JOBPOST_COLLECTIONS).aggregate([
                {

                    '$match': {
                        active: true,
                        '$and': [
                            {
                                'postDate': {
                                    '$lte': new Date()
                                }
                            }, {
                                'closeDate': {
                                    '$gte': new Date()
                                }
                            }
                        ]
                    }
                }
            ]).sort({_id:-1}).toArray().then((response) => {
                // console.log('ddfgjii', data)
                resolve(response)
            })

        })
    },
    getJobDetails: (jobId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.JOBPOST_COLLECTIONS).findOne({ _id: ObjectId(jobId) }).then((data) => {
                resolve(data)
            })
        })
    },
    getSearch: (searchData) => {
        console.log('data>>>>>', searchData)
        let string = searchData.toString()
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.JOBPOST_COLLECTIONS).createIndex({ jobTitle: "text" })
            db.get().collection(collections.JOBPOST_COLLECTIONS).find({
                $text: { $search: searchData },
                '$and': [
                    {
                        'postDate': {
                            '$lte': new Date()
                        }
                    }, {
                        'closeDate': {
                            '$gte': new Date()
                        }
                    }
                ]

            }).toArray().then((data) => {
                console.log("search box", data)
                resolve(data)
            })
        })
    }
}