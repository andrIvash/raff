import '../../node_modules/jquery-modal/jquery.modal.js';
import Vue from '../../node_modules/vue/dist/vue.js';

import StartComponent from './components/start';

const _vm = new Vue({
  el: '#app',
  data: {
    loading: false,
    user: ''
  },

  components: {
    startComponent: StartComponent
  },

  mounted: function() {
    var that = this;
    // this.loading = true; // инициализация спиннера
    console.log('Running App version ! ' + CDN);
    this.getData().then(function() {
      that.loading = true;
    }).catch(function() {
      console.log('fail');
    });
  },
  events: {},
  methods: {
    getData: function() {
      console.log('get data');
      // var that = this;
      // return $.ajax({
      //   url: '/teachers/getCourseTeachers/' + courseId,
      //   method: "GET",
      //   success: function(res) {
      //     that.teachers = res;
      //   }
      // });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('getted');
          resolve();
        }, 2000);
      });
    },
    onShowMenu(even) {
      event.preventDefault();
      $('.top-menu').toggle('fast');
    }
  }
});
