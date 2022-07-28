/* eslint-disable */
import axios from 'axios';

const stripe = Stripe(
  'pk_test_51LQHQFJY9lyn3XCq6r8n60xqY02RvScOFyCbNbt9tWCedmR7A9znTy0K3B2WVzI0RN0PX3vrWCnr9XUVqJ1Aq0bW00bD2kZTic'
);

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51LQHQFJY9lyn3XCq6r8n60xqY02RvScOFyCbNbt9tWCedmR7A9znTy0K3B2WVzI0RN0PX3vrWCnr9XUVqJ1Aq0bW00bD2kZTic'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(`api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Create checkout form + chanre credit card
    // await stripe.redirectToCheckout({
    // sessionId: session.data.session.id,
    // });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
