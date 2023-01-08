const BlogModel = require('../models/blogModel')
const AuthorModel = require('../models/authorModel')
const Validation = require('../validations/validator')

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require('moment')





//Create a blog document from request body. Get authorId in request body only.

// Make sure the authorId is a valid authorId by checking the author exist in the authors collection.

// Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this

// Create atleast 5 blogs for each author

// Return HTTP status 400 for an invalid request with a response body like this


const blogs = async (req, res) => {

      try {
            let data = req.body
            let { title, body, category, authorId, isPublished } = data;
            console.log(authorId)

            if (Object.keys(data).length < 1) {
                  return res.status(400).send({ msg: "Insert Data : BAD REQUEST" })
            }
            if (!Validation.isValid(title) || title == "") {
                  return res.status(400).send({ msg: "Enter Title" })
            }

            if (!Validation.isValid(body) || body == "") {
                  return res.status(400).send({ msg: "Enter Body" })
            }

            if (!Validation.isValid(category) || category == "") {
                  return res.status(400).send({ msg: "Enter Category" })
            }

            if (!authorId || authorId == "") {
                  return res.status(400).send({ msg: "Enter  Author Id" })
            }

            if (authorId) {
                  let validAuthorId = await AuthorModel.findById(authorId)
                  if (!validAuthorId) {
                        return res
                              .status(400)
                              .send({ status: false, message: "Invalid  authorId" })
                  }
            }
            if (isPublished == true) {
                  data.publishedAt = Date.now()
            }
            let savedData = await BlogModel.create(data)
            res.status(201).send({ status: true, msg: savedData })
      }
      catch (err) {
            res.status(500).send({ status: false, error: err.message })
      }


}


// Get Api
// Returns all blogs in the collection that aren't deleted and are published
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter blogs list by applying filters. Query param can have any combination of below filters.
// By author Id
// By category
// List of blogs that have a specific tag
// List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2

const getBlogs = async (req, res) => {

      try {
            let data = req.query

            let filter = { isDeleted: false, isPublished: true }

            const { category, subcategory, tags, authorId } = data

            if (category) {
                  let verifyCategory = await BlogModel.findOne({ category: category })
                  if (!verifyCategory) {
                        return res
                              .status(404)
                              .send({ status: false, msg: "No blogs in this category" })
                  }
            }
            if (subcategory) {
                  let verifySubCategory = await BlogModel.findOne({ subcategory: subcategory })
                  if (!verifySubCategory) {
                        return res
                              .status(404)
                              .send({ status: false, msg: "No blogs in this subcategory" })
                  }
            }
            if (tags) {
                  let verifyTags = await BlogModel.findOne({ tags: tags }) // it can't return after 0th index 
                  if (!verifyTags) {
                        return res
                              .status(404)
                              .send({ status: false, msg: "No blogs in this tags" })
                  }
            }
            if (authorId) {
                  if (authorId !== req.authorId) {
                        return res
                              .status(400)
                              .send({ status: false, message: "Invalid  authorId" })
                  }

                  let verifyAuthorId = await BlogModel.findOne({ authorId: authorId })
                  if (!verifyAuthorId) {
                        return res
                              .status(400)
                              .send({ status: false, message: "No blogs with this authorId exists" })
                  }
            }

            filter = { ...data, ...filter }      // with rest operator and use like or operator

            let getQueryData = await BlogModel.find(filter)
            let count = await BlogModel.find(filter).count()

            if (getQueryData.length == 0) {
                  return res
                        .status(404)
                        .send({ status: false, message: "No blogs found" })
            }
            else {
                  return res
                        .status(200)
                        .send({ status: true, count: count, message: getQueryData })
            }
      }
      catch (err) {
            res.status(500).send({ status: false, error: err.message })
      }

}

// PUT /blogs/:blogId
// Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true                                 
// Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated blog document.


const updateBlogs = async (req, res) => {
      try {

            let data = req.body

            if (Object.keys(data).length == 0) {
                  return res
                        .status(400)
                        .send({ status: false, msg: "Body should not be Empty.. " })
            }

            const { title, body, category, tags, subcategory, isPublished } = data


            let blogId = req.params.blogId



            let dbdata = await BlogModel.findById({ _id: blogId })
            if (!dbdata) {
                  return res
                        .status(404)
                        .send({ status: false, message: "invalid blogId" });
            }

            if (dbdata.authorId.toString() !== req.authorId) {

                  return res
                        .status(401)
                        .send({ status: false, message: "Authorisation failed" });
            }
            console.log(dbdata.authorId.toString());



            let blog = await BlogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },// isDeleted: false  
                  {
                        $set: { isPublished: isPublished, body: body, title: title, publishedAt: Date.now() },
                        $push: { category: category, tags: tags, subcategory: subcategory }
                  },
                  { new: true })
            if (!blog) {
                  return res.status(400).send({ status: false, msg: "already deleted" })
            }
            return res.status(200).send({ status: true, msg: blog })


      } catch (err) {
            res.status(500).send({ status: false, error: err.message })
      }
}


