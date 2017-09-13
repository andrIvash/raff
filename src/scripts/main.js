import '../../node_modules/jquery-modal/jquery.modal.js';
import Vue from '../../node_modules/vue/dist/vue.js';
import 'owl.carousel';

import StartComponent from './components/start';
import ArticleComponent from './components/article';
import GetCardComponent from './components/getCard';
import ListComponent from './components/list';
import GameComponent from './components/game';

const _vm = new Vue({
  el: '#app',
  data: {
    loading: false,
    startShow: false,
    articleShow: false,
    getCardShow: false,
    listShow: true,
    gameShow: false,
    articleId: 0,
    user: ''
  },

  components: {
    startComponent: StartComponent,
    articleComponent: ArticleComponent,
    getCardComponent: GetCardComponent,
    listComponent: ListComponent,
    gameComponent: GameComponent
  },

  mounted: function() {
    const that = this;
    const backTop = $('#back-top');
    backTop.hide();
    $(window).scroll(function() {
      if ($(this).scrollTop() > 500) {
        backTop.fadeIn();
      } else {
        backTop.fadeOut();
      }
    });
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
    },

    onBackTop(event) {
      event.preventDefault();
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    }
  }
});
