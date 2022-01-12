var db = require('../configurations/mongodb-connection');
var collections = require('../configurations/collection');
const Promise = require('promise');
const { ObjectId } = require('mongodb');
const generateApiKey = require('generate-api-key');



module.exports = {
    registerApi: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.API_CLIENTS_COLLECTION).findOne({
                email: data.email
            }).then((found) => {
                if (found) {
                    resolve({ status: false, err: "Email address already registered" });
                }
                else {
                    db.get().collection(collections.API_CLIENTS_COLLECTION).insertOne(data).then(async (result) => {
                        const api_key = generateApiKey({ method: 'base62' });
                        console.log(api_key);
                        db.get().collection(collections.API_CLIENTS_COLLECTION).updateOne(
                            {
                                _id: ObjectId(result.insertedId)
                            },
                            {
                                $set: {
                                    api_key: api_key
                                }
                            }
                        )
                            .then(() => {
                                resolve({ status: true, key: api_key });
                            })
                    })
                }
            })
        })
    },
    checkApi: (apiKey) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.API_CLIENTS_COLLECTION).findOne({
                api_key: apiKey
            }).then((result) => {
                if (result) {
                    resolve(result)
                }
                else {
                    reject({ status: false, err: "Invalid API Key" });
                }
            })
        })
    },
    updateApiAccessLog: (apiName, access_member,ip,location) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.API_ACCESS_LOG_COLLECTION).insertOne(
                {
                    accessed: ObjectId(access_member),
                    apiname: apiName,
                    timestamp: new Date(),
                    ipaddress:ip,
                    location:location,
                }

            ).then(() => {
                resolve();
            })
        })
    },
    
}