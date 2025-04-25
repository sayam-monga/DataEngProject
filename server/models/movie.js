const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genres: [{ type: String, required: true }],
    language: { type: String, required: true },
    director: { type: String, required: true },
    cast: [{ type: String, required: true }],
    platforms: [{ type: String, required: true }],
    poster: { type: String },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
movieSchema.index({ title: 1 });
movieSchema.index({ director: 1 });
movieSchema.index({ genres: 1 });

module.exports = mongoose.model("Movie", movieSchema);
