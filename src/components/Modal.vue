<template>
    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px; height: 100%; position: relative">
      <div style="display: flex; flex-direction: column;">
        <label>Имя клиента: <b>{{ data.client_name }}</b></label>
        <label>Номер клиента: <b>{{ data.client_phone }}</b></label>
      </div>
      <div style="position: absolute; bottom: 30px; left: 20px">
        <button
            style="background-color: red; color: white; border: none; font-family: 'Montserrat', sans-serif; font-weight: bold; height: 40px; width: 150px;"
            @click="deleteReservation(data.id)">Удалить бронь
        </button>
      </div>
      <div style="position: absolute; bottom: 30px; right: 20px">
        <button
            style="background-color: lightgreen; color: black; border: none; font-family: 'Montserrat', sans-serif; font-weight: bold; height: 40px; width: 150px;"
            @click="updateStatus(1, data.id)">
          Клиент пришел
        </button>
      </div>
    </div>
</template>


<script>

import Vue from "vue";

export default {
  name: 'Modal',
  components: {},
  props: ['data', 'createTableFunc'],
  data() {
    return {}
  },
  methods: {
    deleteReservation: async function (id) {
      console.log(id);

      let result = await Vue.axios({
        method: 'POST',
        url: `${window.apiUrl}/reservations/deleteById`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
        },
        data: {
          id: id
        }
      }).catch(error => {
        console.log(`error here`, error);
      });

      this.$modal.hideAll();
      this.createTableFunc();
    },

    updateStatus: async function (status, id) {
      console.log(id);

      let result = await Vue.axios({
        method: 'POST',
        url: `${window.apiUrl}/reservations/updateStatus`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
        },
        data: {
          id: id,
          status: status
        }
      }).catch(error => {
        console.log(`error here`, error);
      });

      this.$modal.hideAll();
      this.createTableFunc();
    }
  }
}
</script>