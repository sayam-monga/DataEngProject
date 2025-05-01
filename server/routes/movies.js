const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/movie");
const User = require("../models/user");
const auth = require("../middleware/auth");
const recommendationService = require("../services/recommendationService");
const router = express.Router();

// Get all movies with user's liked status
router.get("/", auth, async (req, res) => {
  try {
    const movies = await Movie.find();
    const user = await User.findById(req.userId).select("likedMovies");

    const moviesWithLikedStatus = movies.map((movie) => ({
      ...movie.toObject(),
      liked: user.likedMovies.includes(movie._id),
    }));

    res.json(moviesWithLikedStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search movies
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.json([]);
    }

    // Check if the search query is a number (for year search)
    const yearQuery = parseInt(q);
    const isYearSearch = !isNaN(yearQuery);

    // Build the search query
    const searchQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { director: { $regex: q, $options: "i" } },
        { cast: { $regex: q, $options: "i" } },
        { genre: { $regex: q, $options: "i" } },
      ],
    };

    // Add year search if the query is a number
    if (isYearSearch) {
      searchQuery.$or.push({ year: yearQuery });
    }

    // Log the actual search query for debugging
    console.log("Searching for:", q);
    console.log("Search query:", JSON.stringify(searchQuery, null, 2));

    // First, try to find movies with the exact genre match
    const exactGenreMatch = await Movie.find({ genre: q });
    console.log("Exact genre matches:", exactGenreMatch.length);

    // Then find movies with partial matches
    const partialMatches = await Movie.find(searchQuery);
    console.log("Partial matches:", partialMatches.length);

    // Combine results, removing duplicates
    const allMovies = [...new Set([...exactGenreMatch, ...partialMatches])];
    console.log("Total unique movies found:", allMovies.length);

    // Get user's liked status
    const user = await User.findById(req.userId).select(
      "likedMovies watchlist"
    );

    const moviesWithStatus = allMovies.map((movie) => ({
      ...movie.toObject(),
      liked: user.likedMovies.includes(movie._id),
      inWatchlist: user.watchlist.includes(movie._id),
    }));

    res.json(moviesWithStatus);
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ message: "Error searching movies", error: error.message });
  }
});

// Like a movie
router.post("/liked", auth, async (req, res) => {
  try {
    const { movieId } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Add to liked movies if not already liked
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { likedMovies: movieId } },
      { new: true }
    );

    res.json({ message: "Movie liked successfully", liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unlike a movie
router.delete("/liked", auth, async (req, res) => {
  try {
    const { movieId } = req.body;

    // Remove from liked movies
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { likedMovies: movieId } },
      { new: true }
    );

    res.json({ message: "Movie unliked successfully", liked: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's liked movies
router.get("/liked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("likedMovies")
      .select("likedMovies");

    const likedMovies = user.likedMovies.map((movie) => ({
      ...movie.toObject(),
      liked: true,
    }));

    res.json({ likedMovies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to watchlist
router.post("/watchlist", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { watchlist: movieId } },
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove from watchlist
router.delete("/watchlist", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { watchlist: movieId } },
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//1. Append Platforms with Advanced $push
router.post("/:id/platforms", async (req, res) => {
  const { platforms } = req.body; // e.g. ["Max","Paramount+"]
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        platforms: {
          $each: platforms,
          $position: 2,
          $sort: 1,
          $slice: -5,
        },
      },
    },
    { new: true }
  );
  res.json(movie.platforms);
});

//4. Add Unique Cast Members via $addToSet
router.post("/:id/cast", async (req, res) => {
  const { cast } = req.body; // e.g. ["Ken Watanabe"]
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { cast: { $each: cast } } },
    { new: true }
  );
  res.json(movie.cast);
});

//5. Remove Platforms with $pull and $pullAll
router.delete("/:id/platforms", async (req, res) => {
  const { removeAll, platforms } = req.body;
  const update = removeAll
    ? { $pullAll: { platforms } }
    : { $pull: { platforms: platforms[0] } };
  const movie = await Movie.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(movie.platforms);
});

//6. Update a Nested Review with Positional Operator
router.patch("/:movieId/reviews", auth, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.userId;

  try {
    // Step 1: Get the user's name from the User model
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userName = user.username; // Assuming the user's name is stored in the 'name' field

    // Step 2: Add the review to the movie document
    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.movieId },
      {
        $push: {
          reviews: {
            user: userName,
            rating: rating,
            comment: comment,
          },
        },
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie.reviews); // Return the updated reviews
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//7. Aggregate Top Directors by Average Rating
router.get("/directors/top", async (req, res) => {
  const top = await Movie.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        _id: { director: "$director", movie: "$title" },
        avgMovie: { $avg: "$reviews.rating" },
      },
    },
    {
      $group: {
        _id: "$_id.director",
        avgRating: { $avg: "$avgMovie" },
      },
    },
    { $sort: { avgRating: -1 } },
    { $limit: 3 },
  ]);
  res.json(top);
});

//10. Get all the reviews of a movie
router.get("/:id/reviews", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select("reviews");
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie.reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
});

// Add review to a movie
router.post("/:movieId/reviews", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.userId;
    const movieId = req.params.movieId;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    // Get user and movie
    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if user has already reviewed this movie
    const existingReview = movie.reviews.find(
      (review) => review.user === user.username
    );
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this movie",
        existingReview: existingReview,
      });
    }

    // Create review object
    const review = {
      user: user.username,
      rating: rating,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    // Add review to movie
    movie.reviews.push(review);
    await movie.save();

    // Add review to user's reviews array
    user.reviews.push({
      movie: movieId,
      rating: rating,
      comment: comment.trim(),
    });
    await user.save();

    res.status(201).json({
      message: "Review added successfully",
      review: review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
});

// Get reviews for a specific movie
router.get("/:movieId/reviews", async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId).select("reviews");

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Sort reviews by date (newest first)
    const sortedReviews = movie.reviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(sortedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
});

// Get personalized recommendations
router.get("/recommendations", auth, async (req, res) => {
  try {
    const recommendations =
      await recommendationService.getPersonalizedRecommendations(req.userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res
      .status(500)
      .json({ message: "Failed to get recommendations", error: error.message });
  }
});

// Get user preferences
router.get("/preferences", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("preferences");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.preferences || {});
  } catch (error) {
    console.error("Error getting preferences:", error);
    res
      .status(500)
      .json({ message: "Failed to get preferences", error: error.message });
  }
});

// Update user preferences
router.put("/preferences", auth, async (req, res) => {
  try {
    const preferences = req.body;
    const updatedUser = await recommendationService.updateUserPreferences(
      req.userId,
      preferences
    );
    res.json(updatedUser.preferences);
  } catch (error) {
    console.error("Error updating preferences:", error);
    res
      .status(500)
      .json({ message: "Failed to update preferences", error: error.message });
  }
});

module.exports = router;
