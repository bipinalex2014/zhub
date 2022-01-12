var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat')
var companyHelper = require('../helpers/company-helper')

/* GET users listing. */
router.get('/', function(req, res) {
  
  if (req.session.loggedIn) {
    res.redirect('/company/job-post')
    
  }
  else {
    console.log('session>>>>>>',req.session)
    //  let logginerr = true
    let error = req.session.logginErr
    res.render('company/login.hbs',{error})
    req.session.logginErr = false
    // req.session.loggedIn = false
  }

});
router.post('/',function(req,res){
  console.log("response>>>>",req.body)
  companyHelper.doLogin(req.body).then((response) => {
    console.log("response>>>>",response)
    if (response.status) {
      // console.log("datas>>>>>",response)
      req.session.loggedIn = true
      req.session.user = response.user
      console.log("session>>>>>",req.session)
      res.redirect('/company/job-post')
    }
    else {
      // console.log("errrrrrrrr")
      req.session.logginErr = "invalid username or password"
      res.redirect('/company/')
    }

  })
})
router.get('/job-post',function(req,res){
  let successStatus = req.session.success
  let message = req.session.successMessage
  if(req.session.loggedIn){
    res.render('company/job-post-form')
  }

  else{  
    res.redirect('/company')
    // req.session.success = false
    // console.log('seeeeeeee',req.session)
  }
    // if(successStatus){
  //   res.render('company/job-post-form',{successStatus,message})
  // }
    
})

router.post('/job-post',function(req,res){
    let userSession = req.session.user
    console.log("gfsdgahdgew",req.session)
    companyHelper.doJobPostData(req.body,userSession).then((data)=>{
      if(data){
        req.session.success = true
      // console.log("ggggggg",req.session)
      req.session.successMessage = "job post is successfully posted"
      res.redirect('/company/job-post')
      }
      // else{
      //   res.redirect('/company/job-post')
      // }
      
    })
})

router.get('/job-modify',function(req,res){
  if(req.session.loggedIn){
    let userSession = req.session.user
    companyHelper.getJobDetails(userSession).then((data)=>{
    // console.log(data)
       if(data){
        data.forEach((element)=>{
          element.postDate = dateFormat(element.postDate,"dd-mm-yyyy")
          element.closeDate = dateFormat(element.closeDate,"dd-mm-yyyy")
        })
       }
       
       res.render('company/job-modify',{data})
    })
  }
  else{
      res.redirect('/company')
  }
})

router.get('/delete/:deleteId', function(req,res){
  let deleteId = req.params.deleteId
  companyHelper.doJobPostDelete(deleteId).then((data)=>{
    res.redirect('/company/job-modify')
  })
})

router.get('/edit/:editId',function(req,res){
  if(req.session.loggedIn){
    let editId = req.params.editId
    console.log('edit ',editId)
    companyHelper.doJobPostEdit(editId).then((data)=>{
      console.log("data",data)
      if(data){
      // data.forEach((element)=>{
        data.postDate = dateFormat(data.postDate,"dd-mm-yyyy")
        data.closeDate = dateFormat(data.closeDate,"dd-mm-yyyy")
      // })
      }
      res.render('company/job-update',{data})
    })
  }
    else{
      res.redirect('/company')
    }
    

})

router.post('/job-update/:id',function(req,res){
  let jobUpdate = req.body
  let id = req.params.id
  // console.log("ggggggg",jobUpdatedata)
  // console.log("dsdsds",id)
  companyHelper.doJobUpdate(jobUpdate,id).then((data)=>{
    res.redirect('/company/job-modify')
  })
})

router.get('/job-post-mode/:id',function(req,res){
  let id = req.params.id
  console.log('hhhhhhh>>>>',id)
  companyHelper.doJobMode(id).then((data)=>{
   
    res.redirect('/company/job-modify')
  })
})
// router.post('/job-post-mode/:id',function(req,res){
//   let id = req.params.id
//   console.log('hhhhhhh>>>>',id)
//   companyHelper.doJobMode(id).then((data)=>{
//     res.json(data)
//     // res.render('company/job-modify',{show})
//   })
// })

router.get('/chat',function(req,res){
  res.render('company/chat')
})

router.get('/chatroom',function(req,res){
  res.render('company/chatroom')
})
router.get('/logout', function (req, res) {
  if (req.session.loggedIn) {
    req.session.destroy()
    res.redirect('/company/')
  }
  else {
    res.redirect('/company/')
  }
})
module.exports = router;
