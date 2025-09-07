const express = require("express");
const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getAllTheatresForAnOwner,
} = require("../controllers/theatreController");

const theatreRouter = express.Router();

express().use((req) => {
  console.log(req.body);
});
theatreRouter.post("/add-theatre", addTheatre); // Add a theatre
theatreRouter.get("/get-all-theatres", getAllTheatres); // Get all theatres (For Admin Route)
theatreRouter.get("/get-all-theatres/:ownerId", getAllTheatresForAnOwner); // Get all Individual theatres (For Partner Route)
theatreRouter.put("/update-theatre/:theatreId", updateTheatre); // Update theatre
theatreRouter.delete("/delete-theatre/:theatreId", deleteTheatre); // Delete theatre

module.exports = theatreRouter;
