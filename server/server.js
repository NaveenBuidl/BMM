const helmet = require("helmet");
const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const userRouter = require("./routes/userRoutes");
const movieRouter = require("./routes/movieRoutes");
const theatreRouter = require("./routes/theatreRoutes");
const showRouter = require("./routes/showRoutes");
const bookingRouter = require("./routes/bookingRoutes");

require("dotenv").config();

// Conect to DB
require("./config/db.js");

const app = express();

app.disable("x-powered-by"); // it will remove the x-powered-by header from the response

// Sanitize user input to prevent MongoDB Operator Injection
app.use(mongoSanitize());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        imgSrc: ["*"], // Allow images from any source
        // add other directives as needed
      },
    },
  })
);

// Rate Limiter Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs (defined above)
  message: "Too many requests from this IP. Please, try again in 15 minutes",
});


app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

// Apply rate limiter to all API routes
app.use("/api/", apiLimiter);

app.use("/api/users", userRouter); // Route for all user operations
app.use("/api/movies", movieRouter); // Route for all movie operations
app.use("/api/theatre", theatreRouter); // Route for all theatre operations
app.use("/api/show", showRouter); // Route for all show operation
app.use("/api/booking", bookingRouter); // Route for all booking operation


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const publicPath = path.join(__dirname, "../client/dist");
app.use(express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use((req, res) => {
  res.status(404).send("Page not found!!!");
});
