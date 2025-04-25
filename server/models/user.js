const mongoose = require("mongoose");

const userReviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        default: [],
      },
    ],
    likedMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        default: [],
      },
    ],
    reviews: [userReviewSchema],
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model("User", userSchema);
