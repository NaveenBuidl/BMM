const express = require("express");
const { addMovie, getAllMovies, updateMovie, deleteMovie, getMovieById } = require("../controllers/movieController");

const movieRouter = express.Router();

movieRouter.post("/add-movie", addMovie);
movieRouter.get("/get-all-movies", getAllMovies);
movieRouter.get("/movie/:movieId", getMovieById);
movieRouter.put("/update-movie/:movieId", updateMovie);
movieRouter.delete("/delete-movie/:movieId", deleteMovie);

module.exports = movieRouter;
