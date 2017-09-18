//import moment from 'moment';
import './jquery.jscrollpane.min.js';
import '../../node_modules/jquery-modal/jquery.modal.js';
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
    userList: [],
    showScenario: false
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
          if (res === null) { // new user
            that.info = {
              lastvisit: Date.now(),
              firstvisit: Date.now(),
              summ: 25,
              articles: [
                {
                  status: true,
                  commented: false,
                  like: false
                },
                {
                  status: false,
                  commented: false,
                  like: false
                },
                {
                  status: false,
                  commented: false,
                  like: false
                },
                {
                  status: false,
                  commented: false,
                  like: false
                }
              ],
              mood: 100,
              health: 100,
              food: 100,
              nextPayment: '31/12/18'

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

    getNexDay(dayNumber) { // получить дату следующего дня недели 4 for Thursday
      // if we haven't yet passed the day of the week that I need:
      if (moment().isoWeekday() <= dayNumber) {
        // then just give me this week's instance of that day
        return moment().isoWeekday(dayNumber);
      } else {
        // otherwise, give me next week's instance of that day
        return moment().add(1, 'weeks').isoWeekday(dayNumber);
      }
    },

    updateData(res) {
      console.log(res);
      const that = this;
      //const now = moment(Date.now());
      // const lastDuration = moment.duration(now.diff(this.info.lastvisit));
      // const firstDuration = moment.duration(now.diff(this.info.firstvisit));
      // const diffLast = lastDuration.asDays().toFixed();
      // const diffFirst = firstDuration.asDays().toFixed();
      // console.log(diffFirst, diffLast);
      
      const lastDays = moment(Date.now()).diff(moment(this.info.lastvisit), 'days');
      const firstDays = moment(Date.now()).diff(moment(this.info.firstvisit), 'days');
      
      this.info.lastvisit = Date.now();
      console.log(lastDays);

      if (lastDays >= 1) {  // прибавляем деньги за возврат
        this.info.summ = this.info.summ + 25 * lastDays;
      }

      if (lastDays >= 7) {  // прибавляем зарплату раз в неделю
        this.info.summ = this.info.summ + 100 * (lastDays % 7).toFixed();
      }

      const userIndx = this.userList.findIndex(elem => elem.id === this.user.id);
      if (userIndx !== -1) {
        this.userList[userIndx].summ = this.info.summ; // обновляем список баллов
      }

      let weekOn = moment(Date.now()).diff(moment(this.info.firstvisit), 'weeks'); // открываем новую статью
      console.log(weekOn);
      for (let i = 0; i <= weekOn; i++) {
        this.info.articles[i].status = true;
      }
      
      let foodLevel = this.info.food - (lastDays % 2 * 50).toFixed(); // уменьшаем еду
      this.info.food = foodLevel < 0 ? 0 : this.info.food;
      
      let healthLevel = this.info.health - (lastDays % 4 * 25).toFixed(); // уменьшаем здоровье
      this.info.food = healthLevel < 0 ? 0 : this.info.food;

      let moodLevel = this.info.mood - (lastDays % 3 * 34).toFixed(); // уменьшаем настроение
      this.info.food = moodLevel < 0 ? 0 : this.info.food;

      
      this.info.nextPayment = this.getNexDay(1).locale('ru').format('ll'); // когда следующая зарплата
      console.log(this.getNexDay(1).isSame(moment(Date.now())));
      
      setTimeout(function() {
        that.showScenario = true;
      }, 4000);
      
      if (lastDays >= 3) {  // прибавляем зарплату раз в неделю
        this.showScenario = true;
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
