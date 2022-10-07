<template>
  <div class="horizonatal">
    <div class="navigation-menu">
        <button class="start-button" @click="$router.push('/')">← На главную</button>
        <button class="center-button">Создание брони</button>
    </div>
    <div class="content">
      <Reservation userID="1"></Reservation>
      <Reservation userID="2"></Reservation>
    </div>
  </div>
</template>

<script>

import '../css/index.css';

import Reservation from "../components/Reservation";

export default {
  name: 'CreateReservation',
  components: { Reservation },
  data() {
    return {

    }
  },
  methods: {

  },

}
</script>