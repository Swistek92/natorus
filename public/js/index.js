/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

//DOM ELEMENTS

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

if (logOutBtn) {
  document.querySelector('.nav__el--logout').addEventListener('click', logout);
}
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// console.log(locations);

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

  // if (logOutBtn) {
  //   console.log('dasd');
  //   logOutBtn.addEventListener('click', logout);
  // }
  console.log('logoutbtn', logOutBtn);
}
