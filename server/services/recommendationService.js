const Movie = require("../models/movie");
const User = require("../models/user");

class RecommendationService {
  static async getPersonalizedRecommendations(userId, limit = 10) {
    const user = await User.findById(userId).populate("preferences");
    if (!user) {
      throw new Error("User not found");
    }

    // Get user's watched, liked, and watchlisted movies
    const watchedMovieIds = user.watchedMovies.map((w) => w.movie.toString());
    const likedMovieIds = user.likedMovies.map((m) => m.toString());
    const watchlistMovieIds = user.watchlist.map((m) => m.toString());

    // Get all movies that the user has interacted with
    const userMovies = await Movie.find({
      _id: {
        $in: [...watchedMovieIds, ...likedMovieIds, ...watchlistMovieIds],
      },
    });

    // Extract common patterns from user's liked and watchlisted movies
    const userGenres = new Set();
    const userDirectors = new Set();
    const userActors = new Set();
    const userLanguages = new Set();

    userMovies.forEach((movie) => {
      if (movie.genres) movie.genres.forEach((genre) => userGenres.add(genre));
      if (movie.director) userDirectors.add(movie.director);
      if (movie.cast) movie.cast.forEach((actor) => userActors.add(actor));
      if (movie.language) userLanguages.add(movie.language);
    });

    // Build recommendation query based on user's movie history
    const query = {
      _id: {
        $nin: [...watchedMovieIds, ...likedMovieIds, ...watchlistMovieIds],
      },
      $or: [
        { genres: { $in: Array.from(userGenres) } },
        { director: { $in: Array.from(userDirectors) } },
        { cast: { $in: Array.from(userActors) } },
        { language: { $in: Array.from(userLanguages) } },
      ],
    };

    // Get recommendations
    const recommendations = await Movie.find(query)
      .sort({ averageRating: -1, popularity: -1 })
      .limit(limit * 2);

    // Calculate recommendation scores and reasons
    const scoredRecommendations = recommendations.map((movie) => {
      let score = 0;
      const reasons = [];

      // Score based on genre match with liked/watchlisted movies
      const genreMatches = movie.genres.filter((g) => userGenres.has(g)).length;
      if (genreMatches > 0) {
        score += genreMatches * 2;
        reasons.push(
          `Similar to your liked/watchlisted movies (${genreMatches} matching genres)`
        );
      }

      // Score based on director match
      if (userDirectors.has(movie.director)) {
        score += 3;
        reasons.push(`From director you've watched: ${movie.director}`);
      }

      // Score based on actor match
      const actorMatches = movie.cast.filter((a) => userActors.has(a)).length;
      if (actorMatches > 0) {
        score += actorMatches;
        reasons.push(
          `Features ${actorMatches} actors from your liked/watchlisted movies`
        );
      }

      // Score based on language match
      if (userLanguages.has(movie.language)) {
        score += 1;
        reasons.push(`In a language you've watched before`);
      }

      // Score based on average rating
      score += movie.averageRating || 0;
      reasons.push(`Highly rated (${(movie.averageRating || 0).toFixed(1)}/5)`);

      return {
        movie,
        score,
        reason: reasons.join(", "),
      };
    });

    // Sort by score and take top recommendations
    const topRecommendations = scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Update user's recommendations
    await User.findByIdAndUpdate(userId, {
      recommendations: topRecommendations.map((rec) => ({
        movie: rec.movie._id,
        score: rec.score,
        reason: rec.reason,
      })),
      lastRecommendationUpdate: new Date(),
    });

    return topRecommendations;
  }

  static async updateUserPreferences(userId, preferences) {
    return User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true }
    );
  }

  static async getSimilarMovies(movieId, limit = 5) {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }

    const query = {
      _id: { $ne: movieId },
      $or: [
        { genres: { $in: movie.genres } },
        { director: movie.director },
        { cast: { $in: movie.cast } },
      ],
    };

    return Movie.find(query).sort({ averageRating: -1 }).limit(limit);
  }
}

module.exports = RecommendationService;
