// Native modules import
import mongoose from "mongoose";

// Constants declaration
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  author: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: Date,
  comments: [{
    message: String,
    created: {
      type: Date,
      default: Date.now
    },
    author: {
      type: ObjectId,
      ref: "User"
    }
  }]
});

export default mongoose.model("Post", postSchema);
