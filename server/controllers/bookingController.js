const Booking = require("../models/bookingModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");


const Show = require("../models/showModel");
const EmailHelper = require("../util/EmailHelper");


const makePayment = async (req, res) => {
  try {
    console.log(req.body, 'payment request');
    // const { token, amount } = req.body;
    const { amount } = req.body;
   
    // Create a Payment Intent using the modern Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise (smallest currency unit for INR)
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "Movie Ticket Booking",
      metadata: {
        booking_type: "movie_ticket"
      }
    });


    res.send({
      success: true,
      message: "Payment intent created successfully",
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};


const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
   
    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
   
    if (paymentIntent.status === 'succeeded') {
      res.send({
        success: true,
        message: "Payment confirmed successfully",
        data: {
          transactionId: paymentIntent.id,
          status: paymentIntent.status
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: `Payment not completed. Status: ${paymentIntent.status}`
      });
    }
  } catch (err) {
    console.error("Payment confirmation error:", err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};


const bookShow = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();


    const show = await Show.findById(req.body.show).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });


    const populateBooking = await Booking.findById(newBooking._id)
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });


    await EmailHelper("ticketTemplate.html", populateBooking.user.email, {
      name: populateBooking.user.name,
      movie: populateBooking.show.movie.movieName,
      theatre: populateBooking.show.theatre.name,
      date: moment(populateBooking.show.date).format("MMM Do YYYY"),
      time: moment(populateBooking.show.time, "HH:mm").format("hh:mm A"),
      seats: populateBooking.seats.join(", "),
      amount: populateBooking.seats.length * populateBooking.show.ticketPrice,
      transactionId: populateBooking.transactionId,
    });


    res.send({
      success: true,
      message: "New Booking done",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });


    res.send({
      success: true,
      message: "Bookings fetched",
      data: bookings,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};


module.exports = { makePayment, confirmPayment, bookShow, getAllBookings };
