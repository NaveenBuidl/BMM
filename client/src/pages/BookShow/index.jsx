import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getShowById } from "../../apicalls/show";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Modal, message } from "antd";
import moment from "moment";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../../components/PaymentForm';
import { bookShow } from "../../apicalls/bookings";


// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
function BookShow() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const params = useParams();
  const navigate = useNavigate();


  // Function to generate seat layout dynamically
  const getSeats = () => {
    let columns = 12; // Number of columns for seating arrangement
    let totalSeats = show.totalSeats; // Total number of seats
    let rows = Math.ceil(totalSeats / columns); // Calculating number of rows


    return (
      <div className="d-flex flex-column align-items-center">
        <div>
          <div className="w-100 max-width-600 mx-auto mb-25px">
            <p className="text-center mb-10px">
              Screen this side, you will be watching in this direction
            </p>
            <div className="screen-div">
              {/* Placeholder for screen display */}
            </div>
          </div>
          <ul className="seat-ul justify-content-center">
            {Array.from(Array(rows).keys()).map((row) =>
              // Mapping rows
              Array.from(Array(columns).keys()).map((column) => {
                let seatNumber = row * columns + column + 1; // Calculating seat number


                let seatClass = "seat-btn"; // Default class for seat button
                if (selectedSeats.includes(seatNumber)) {
                  seatClass += " selected"; // Adding 'selected' class if seat is selected
                }
                if (show.bookedSeats.includes(seatNumber)) {
                  seatClass += " booked"; // Adding 'booked' class if seat is already booked
                }
                if (seatNumber <= totalSeats) {
                  // Rendering seat button if seat number is valid
                  return (
                    <li key={seatNumber}>
                      {/* Key added for React list rendering optimization */}
                      <button
                        style={{ color: "black" }}
                        className={seatClass}
                        onClick={() => {
                          // Function to handle seat selection/deselection
                          if (selectedSeats.includes(seatNumber)) {
                            setSelectedSeats(
                              selectedSeats.filter(
                                (curSeatNumber) => curSeatNumber !== seatNumber
                              )
                            );
                          } else {
                            setSelectedSeats([...selectedSeats, seatNumber]);
                          }
                        }}
                      >
                        {seatNumber}
                      </button>
                    </li>
                  );
                }
              })
            )}
          </ul>
        </div>


        <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
          <div className="flex-1">
            Selected Seats: <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex-shrink-0 ms-3">
            Total Price:{" "}
            <span>Rs. {selectedSeats.length * show.ticketPrice}</span>
          </div>
        </div>
      </div>
    );
  };


  const bookSeatForUser = async (transactionId) => {
    try {
      dispatch(showLoading());
      const response = await bookShow({
        show: params.showId,
        transactionId,
        seats: selectedSeats,
        user: user._id
      });
      if (response.success) {
        setShowPaymentModal(false);
        message.success("Payment successful! Booking confirmed.");
        navigate("/profile");
      } else {
        message.error(response.message || "Payment failed or booking unsuccessful.");
        setShowPaymentModal(false);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message || "Payment failed or booking unsuccessful.");
      setShowPaymentModal(false);
      dispatch(hideLoading());
    }
  };


  const handlePaymentSuccess = (transactionId) => {
    bookSeatForUser(transactionId);
  };


  useEffect(() => {
    const getShowDetails = async () => {
      try {
        dispatch(showLoading());
        const response = await getShowById(params.showId);
        if (response.success) {
          setShow(response.data);
        } else {
          navigate("/");
        }
        dispatch(hideLoading());
      } catch (err) {
        console.error("Error fetching show details:", err);
        navigate("/");
      }
    };


    getShowDetails();
  }, [dispatch, navigate, params.showId]);


  return (
    <>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.movieName}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3>
                    <span>Show Name:</span> {show.name}
                  </h3>
                  <h3>
                    <span>Date & Time: </span>
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3>
                    <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
                  </h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>{" "}
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()} {/* Rendering dynamic seat layout */}
              {selectedSeats.length > 0 && (
                <div className="max-width-600 mx-auto">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    onClick={() => setShowPaymentModal(true)}
                  >
                    Pay Now - Rs. {selectedSeats.length * show.ticketPrice}
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}


      <Modal
        title="Complete Payment"
        open={showPaymentModal}
        onCancel={() => setShowPaymentModal(false)}
        footer={null}
        width={500}
      >
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={selectedSeats.length * show?.ticketPrice || 0}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </Modal>
    </>
  );
}


export default BookShow;






