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
import InviteComponent from './components/invite';


const _vm = new Vue({
  el: '#app',
  data: {
    loading: false, // loader
    
    startShow: true, // show start page
    articleShow: false, // shop article page
    getCardShow: false, // show card page
    listShow: false, // show user list page
    gameShow: false, // show game
    inviteShow: false, // show game
    
    article: {}, // active article
    user: {  // active user
      firstName: '',
      lastName: '',
      photoSmall: '',
      id: ''
    },
    info: { //  app info for current user
      summ: 0
    },
    userList: [], //user list
    showScenario: false, // modal in the game
    articleList: []
  },

  components: {
    startComponent: StartComponent,
    articleComponent: ArticleComponent,
    getCardComponent: GetCardComponent,
    listComponent: ListComponent,
    gameComponent: GameComponent,
    inviteComponent: InviteComponent
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

    // return to main page
    this.$on('goBack', function() {
      this.clearView();
      this.startShow = true;
    });
    // go to game page
    this.$on('goPlay', function() {
      this.clearView();
      this.gameShow = true;
    });
    // select article
    this.$on('changeArticle', function(resultArticle) {
      console.log(resultArticle);
      this.clearView();
      if(!this.article.hasOwnProperty('id')) {
        this.article = resultArticle;
      }
      this.articleShow = true;
    });
    // send review
    this.$on('sendReview', function(post) {
      this.article.comments.push(post);
      this.info.articles[this.article.id].commented = true;
      this.info.articles[this.article.id].comments.push(false);
      this.saveAllData();
    });
    //save all data
    this.$on('save', function(activeArticleId) {
      this.articleList[activeArticleId].likes = this.article.likes;
      this.articleList[activeArticleId].watch = this.article.watch;

      console.log('save --- ', this.article);
      console.log('save --- ', this.info);
      
      this.saveAllData();
    });
    // send invite
    this.$on('onInvite', function(id) {
      console.log(id);
      this.info.invite = this.info.invite + 1;
      if (this.info.invite <= 50) {
        this.info.summ = this.info.summ + 20;
        API.sendInvite({
          users: [id],
          message: 'Раффайзен Банк. Финансовая грамотность'
        }, function(res) {
          if (res !== null) {
            const modalElem = $('#modal2');
            modalElem.modal({
              fadeDuration: 250,
              fadeDelay: 1.5
            });
            modalElem.find('.modal__content').text('Приглашение отправлено');
            setTimeout(function() {
              $.modal.close();
            }, 3000);
            //this.saveAllData();
          }
        });
      }
    });
  },
  methods: {
    startApp() {
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
          if (res == null) { // new user !!!!!!!!
            that.info = {
              lastvisit: Date.now(),
              firstvisit: Date.now(),
              summ: 25,
              invite: 0,
              articles: [
                {
                  status: true,
                  commented: false,
                  like: false,
                  opendate: 0,
                  comments: []

                },
                {
                  status: false,
                  commented: false,
                  like: false,
                  opendate: 0,
                  comments: []
                },
                {
                  status: false,
                  commented: false,
                  like: false,
                  opendate: 0,
                  comments: []
                },
                {
                  status: false,
                  commented: false,
                  like: false,
                  opendate: 0,
                  comments: []
                }
              ],
              mood: 100,
              health: 100,
              food: 100,
              nextPayment: ' '
            };
            API.getKeyFromDB({key: 'raff_activity-userList'}, function(res) { //check user list
              if (res !== null) { // !!!!!!
                that.userList = JSON.parse(res.Value);
                that.userList.push({
                  id: that.user.personId,
                  name: `${that.user.firstName} ${that.user.lastName}`,
                  city: false,
                  photo: `${that.user.photoSmall}`,
                  summ: that.info.summ
                });
              } else {  // add user to list
                that.userList.push({
                  id: that.user.personId,
                  name: `${that.user.firstName} ${that.user.lastName}`,
                  city: false,
                  photo: `${that.user.photoSmall}`,
                  summ: that.info.summ
                });
              }
              console.log(that.info);
              that.saveAllData();
              that.updateData(res) // update user data !!!!
              //that.delArticleData(0); delete article
              that.makeArticleList() // !!!!!
            });
          } else {
            const info = JSON.parse(res.Value);
            that.info = info;
            API.getKeyFromDB({key: 'raff_activity-userList'}, function(res) {
              if (res !== null) {
                that.userList = JSON.parse(res.Value);
                that.updateData(res) // update user data
                that.makeArticleList()
              } else {
                throw new Error('wrong api data');
              }
            });
          }
        });
      });
    },
    makeArticleList() {
      const that = this;
      that.getArticleData(0).then((res) => {
        that.articleList.push(res);
        return that.getArticleData(1);
      }).then((res) => {
        that.articleList.push(res);
        return that.getArticleData(2);
      }).then((res) => {
        that.articleList.push(res);
        return that.getArticleData(3);
      }).then((res) => {
        that.articleList.push(res);
      });
    },
    getArticleData(id) {
      return new Promise((resolve, reject) => {
        let art;
        API.getKeyFromDB({key: `raff_activity-articles-${id}`}, function(res) {
          if (res !== null) {
            const data = JSON.parse(res.Value);
            art = {
              id: data.id,
              likes: data.likes,
              watch: data.watch
            };
          } else {
            art = {
              id: id,
              likes: 0,
              watch: 0
            };
         }
          resolve(art);
        });
      });
    },
    delArticleData(id) {
      return new Promise((resolve, reject) => {
        API.addKeyToDB({
          key: `raff_activity-articles-${id}`,
          value: JSON.stringify({
            id: id,
            likes: 0,
            watch: 0
          }),
          permissionLevel: 'Public'
        })
          resolve();
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
      this.inviteShow = false;
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
      console.log('last days ----', lastDays);

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

      
      this.info.nextPayment = this.getNexDay(2).locale('ru').format('ll'); // когда следующая зарплата
      console.log(this.getNexDay(1).isSame(moment(Date.now())));
      
      setTimeout(function() {
        that.showScenario = true;
      }, 4000);
      
      if (lastDays >= 3) {  // прибавляем зарплату раз в неделю
        this.showScenario = true;
      }
      
      this.saveAllData();
    },
    saveAllData() {
      const that = this;
      // user list update
      this.userList.forEach((elem) => {
        if (elem.id === this.user.personId) {
          elem.summ = this.info.summ;
        }
      });

      API.addKeyToDB({
        label: 'raff',
        key: `raff_activity-${this.user.personId}`,
        value: JSON.stringify(this.info),
        permissionLevel: 'Public'
      }, function(res) {
        API.addKeyToDB({
          key: `raff_activity-articles-${that.article.id}`,
          value: JSON.stringify(that.article),
          permissionLevel: 'Public'
        }, function(res) {
          API.addKeyToDB({
            key: 'raff_activity-userList',
            value: JSON.stringify(that.userList),
            permissionLevel: 'Public'
          }, function(res) {

          });
        });
      });
    }
  }
});
