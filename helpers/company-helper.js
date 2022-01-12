var db = require('../configurations/mongodb-connection')
var collections = require('../configurations/collection')
var Promise = require('promise')
var bcrypt = require('bcrypt')
var dateformat = require('dateformat')
const objectId = require('mongodb').ObjectId;


module.exports = {
    doLogin: (loginData) => {
        console.log('fffffff',loginData)
        return new Promise(async (resolve, reject) => {

            let response = {}
            db.get().collection(collections.COMPANY_COLLECTION).findOne({ username: loginData.email }).then((dataBaseUser)=>{
                console.log('fffffff',dataBaseUser)
                if(dataBaseUser===null || dataBaseUser===undefined){
                    resolve({status:false})
                    console.log('error')
                }
                else{
                    bcrypt.compare(loginData.password, dataBaseUser.password).then((status) => {

                        if (status) {
                            response.user = dataBaseUser
                            response.status = true
                            resolve(response)
                        
                        }
                        else {
                            resolve({ status: false })
                        }
                    })
                }
            })
        })
    },
    doJobPostData : (jobData,userSession)=>{
       
        jobData.companyId =  userSession._id
        jobData.companyName = userSession.name
        jobData.active = true

        jobData.postDate = new Date(jobData.postDate)
        jobData.closeDate = new Date(jobData.closeDate)

   
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOBPOST_COLLECTIONS).insertOne(jobData).then((data)=>{
                // console.log('new data',data)
                resolve(data)
            })
        })
    },
    getJobDetails : (userSession)=>{
        console.log("ffdssdf",userSession._id)
        let id = userSession._id
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOBPOST_COLLECTIONS).find({companyId:id}).sort({_id:-1}).toArray().then((data)=>{ 
                console.log('tday',data)
                resolve(data)
            })
        })
    },
    doJobPostDelete : (deleteId)=>{
        console.log('delete',deleteId)
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOBPOST_COLLECTIONS).deleteOne({_id:objectId(deleteId)}).then((data)=>{
                resolve(data)
            })
        })
    },
    doJobPostEdit : (editId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOBPOST_COLLECTIONS).findOne({_id:objectId(editId)}).then((data)=>{
                resolve(data)
            })
        })
    },
    doJobUpdate : (jobUpdate,id)=>{
        console.log("ggggggg",jobUpdate)
        console.log("dsdsds",id)
        jobUpdate.postDate = new Date(jobUpdate.postDate)
        jobUpdate.closeDate = new Date(jobUpdate.closeDate)
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.JOBPOST_COLLECTIONS).updateOne({_id:objectId(id)},{ 
                $set:{
                    jobCategory : jobUpdate.jobCategory,
                    jobType : jobUpdate.jobType,
                    jobTitle : jobUpdate.jobTitle,
                    postDate : new Date(jobUpdate.postDate),
                    closeDate :  new Date(jobUpdate.closeDate),
                    email : jobUpdate.email,
                    description : jobUpdate.description,
                    skills : jobUpdate.skills,
                    qualification : jobUpdate.qualification,
                }
            }).then((data)=>{
                console.log('success',data)
                resolve(data)
            })
        })
    },
    doJobMode : (id)=>{
        return new Promise(async (resolve,reject)=>{
            let jobData = await db.get().collection(collections.JOBPOST_COLLECTIONS).findOne({_id:objectId(id)})
            console.log('jcxfgzsihfihof',jobData)
            let active = jobData.active
            if(active){
                db.get().collection(collections.JOBPOST_COLLECTIONS).updateOne({_id:objectId(id)},{
                    $set : {
                        active : false
                    }
                }).then((data)=>{
                    resolve(data)
                })
            }
            else{
                db.get().collection(collections.JOBPOST_COLLECTIONS).updateOne({_id:objectId(id)},{
                    $set : {
                        active : true
                    }
                }).then((data)=>{
                    resolve(data)
                })
            }
            
        })
    },
    doChat : ()=>{
        
    }

}