<template>
  <div class="reservation-box" :data-user="userID">
    <div class="tabs">
      <label class="tab tab-selected" data-gender="1" @click="tabSelected">Мужские</label>
      <label class="tab" data-gender="0" @click="tabSelected">Женские</label>
    </div>

    <div class="user-box">
      <div class="column">
        <input v-model="name" placeholder="Имя" style="display: block;">
        <input v-model="phone" placeholder="Номер телефона" style="display: block">
      </div>
      <div class="column horizontal">
        <div class="selection-previous" @click="decrementDate"><</div>
        <div class="date-picker"><label v-html="reservationPeriod.date"></label></div>
        <div class="selection-next" @click="incrementDate">></div>
        <div class="spacer">-</div>
        <div class="time-selector">
          <masked-input v-model="reservationPeriod.startTime" mask="11:11" placeholder="00:00" />
          <label>-</label>
          <masked-input v-model="reservationPeriod.endTime" mask="11:11" placeholder="00:00" />
        </div>

      </div>
    </div>
    <button class="create-reservation-button" @click="createReservation">Создать бронь</button>
  </div>

</template>

<script>

import moment from "moment";
import Vue from "vue";
import MaskedInput from 'vue-masked-input';

export default {
  name: "Reservation",
  props: {
    userID: ''
  },
  data() {
    return {
      offsetDays: 0,
      name: '',
      phone: '',
      reservationPeriod: {
        date: moment().format("YYYY-MM-DD"),
        startTime: '',
        endTime: ''
      },
      selectedGender: 1
    }
  },
  components:{
    MaskedInput
  },
  methods: {
    tabSelected: async function (event) {
      let query = `.reservation-box[data-user='${this.$props.userID}'] label.tab`;
      let tabs = document.querySelectorAll(query);

      console.log(tabs);

      for (const tab of tabs) {
        //console.log(tab);
        tab.classList.remove('tab-selected');
      }
      event.target.classList.add('tab-selected');

      this.selectedGender = event.target.getAttribute('data-gender');
    },
    decrementDate: function () {
      this.offsetDays++;
      this.reservationPeriod.date = moment(Date.now()).subtract(this.offsetDays, 'days').format("YYYY-MM-DD");
    },
    incrementDate: function () {
      this.offsetDays--;
      this.reservationPeriod.date = moment(Date.now()).subtract(this.offsetDays, 'days').format("YYYY-MM-DD")
    },
    createReservation: async function(){
      if(!this.name || !this.phone || !this.reservationPeriod.startTime || !this.reservationPeriod.endTime){
        this.$toast.error('Заполните все поля клиента', 'Ошибка');
        return;
      }

      if(this.reservationPeriod.startTime.split(':')[1] !== '00' && this.reservationPeriod.startTime.split(':')[1] !== '30'){
        this.$toast.error('Минуты брони могут быть только :00 либо :30', 'Ошибка');
        return;
      }

      if(this.reservationPeriod.endTime.split(':')[1] !== '00' && this.reservationPeriod.endTime.split(':')[1] !== '30'){
        this.$toast.error('Минуты брони могут быть только :00 либо :30', 'Ошибка');
        return;
      }
      // 2022-07-03 17:30:00
      let startDate = moment(Date.now()).subtract(this.offsetDays, 'days').format("YYYY-MM-DD");
      let endDate = moment(Date.now()).subtract(this.offsetDays, 'days').format("YYYY-MM-DD");
      if(this.reservationPeriod.endTime.split(':')[0] < this.reservationPeriod.startTime.split(':')[0]){
        console.log(`another day`);
        endDate = moment(Date.now()).subtract(this.offsetDays - 1, 'days').format("YYYY-MM-DD")
      }

      let startTime = `${startDate} ${this.reservationPeriod.startTime}:00`;
      let endTime = `${endDate} ${this.reservationPeriod.endTime}:00`;

      try {
        let result = await Vue.axios({
          method: 'post',
          url: `${window.apiUrl}/reservations/create`,
          data: {
            start_time: startTime,
            end_time: endTime,
            gender: this.selectedGender,
            name: this.name,
            phone: this.phone
          },
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
          }
        });
        let data = result.data.data;
        console.log(data);

        if(result.status === 200){
          this.$toast.success("Добавлено", "Получилось!", {position: "bottomCenter"});
        }
      }
      catch(error){
        this.$toast.error(error.response.data.message, 'Ошибка')
      }
    }
  }
}
</script>
