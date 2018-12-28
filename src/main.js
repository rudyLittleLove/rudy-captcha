import Vue from "vue";
import App from "./App.vue";
import Captcha from "rudy-captch";

Vue.use(Captcha);

new Vue({
  el: '#app',
  render: h => h(App)
})