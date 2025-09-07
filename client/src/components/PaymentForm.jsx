import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Input, Form, Space, Typography, App } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/loaderSlice';
import { makePayment, confirmPayment } from '../apicalls/bookings';


const { Title } = Typography;


const PaymentForm = ({ amount, onPaymentSuccess }) => {
  const { message } = App.useApp();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [country, setCountry] = useState("IN");


  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!stripe || !elements) {
      return;
    }


    setProcessing(true);
    dispatch(showLoading());


    try {
      // Step 1: Create payment intent on the server
      const paymentResponse = await makePayment({ amount });
     
      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message);
      }


      const { clientSecret, paymentIntentId } = paymentResponse.data;


      // Step 2: Confirm payment on the client side
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            address: {
              line1,
              country
            }
          }
        }
      });


      if (error) {
        console.error('Payment failed:', error);
        message.error(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        // Step 3: Confirm payment status on server
        const confirmResponse = await confirmPayment({ paymentIntentId });
       
        if (confirmResponse.success) {
          message.success('Payment successful!');
          onPaymentSuccess(paymentIntentId);
        } else {
          throw new Error('Payment confirmation failed');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      message.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
      dispatch(hideLoading());
    }
  };


  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };


  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
        />
        <input
          type="text"
          placeholder="Address Line 1"
          value={line1}
          onChange={e => setLine1(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
        />
        <input
          type="text"
          placeholder="Country (e.g. IN)"
          value={country}
          onChange={e => setCountry(e.target.value.toUpperCase())}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
        />
      </div>
      <div className="card-element-container" style={{
        padding: '16px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        marginBottom: '16px'
      }}>
        <CardElement options={cardElementOptions} />
      </div>
      <Button
        type="primary"
        htmlType="submit"
        loading={processing}
        disabled={!stripe || processing}
        size="large"
        block
        shape="round"
      >
        {processing ? 'Processing...' : `Pay Rs. ${amount}`}
      </Button>
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <p>Test Card Numbers:</p>
        <p>• 4242 4242 4242 4242 (Visa)</p>
        <p>• Use any future date for expiry and any 3-digit CVC</p>
      </div>
    </form>
  );
};


export default PaymentForm;


