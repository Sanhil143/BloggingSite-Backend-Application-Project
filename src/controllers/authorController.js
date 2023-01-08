
const AuthorModel = require('../models/authorModel')
const Validation = require('../validations/validator')
const jwt = require('jsonwebtoken')


// Create an author - atleast 5 authors
// Create a author document from request body. Endpoint: BASE_URL/authors


const authors = async (req, res) => {
      
      try {
            let data = req.body

            if (Object.keys(data).length == 0) {
                  return res.status(400).send({ status: false, msg: "author data is required" })
            }
            //using destructure

            const { fname, lname, title, email, password } = data

            if (!Validation.isValid(fname) || fname == "") {
                  return res.status(400).send({ status: false, msg: "first name is required" })
            }

            if (!Validation.isValid(lname) || lname == "") {
                  return res
                        .status(400)
                        .send({ status: false, msg: "last name is required" })
            }

            if (!Validation.isValid(title) || title == "") {
                  return res
                        .status(400)
                        .send({ status: false, msg: "title is required" })
            }
            if (!["Mr", "Mrs", "Miss"].includes(title)) {
                  return res
                        .status(400)
                        .send({ status: false, msg: "title should contains Mr, Mrs, Miss" })
            }
            if (!email) {
                  return res
                        .status(400)
                        .send({ status: false, msg: "email is required" })
            }
            if (!Validation.isValidEmail(email)) {
                  return res
                        .status(400)
                        .send({ status: false, msg: "invalid email address" })
            }
            const emailUnique = await AuthorModel.findOne({ email: data.email })
            if (emailUnique) {
                  return res
                        .status(400)
                        .send({ status: false, msg: "email is already exist" })
            }
            if (!password) {
                  return res
                        .status(400)
                        .send({ status: false, msg: "password is required" })
            }
            //password case sensitive
            if(!Validation.isValidPassword(password)) {
                  return res
                  .status(400)
                  .send({ msg: "Minimum eight characters, at least one uppercase, one lowercase, one special character and one number" })
            }

            let savedData = await AuthorModel.create(data)
            res.status(201).send({ status: true, msg: savedData })
      }
      catch (err) {
            return res.status(500).send({ status: false, error: err.message })
      }

}


// ------------------ login user --------------------------

const login = async function(req,res){
try{


      let username = req.body.email
      let password = req.body.password

      if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "emailId or Password is required" })
      }

      if(!username){
         return res.status(400).send({msg:"username Must Be Present"})
     }

      if(!password){
      return res.status(400).send({msg:"Password Must Be Present"})
     }
 
      let checkUser = await AuthorModel.findOne({email:username,password:password})
      if(!checkUser){
          return res.status(401).send({status:false,error:"User Not Found"})
      }
       let token = jwt.sign({username:checkUser._id.toString()},process.env.Security_Key)
      
       res.status(200).send({status:true,msg:token})     
      }
      catch(err){
            res.status(404).send({status:false,error :err.message})
      }
}
 

module.exports.login = login
module.exports.authors = authors
  