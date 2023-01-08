const express = require("express")
const router = express.Router()
const AuthorController = require('../controllers/authorController')
const BlogController = require('../controllers/blogController')
const Middleware = require('../middlewares/commonMiddlewares')


router.post("/authors", AuthorController.authors)

router.post("/blogs",Middleware.commonMiddle, BlogController.blogs)

router.get("/blogs",Middleware.commonMiddle, BlogController.getBlogs)

router.put("/blogs/:blogId",Middleware.commonMiddle, BlogController.updateBlogs)

router.delete("/blogs/:blogId",Middleware.commonMiddle, BlogController.deleteBlog)

router.delete("/blogs",Middleware.commonMiddle, BlogController.deleteBlog2)

//-----------------------------------------

router.post("/login",AuthorController.login)







module.exports = router