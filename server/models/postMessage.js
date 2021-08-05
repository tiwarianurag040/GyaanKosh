import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  creator: String,
  price: String,
  contact: String,
  bookName: String,
  subject: [String],
  selectedFile: String,
  buyCount: {
    type: Number,
    default: 0,
  },
  rejectCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  comments: { type: [String], default: [] },
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
