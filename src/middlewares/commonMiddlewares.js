const jwt = require('jsonwebtoken')


const commonMiddle = function (req, res, next) {
      try {
            let token = req.headers["x-api-key"];
            if (!token) {
                  return res.status(400).send({ status: false, Error: "authentication failed, and token must be present" })
            }
            
                  let decodedToken = jwt.verify(token, process.env.Security_Key,(err,decodedToken)=>{
                        
                        if(err){
                              return res.status(400).send({ status: false, msg:"Invalid token"})
                        }
                        else{
                              req.authorId = decodedToken.username
                              // console.log(decodedToken.username);
                              // console.log(req.authorId); 
                              next();
                        }
                  })
                  
                  
                          
      }
      catch (err) {
            return res.status(500).send({ status: false, msg: err.message })
      }
}

// const authorization = async function (req, res, next) {
//       try {
//             loggedUserId = req.headers["loggedUserId"]
//             // console.log(req.headers["loggedUserId"]);
//             if (Object.keys(req.params).length != 0) {
//                   let blogData = await BlogModel.findOne({ _id: req.params.blogId })
//                   let authorId = blogData.authorId
//                   // console.log(authorId);
//                   if (authorId != loggedUserId) {
//                         return res.status(403).send({ status: false, msg: "you are not authorized" })
//                   }
//             }
//             if (req.query.authorId) {
//                   if (req.query.authorId != loggedUserId) {
//                         return res.status(403).send({ status: false, msg: err.message })
//                   }
//             }
//             next();
//       }
//       catch (err) {
//             return res.status(401).send({ status: false, error: err.message })
//       }
// }





module.exports.commonMiddle = commonMiddle;
// module.exports.authorization = authorization;



