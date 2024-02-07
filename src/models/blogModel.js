const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({

      title: {
            type: String,
            required: true
      },
      body: {
            type: String,
            required: true
      },
      authorId: {
            type: objectId,
            ref: "Author"
      },
      tags: [String],
      category: {
            type: [String],
            required: true
      },
      subcategory: {
            type:[String]
      },
      deletedAt:{
            type:Date,
            default:null
      },
      isDeleted: {
            type: Boolean,
            default: false
      },
      publishedAt:{
            type:Date,
            default:null
      },
      isPublished: {
            type: Boolean,
            default: false
      },

}, { timestamps: true })

module.exports = mongoose.model("Blogs", blogSchema)
