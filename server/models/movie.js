const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    keywords: [{ type: String }],
    similarMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    metadata: {
      runtime: Number,
      budget: Number,
      revenue: Number,
      productionCompanies: [String],
      countries: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
movieSchema.index({ title: 1 });
movieSchema.index({ director: 1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ cast: 1 });
movieSchema.index({ averageRating: -1 });
movieSchema.index({ popularity: -1 });

// Pre-save middleware to calculate average rating
movieSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    this.averageRating =
      this.reviews.reduce((acc, review) => acc + review.rating, 0) /
      this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model("Movie", movieSchema);
