<template>
  <div class="horizonatal">
    <div class="navigation-end-menu">
      <button class="end-button" @click="$router.push('/createReservation')">Создать бронь</button>
    </div>
    <div style="display: flex; justify-content: center">
      <div style="width: 80%; text-align: justify; flex-wrap: nowrap;" class="content">
        <div class="tabs">
          <label class="tab tab-selected" data-gender="1" @click="tabSelected">Мужские</label>
          <label class="tab" data-gender="0" @click="tabSelected">Женские</label>
        </div>
      </div>
    </div>
    <div class="selector" style="display: flex; justify-content: center; margin-top: 20px">
      <div class="selection-previous" @click="decrementDate"><</div>
      <div class="date-picker" :class="{today: this.offsetDays == 0}"><label v-html="selectedDate"></label></div>
      <div class="selection-next" @click="incrementDate">></div>
    </div>
    <div class="table-wrapper">
      <table>

        <tr>

        </tr>

      </table>
    </div>
  </div>
</template>

<script>
import '../css/index.css';
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// @ is an alias to /src
import Vue from "vue";
import moment from "moment";
import Modal from '../components/Modal';

export default {
  name: 'HomePage',
  components: {
    FullCalendar
  },
  data() {
    return {
      login: '',
      password: '',
      selectedGender: '1',
      selectedDate: moment().format("YYYY-MM-DD"),
      offsetDays: 0,
    }
  },
  methods: {
    decrementDate: function () {
      this.offsetDays++;
      this.selectedDate = moment(Date.now()).subtract(this.offsetDays, 'days').format("YYYY-MM-DD");
      this.createTable();
    },
    incrementDate: function () {
      this.offsetDays--;
      this.selectedDate = moment(Date.now()).subtract(this.offsetDays, 'days').format("YYYY-MM-DD");
      this.createTable();
    },
    tabSelected: async function (event) {
      let tabs = document.querySelectorAll(".tab");
      console.log(tabs);
      for (const tab of tabs) {
        tab.classList.remove('tab-selected');
      }
      event.target.classList.add('tab-selected');
      this.selectedGender = event.target.getAttribute('data-gender');
      this.createTable();

    },
    createTable: async function () {
      let gender = this.selectedGender;
      try {
        let result = await Vue.axios({
          method: 'get',
          url: `${window.apiUrl}/reservations/getTable?gender=${gender}`,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
          }
        });

        let data = result.data.data;

        let table = document.querySelector("table");
        let firstRow = document.createElement("tr");

        this.removeAllChildNodes(table);

        for (let i = 0; i < data.columns.length; i++) {
          let currentTime = data.columns[i];
          let tableHeader = document.createElement("th");
          tableHeader.setAttribute('data-time', currentTime);
          tableHeader.innerText = currentTime;
          tableHeader.style.backgroundColor = "#e7e7e7";
          tableHeader.style.fontFamily = "Montserrat";
          tableHeader.style.fontWeight = "800";
          firstRow.append(tableHeader);
        }

        table.append(firstRow);


        for (let i = 0; i < data.rows; i++) {
          let newRow = document.createElement("tr");
          for (let k = 0; k < data.columns.length; k++) {

            let currentTime = data.columns[k];
            let cell = document.createElement("td");
            cell.setAttribute('data-time', currentTime);
            newRow.append(cell);
          }
          table.append(newRow);
        }



        result = await Vue.axios({
          method: 'get',
          url: `${window.apiUrl}/reservations/?start_time=${this.selectedDate} 08:00:00&end_time=${moment(Date.now()).subtract(this.offsetDays - 1, 'days').format("YYYY-MM-DD")} 03:00:00&gender=${this.selectedGender}"`,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
          },
        });
        console.log(`response`, result.data.data);

        var width = document.querySelector('td').getBoundingClientRect().width;

        let rowCounter = 1;


        for (let res = 0; res < result.data.data.length; res++) {
          let currentRow = document.querySelectorAll("table tr")[rowCounter];

          let reservation = result.data.data[res];

          console.log(reservation);

          let startTime = moment(reservation.start_time).local(true);
          console.log(startTime);
          let endTime = moment(reservation.end_time).local(true);
          let duration = endTime.diff(startTime, 'minutes');

          let cellWidth = (duration / 30);
          let pixelWidth = ((duration / 30)) * width;

          let startCell = `${startTime.get('hours') || '00'}:${startTime.get('minutes') || '00'}`;
          let targetCell = currentRow.querySelector(`td[data-time="${startCell}"]`);
          let index = [...currentRow.children].indexOf(targetCell);

          let neededDropOut = false;
          for (let k = index; k < index + cellWidth; k++) {
            if (currentRow.children[k].getAttribute('data-used')) {
              neededDropOut = true;
            }
          }

          if (neededDropOut == true) {
            rowCounter++;
            res--;
            continue;
          }

          console.log(`res`, reservation.status);

          let scheduleCell = document.createElement("a");
          scheduleCell.style.position = "absolute";
          scheduleCell.style.top = "1px";
          scheduleCell.style.left = "2px";
          scheduleCell.setAttribute('href', '#');
          scheduleCell.style.width = `${pixelWidth - 4}px`;
          scheduleCell.style.height = "22px";
          scheduleCell.style.backgroundColor = "#5687D0";
          scheduleCell.style.color = "white";
          if(reservation.status === '1'){
            scheduleCell.style.backgroundColor = "#a3fda3";
            scheduleCell.style.color = "#011854";
          }
          scheduleCell.style.textAlign = "left";
          scheduleCell.style.fontFamily = "Montserrat";
          scheduleCell.style.fontWeight = "600";
          scheduleCell.innerText = reservation.client_name;
          scheduleCell.style.zIndex = "5";
          scheduleCell.style.textDecoration = "none";

          scheduleCell.style.textIndent = "5px";
          scheduleCell.style.overflow = "hidden";
          scheduleCell.style.textOverflow = "ellipsis";
          scheduleCell.setAttribute('data-id', reservation.id);

          scheduleCell.addEventListener("click", async (event) => {
            let id = event.target.getAttribute('data-id');

            result = await Vue.axios({
              method: 'get',
              url: `${window.apiUrl}/reservations/getSingle?id=${id}`,
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
              },
            }).catch(error => {
                console.log(`error here`, error);
            });

            let data = result.data.data;

            this.$modal.show(Modal, {data: data, createTableFunc: this.createTable}, {adaptive: true});
          })


          targetCell.append(scheduleCell);



          for (let k = index; k < index + cellWidth; k++) {
            currentRow.children[k].setAttribute('data-used', 'true');
          }


          rowCounter = 1;
        }

      } catch (error) {
        console.log(`error`, error);
        if (error.response.status === 403) {
          window.location.href = '/login';
        }
      }
    },
    removeAllChildNodes: function (parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    },
  },
  mounted: function () {
    console.log(`vue is `, Vue.$api)
    this.createTable();
  }

}
</script>
