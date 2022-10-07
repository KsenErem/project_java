<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem;">
            <div class="card-body p-5 text-center">

              <div class="mb-md-5 mt-md-4 pb-5">

                <h2 class="fw-bold mb-2 text-uppercase">Вход</h2>
                <p class="text-white-50 mb-5">Введите логин и пароль</p>

                <div class="form-outline form-white mb-4">
                  <input v-model="login" type="email" id="typeEmailX" class="form-control form-control-lg"/>
                  <label class="form-label" for="typeEmailX">Логин</label>
                </div>

                <div class="form-outline form-white mb-4">
                  <input type="password" v-model="password" id="typePasswordX" class="form-control form-control-lg"/>
                  <label class="form-label" for="typePasswordX">Пароль</label>
                </div>

                <button class="btn btn-outline-light btn-lg px-5" @click="AuthUser">Вход</button>


              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      login: '',
      password: '',
      toasts: {
        error: {
          position: "topRight"
        }
      },
    }
  },
  methods: {
    async AuthUser(event) {
      try {
        console.log(this.login, this.password);

        if (!this.login || !this.password) {
          Vue.toast('<label>Введите логин и пароль</label>');
          return;
        }

        let result = await Vue.axios({
          method: 'post',
          url: `${window.apiUrl}/auth/login`,
          data: {
            login: this.login,
            password: this.password
          }
        });
        let data = result.data.data;
        console.log(result);
        if (result.status === 200) {
          console.log(`here`);
          localStorage.setItem("jwt_token", data.token);
          window.location.href = "/";
        }
        console.log(localStorage.getItem("jwt_token"));
      } catch (e) {
        this.$toast.error('Что-то не так', 'Error')
      }
    }
  }
}
</script>
