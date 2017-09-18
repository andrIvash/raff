//import moment from 'moment';
import './jquery.jscrollpane.min.js';
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
      photoSmall: '',
      id: ''
    },
    info: {
      summ: 0
    },
    userList: []
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

    this.$on('goBack', function() {
      this.clearView();
      this.startShow = true;
    });
    this.$on('goPlay', function() {
      this.clearView();
      this.gameShow = true;
    });
    this.$on('changeArticle', function(id) {
      this.clearView();
      this.articleId = id;
      this.articleShow = true;
    });
  },
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
      }).then(function() {
        API.getKeyFromDB({key: `raff_activity-${that.user.personId}`}, function(res) {
          console.log(res);
          if (res !== null) { // new user
            that.info = {
              lastvisit: Date.now(),
              firstvisit: Date.now(),
              summ: 25,
              articles:[true, false, false, false]
            };
            that.userList.push({
              id: that.user.personId,
              name: `${that.user.firstName} ${that.user.lastName}`,
              city: false,
              photo: `${that.user.photoSmall}`,
              summ: that.info.summ
            });
            console.log(that.info);
            API.addKeyToDB({
              label: 'raff',
              key: `raff_activity-${that.user.personId}`,
              value: JSON.stringify(that.info),
              permissionLevel: 'Public'
            }, function(res) {
              // console.log(res);
              API.addKeyToDB({
                label: 'raff',
                key: 'raff_activity-userList',
                value: JSON.stringify(that.userList),
                permissionLevel: 'Public'
              }, function(res) {
                // console.log(res);
              });
            });
          } else {
            const info = JSON.parse(res.Value);
            that.info = info;
            API.getKeyFromDB({key: 'raff_activity-userList'}, function(res) {
              if (res !== null) {
                that.userList = JSON.parse(res.Value);
                that.updateData(res) // update user data
              } else {
                // API.addKeyToDB({
                //   label: 'raff',
                //   key: 'raff_activity-userList',
                //   value: JSON.stringify(that.userList),
                //   permissionLevel: 'Public'
                // }, function(res) {
                //   // console.log(res);
                // });
              }
            });
          }
        });
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
    },

    updateData(res) {
      console.log(res);
      const that = this;
      const now = moment(Date.now());
      const lastDuration = moment.duration(now.diff(this.info.lastvisit));
      const firstDuration = moment.duration(now.diff(this.info.firstvisit));
      const diffLast = lastDuration.asDays().toFixed();
      const diffFirst = firstDuration.asDays().toFixed();
      console.log(diffFirst, diffLast);
      this.info.lastvisit = Date.now();
      if (diffLast >= 1) {
        this.info.summ = this.info.summ + 25;
      }
      const userIndx = this.userList.findIndex(elem => elem.id === this.user.id);
      if (userIndx !== -1) {
        this.userList[userIndx].summ = this.info.summ;
      }
      let weekOn = diffFirst % 7;
      console.log(weekOn);
      for (let i = 0; i <= weekOn; i++) {
        this.info.articles[i] = true;
      }
      console.log(this.info);
      console.log(this.userList);
      API.addKeyToDB({
        label: 'raff',
        key: `raff_activity-${this.user.personId}`,
        value: JSON.stringify(this.info),
        permissionLevel: 'Public'
      }, function(res) {
        API.addKeyToDB({
          key: 'raff_activity-userList',
          value: JSON.stringify(that.userList),
          permissionLevel: 'Public'
        }, function(res) {

        });
      });
    }
  }
});
