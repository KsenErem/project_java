import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from "../views/LoginView";
import AboutView from "../views/AboutView"
import HomePage from "../views/HomePage";
import CreateReservationView from "../views/CreateReservationView";

Vue.use(VueRouter)

import axios from "axios";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    beforeEnter: (to, from, next) => {
      guard(to, from, next);
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/createReservation',
    name: 'createReservation',
    component: CreateReservationView,
    beforeEnter: (to, from, next) => {
      guard(to, from, next);
    }
  }
]



async function guard(to, from, next) {
  console.log(window.apiUrl);
  let token = localStorage.getItem("jwt_token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  axios.post(`${window.apiUrl}/auth/checkToken`, {}, config).then(response => {
    // Token is valid, so continue
    next();
  }).catch(error => {
    // There was an error so redirect
    window.location.href = "/login";
  })

}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});




export default router
