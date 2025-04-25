// moviesImport.js

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://sayammonga007:QKqx8X0GnxBVtoAW@cluster0.jwx5k.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define review schema
const reviewSchema = new mongoose.Schema({
  user: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
});

// Define Movie schema and model with required fields
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

const Movie = mongoose.model("Movie", movieSchema);

// Movie data with added poster URLs
const moviesData = [
  {
    title: "The Shape of Water",
    year: 2017,
    genres: ["Fantasy", "Drama", "Romance"],
    language: "English",
    director: "Guillermo del Toro",
    cast: ["Sally Hawkins", "Michael Shannon", "Richard Jenkins"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/k4FwHlMhuRR5BISY2Gm2QZHlH5Q.jpg",
    reviews: [],
  },
  {
    title: "Parasite",
    year: 2019,
    genres: ["Thriller", "Drama", "Comedy"],
    language: "Korean",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    platforms: ["Hulu", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    reviews: [],
  },
  {
    title: "The Godfather",
    year: 1972,
    genres: ["Crime", "Drama"],
    language: "English",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    platforms: ["Netflix", "HBO Max"],
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    reviews: [],
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    genres: ["Crime", "Drama"],
    language: "English",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/plnlrtBUULT0rh3Xsjmpubiso3L.jpg",
    reviews: [],
  },
  {
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    language: "English",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    platforms: ["HBO Max", "Netflix"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    reviews: [],
  },
  {
    title: "Inception",
    year: 2010,
    genres: ["Action", "Adventure", "Sci-Fi"],
    language: "English",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    platforms: ["Netflix", "HBO Max"],
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    reviews: [],
  },
  {
    title: "The Revenant",
    year: 2015,
    genres: ["Action", "Adventure", "Drama"],
    language: "English",
    director: "Alejandro González Iñárritu",
    cast: ["Leonardo DiCaprio", "Tom Hardy", "Domhnall Gleeson"],
    platforms: ["Disney+", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/ji3ecJphATlVgWNY0B0RVXZizdf.jpg",
    reviews: [],
  },
  {
    title: "La La Land",
    year: 2016,
    genres: ["Comedy", "Drama", "Music"],
    language: "English",
    director: "Damien Chazelle",
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
    platforms: ["Hulu", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    reviews: [],
  },
  {
    title: "Joker",
    year: 2019,
    genres: ["Crime", "Drama", "Thriller"],
    language: "English",
    director: "Todd Phillips",
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
    platforms: ["HBO Max", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    reviews: [],
  },
  {
    title: "1917",
    year: 2019,
    genres: ["Drama", "War"],
    language: "English",
    director: "Sam Mendes",
    cast: ["George MacKay", "Dean-Charles Chapman", "Mark Strong"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg",
    reviews: [],
  },
  {
    title: "Interstellar",
    year: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    language: "English",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    platforms: ["Netflix", "Paramount+"],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    reviews: [],
  },
  {
    title: "The Truman Show",
    year: 1998,
    genres: ["Comedy", "Drama", "Sci-Fi"],
    language: "English",
    director: "Peter Weir",
    cast: ["Jim Carrey", "Laura Linney", "Noah Emmerich"],
    platforms: ["Netflix", "Paramount+"],
    poster: "https://image.tmdb.org/t/p/w500/vuea0fU0hULp2HpG2VqgdDrGlw5.jpg",
    reviews: [],
  },
  {
    title: "The Social Network",
    year: 2010,
    genres: ["Biography", "Drama"],
    language: "English",
    director: "David Fincher",
    cast: ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    reviews: [],
  },
  {
    title: "Fight Club",
    year: 1999,
    genres: ["Drama"],
    language: "English",
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    platforms: ["Hulu", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    reviews: [],
  },
  {
    title: "Seven",
    year: 1995,
    genres: ["Crime", "Drama", "Mystery"],
    language: "English",
    director: "David Fincher",
    cast: ["Brad Pitt", "Morgan Freeman", "Gwyneth Paltrow"],
    platforms: ["Netflix", "HBO Max"],
    poster: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    reviews: [],
  },
  {
    title: "The Shawshank Redemption",
    year: 1994,
    genres: ["Drama"],
    language: "English",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    platforms: ["Netflix", "HBO Max"],
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    reviews: [],
  },
  {
    title: "Kill Bill: Vol. 1",
    year: 2003,
    genres: ["Action", "Crime", "Thriller"],
    language: "English",
    director: "Quentin Tarantino",
    cast: ["Uma Thurman", "Lucy Liu", "Vivica A. Fox"],
    platforms: ["Netflix", "Hulu"],
    poster: "https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    reviews: [],
  },
  {
    title: "Inglourious Basterds",
    year: 2009,
    genres: ["Adventure", "Drama", "War"],
    language: "English",
    director: "Quentin Tarantino",
    cast: ["Brad Pitt", "Christoph Waltz", "Michael Fassbender"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhXz9jpi4ORR2jrK.jpg",
    reviews: [],
  },
  {
    title: "Dunkirk",
    year: 2017,
    genres: ["Action", "Drama", "History"],
    language: "English",
    director: "Christopher Nolan",
    cast: ["Fionn Whitehead", "Tom Hardy", "Mark Rylance"],
    platforms: ["HBO Max", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
    reviews: [],
  },
  {
    title: "Memento",
    year: 2000,
    genres: ["Mystery", "Thriller"],
    language: "English",
    director: "Christopher Nolan",
    cast: ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg",
    reviews: [],
  },
  {
    title: "The Departed",
    year: 2006,
    genres: ["Crime", "Drama", "Thriller"],
    language: "English",
    director: "Martin Scorsese",
    cast: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"],
    platforms: ["Netflix", "HBO Max"],
    poster: "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq2rYRvpVdR9.jpg",
    reviews: [],
  },
  {
    title: "Whiplash",
    year: 2014,
    genres: ["Drama", "Music"],
    language: "English",
    director: "Damien Chazelle",
    cast: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
    platforms: ["Netflix", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/6uSPcdGNA2A6vJmCagXkvnutegs.jpg",
    reviews: [],
  },
  {
    title: "The Grand Budapest Hotel",
    year: 2014,
    genres: ["Adventure", "Comedy", "Crime"],
    language: "English",
    director: "Wes Anderson",
    cast: ["Ralph Fiennes", "F. Murray Abraham", "Mathieu Amalric"],
    platforms: ["Disney+", "Amazon Prime"],
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    reviews: [],
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
    genres: ["Drama", "Romance", "Sci-Fi"],
    language: "English",
    director: "Michel Gondry",
    cast: ["Jim Carrey", "Kate Winslet", "Gerry Robert Byrne"],
    platforms: ["Netflix", "Hulu"],
    poster: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    reviews: [],
  },
  {
    title: "Spirited Away",
    year: 2001,
    genres: ["Animation", "Adventure", "Family"],
    language: "Japanese",
    director: "Hayao Miyazaki",
    cast: ["Daveigh Chase", "Suzanne Pleshette", "Miyu Irino"],
    platforms: ["HBO Max", "Netflix"],
    poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    reviews: [],
  },
];

// Import function
const importMovies = async () => {
  try {
    await Movie.deleteMany({});
    const result = await Movie.insertMany(moviesData);
    console.log(`${result.length} movies were successfully imported.`);
  } catch (error) {
    console.error("Error importing movies:", error);
  } finally {
    mongoose.connection.close();
  }
};

importMovies();
