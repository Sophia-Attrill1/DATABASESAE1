const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema(
  {
    
     title: String,
    artist: String,
    genre: String,
    difficulty: String,
    completion: String,


    // artist_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Artist",
    // },
    // genre_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Genre",
    // },
    
  },
  { timestamps: true }
);

songSchema.index({'$**': 'text'});
module.exports = mongoose.model("Song", songSchema);