//delete api using params

const deleteBlogs1 = async function (req, res) {
      try {

            let blogId = req.params.blogId

            let blog = await BlogModel.findById({ _id: blogId, isDeleted: false, })
            if (!blog) {
                  return res.status(404).send({ status: false, error: "No such blog exists" })
            }

            if (blog.authorId.toString() !== req.authorId) {

                  return res
                        .status(401)
                        .send({ status: false, message: "Authorisation failed" });
            }


            if (blog.isDeleted == true) {
                  return res.status(400).send({ status: false, error: "document already deleted" })
            }


            updatedData = await BlogModel.findOneAndUpdate({ _id: blogId },
                  { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

            return res.status(200).send({ status: true, msg: "daleted successfully" })

      }
      catch (err) {
            return res.status(400).send({ status: false, error: err.message })
      }
}

// / DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

//delete Api using query parama

const deleteBlogs2 = async (req, res) => {
      try {
            let loggedUserId = req.authorId
            let data = req.query

            const { category, authorId, tags, subcategory, isPublished } = data;

            if (authorId) {
                  if (!ObjectId.isValid(authorId)) {
                        return res.status(400).send({ status: false, msg: "invalid author id" })
                  }

                  if (data.authorId !== loggedUserId) {
                        return res
                              .status(401)
                              .send({ status: false, message: "Authorisation failed" })
                  }

                  let deletedData = await BlogModel.updateMany({ authorId: authorId, isDeleted: false, isPublished: false, }, { isDeleted: true, deletedAt: Date.now() });
                  if (deletedData.modifiedCount != 0) {
                        return res.status(200).send({ status: true, msg: "deleted successfully" })
                  }
                  console.log(data.authorId);
            }

            if (category) {
                  let deletedData = await BlogModel.updateMany({ category: category, isDeleted: false, isPublished: false, authorId: loggedUserId }, { isDeleted: true, deletedAt: Date.now() });
                  if (deletedData.modifiedCount != 0) {
                        return res.status(200).send({ status: true, msg: "deleted successfully" })
                  }
            }

           

            if (tags) {
                  let findedData = await BlogModel.find({ isDeleted: false });
                  let filteredData = findedData.filter((doc) => {
                        let alltag = doc.tags;
                        return alltag.find(tag => tag == tags)
                  })
                  let idArr = [];
                  filteredData.forEach(doc => {
                        idArr.push(doc._id)
                  })
                  let deletedData = await BlogModel.updateMany({ _id: { $in: idArr }, authorId: loggedUserId, isPublished: false }, { isDeleted: true, deletedAt: Date.now() })
                  if (deletedData.modifiedCount != 0) {
                        return res.status(200).send({ status: true, msg: "deleted successfully" })
                  }
            }

            if (subcategory) {
                  let findedData = await BlogModel.find({ isDeleted: false });
                  let filteredData = findedData.filter((doc) => {
                        let alltag = doc.subcategory;
                        return alltag.find(subcat => subcat == subcategory)
                  })
                  let idArr = [];
                  filteredData.forEach(doc => {
                        idArr.push(doc._id)
                  })
                  let deletedData = await BlogModel.updateMany({ _id: { $in: idArr }, authorId: loggedUserId, isPublished: false }, { isDeleted: true, deletedAt: Date.now() })
                  if (deletedData.modifiedCount != 0) {
                        return res.status(200).send({ status: true, msg: "deleted successfully" })
                  }
            }

            if (isPublished) {
                  if (req.query.isPublished == "true") {
                        return res.status(400).send({ status: false, msg: "Document published is not deleted" })
                  }
                  let deletedData = await BlogModel.updateMany({ isPublished: isPublished, isDeleted: false, authorId: loggedUserId }, { isDeleted: true, deletedAt: Date.now() });
                  if (deletedData.modifiedCount != 0) {
                        return res.status(200).send({ status: true, msg: "deleted successfully" })
                  }
            }
            return res.status(404).send({ status: false, msg: "no data is found to be deleted" })
      }
      catch (err) {
            res.status(500).send({ status: false, msg: err.message })
      }

}




module.exports.blogs = blogs
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlog = deleteBlogs1
module.exports.deleteBlog2 = deleteBlogs2