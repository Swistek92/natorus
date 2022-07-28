/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// import Stripe from 'Stripe';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51LQHQFJY9lyn3XCq6r8n60xqY02RvScOFyCbNbt9tWCedmR7A9znTy0K3B2WVzI0RN0PX3vrWCnr9XUVqJ1Aq0bW00bD2kZTic'
  );
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    //works as expected
    // window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
