const mongoose = require("mongoose");

const userReviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
});

const userPreferencesSchema = new mongoose.Schema({
  favoriteGenres: [{ type: String }],
  favoriteDirectors: [{ type: String }],
  favoriteActors: [{ type: String }],
  preferredLanguages: [{ type: String }],
  preferredRuntime: {
    min: Number,
    max: Number,
  },
  preferredReleaseYears: {
    min: Number,
    max: Number,
  },
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
    watchedMovies: [
      {
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        date: { type: Date, default: Date.now },
        rating: Number,
      },
    ],
    reviews: [userReviewSchema],
    preferences: userPreferencesSchema,
    recommendations: [
      {
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        score: Number,
        reason: String,
        date: { type: Date, default: Date.now },
      },
    ],
    lastRecommendationUpdate: Date,
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ "preferences.favoriteGenres": 1 });
userSchema.index({ "preferences.favoriteDirectors": 1 });
userSchema.index({ "preferences.favoriteActors": 1 });

module.exports = mongoose.model("User", userSchema);
