import '../../node_modules/jquery-modal/jquery.modal.js';
import Vue from '../../node_modules/vue/dist/vue.js';
import 'owl.carousel';
import { API } from './api';
import { Cookie } from './cookie';
import { Auth } from './auth';

import StartComponent from './components/start';
import ArticleComponent from './components/article';
import GetCardComponent from './components/getCard';
import ListComponent from './components/list';
import GameComponent from './components/game';

const _vm = new Vue({
  el: '#app',
  data: {
    loading: false,
    startShow: true,
    articleShow: false,
    getCardShow: false,
    listShow: false,
    gameShow: false,
    articleId: 0,
    user: {
      firstName: '',
      lastName: '',
      photoSmall: ''
    }
  },

  components: {
    startComponent: StartComponent,
    articleComponent: ArticleComponent,
    getCardComponent: GetCardComponent,
    listComponent: ListComponent,
    gameComponent: GameComponent
  },

  mounted: function() {
    console.log('Running App version ! ' + CDN);
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
      API.init();
      if (void 0 !== Cookie.get('token')) {
        API.token = Cookie.get('token');
        this.startApp();
      } else if (document.location.search.indexOf('auth') === -1) {
        Auth.auth();
      }

    
  },
  events: {},
  methods: {
    startApp: function() {
      const that = this;
      API.getUserInfo().then((res) => {
        that.loading = true; // инициализация спиннера
        const roles = API.getData().user.roles;
        that.user = res;
        console.log(that.user);
        const isParent = roles.find(role => {
          return role === 'EduParent';
        });
        that.clearView();
        if (!isParent) { // проверка на родителя
          that.gameShow = true;
        } else {
          that.startShow = true;
        }
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
    },
    onSelectMenu(ev) {
      ev.preventDefault();
      const type = $(ev.target).closest('.top-menu__item').data('type');
      this.clearView();
      this[`${type}Show`] = true;
    },

    clearView() {
      this.startShow = false;
      this.articleShow = false;
      this.getCardShow = false;
      this.listShow = false;
      this.gameShow = false;
    }
  }
});
