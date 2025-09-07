import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getMovieById } from "../../apicalls/movie";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { Input, Divider, Row, Col, Button, message } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getAllTheatresByMovie } from "../../apicalls/show";
import moment from "moment";


const Movie = () => {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState(moment(searchParams.get("date")).format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleDate = (e) => {
    const selectedDate = e.target.value;
    setDate(moment(selectedDate).format("YYYY-MM-DD"));
    navigate(`/movies/${params.movieId}?date=${selectedDate}`);
  };


  // Function to check if booking is allowed (15 minutes before show time)
  const isBookingAllowed = (showTime) => {
    const selectedDate = moment(date);
    const currentDate = moment();


    // If selected date is in the future, allow booking
    if (selectedDate.isAfter(currentDate, 'day')) {
      return true;
    }


    // If selected date is today, check time
    if (selectedDate.isSame(currentDate, 'day')) {
      const showDateTime = moment(`${date} ${showTime}`, 'YYYY-MM-DD HH:mm');
      const timeDifference = showDateTime.diff(currentDate, 'minutes');
      return timeDifference >= 15;
    }


    // If selected date is in the past, don't allow booking
    return false;
  };


  // Function to get button status and message
  const getButtonStatus = (showTime) => {
    const selectedDate = moment(date);
    const currentDate = moment();


    if (selectedDate.isAfter(currentDate, 'day')) {
      return { disabled: false, text: 'Available', type: 'primary' };
    }


    if (selectedDate.isSame(currentDate, 'day')) {
      const showDateTime = moment(`${date} ${showTime}`, 'YYYY-MM-DD HH:mm');
      const timeDifference = showDateTime.diff(currentDate, 'minutes');


      if (timeDifference < 0) {
        return { disabled: true, text: 'Show Started', type: 'default' };
      } else if (timeDifference < 15) {
        return { disabled: true, text: `Closes in ${15 - timeDifference}min`, type: 'default' };
      } else {
        return { disabled: false, text: 'Available', type: 'primary' };
      }
    }


    return { disabled: true, text: 'Past Date', type: 'default' };
  };


  const handleShowClick = (showId, showTime) => {
    if (isBookingAllowed(showTime)) {
      navigate(`/book-show/${showId}`);
    } else {
      const status = getButtonStatus(showTime);
      message.warning(`Booking not available: ${status.text}`);
    }
  };


  useEffect(() => {
    const getMovie = async () => {
      try {
        dispatch(showLoading());
        const response = await getMovieById(params.movieId);
        if (response.success) {
          setMovie(response.data);
        } else {
          message.error(response.message);
        }
        dispatch(hideLoading());
      } catch (err) {
        message.error(err.message);
        dispatch(hideLoading());
      }
    };


    getMovie();
  }, []);


  useEffect(() => {
    const getAllTheatres = async () => {
      try {
        dispatch(showLoading());
        const response = await getAllTheatresByMovie(params.movieId, date);
        if (response.success) {
          setTheatres(response.data)
        } else {
          message.warning("No movies showing on that date");
        }
        dispatch(hideLoading());
      } catch (err) {
        message.warning("No movies showing on that date");
        dispatch(hideLoading());
      }
    };


    getAllTheatres();
  }, [date]);


  return (
    <>
      <div className="inner-container">
        {movie && (
          <div className="d-flex single-movie-div">
            <div className="flex-Shrink-0 me-3 single-movie-img">
              <img src={movie.poster} width={150} alt="Movie Poster" />
            </div>
            <div className="w-100">
              <h1 className="mt-0">{movie.title}</h1>
              <p className="movie-data">
                Language: <span>{movie.language}</span>
              </p>
              <p className="movie-data">
                Genre: <span>{movie.genre}</span>
              </p>
              <p className="movie-data">
                Release Date:{" "}
                <span>{moment(movie.date).format("MMM Do YYYY")}</span>
              </p>
              <p className="movie-data">
                Duration: <span>{movie.duration} Minutes</span>
              </p>
              <hr />
              <div className="d-flex flex-column-mob align-items-center mt-3">
                <label className="me-3 flex-shrink-0">Choose the date:</label>
                <div className="date-picker-input">
                  <Input
                    onChange={handleDate}
                    type="date"
                    min={moment().format("YYYY-MM-DD")}
                    className="max-width-300 mt-8px-mob"
                    value={date}
                  />
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Current time display for reference */}
        <div className="mt-3 p-3" style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderLeft: '4px solid #1890ff',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Current Time: {moment().format("MMMM Do YYYY, h:mm:ss a")}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            * Booking closes 15 minutes before show time
          </div>
        </div>


        {theatres.length === 0 && (
          <div className="pt-3">
            <h2 className="blue-clr">
              Currently, no theatres available for this movie!
            </h2>
          </div>
        )}


        {theatres.length > 0 && (
          <div className="theatre-wrapper mt-3 pt-3">
            <h2>Theatres</h2>
            {theatres.map((theatre) => {
              return (
                <div key={theatre._id}>
                  <Row gutter={24} key={theatre._id}>
                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                      <h3>{theatre.name}</h3>
                      <p>{theatre.address}</p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                      <div className="show-times-container">
                        {theatre.shows
                          .sort(
                            (a, b) =>
                              moment(a.time, "HH:mm") -
                              moment(b.time, "HH:mm")
                          )
                          .map((singleShow) => {
                            const isAllowed = isBookingAllowed(singleShow.time);
                            const buttonStatus = getButtonStatus(singleShow.time);


                            return (
                              <div key={singleShow._id} className="show-time-item" style={{
                                display: 'inline-block',
                                margin: '5px',
                                textAlign: 'center'
                              }}>
                                <Button
                                  type={isAllowed ? "primary" : "default"}
                                  disabled={!isAllowed}
                                  onClick={() => handleShowClick(singleShow._id, singleShow.time)}
                                  icon={<ClockCircleOutlined />}
                                  style={{
                                    minWidth: '100px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isAllowed ? 1 : 0.6
                                  }}
                                >
                                  {moment(singleShow.time, "HH:mm").format("hh:mm A")}
                                </Button>
                                {!isAllowed && (
                                  <div style={{
                                    fontSize: '10px',
                                    color: '#ff4d4f',
                                    marginTop: '4px',
                                    maxWidth: '100px',
                                    lineHeight: '1.2'
                                  }}>
                                    {buttonStatus.text}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </Col>
                  </Row>
                  <Divider />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};


export default Movie;
