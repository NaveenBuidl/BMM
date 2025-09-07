const express = require("express");
const {
  addShow,
  getAllTheatresByMovie,
  getAllShowsByTheatre,
  getShowById,
  updateShow,
  deleteShow,
} = require("../controllers/showController");

const showRouter = express.Router();

// Register a user
showRouter.post("/add-show", addShow);
showRouter.get("/get-all-shows-by-theatre/:theatreId", getAllShowsByTheatre);
showRouter.get(
  "/get-all-theatres-by-movie/:movieId/:date",
  getAllTheatresByMovie
);
showRouter.get("/get-show/:showId", getShowById);
showRouter.put("/update-show/:showId", updateShow);
showRouter.delete("/delete-show/:showId", deleteShow);

module.exports = showRouter;
