export default {
  template: '#game-template',

  props: ['isShown', 'infoData', 'showSc', 'userData'],

  data: function() {
    return {
      info: this.infoData
    };
  },

  mounted: function() {
    console.log('game block !');
  },
  methods: {
    onPanelShow: function() {
      $('.gamepanel').addClass('active');
      setTimeout(function() {
        $('.gamepanel__wrapper').jScrollPane();
      }, 1500);
    },

    onPanelClose: function() {
      $('.gamepanel').removeClass('active');
    },

    showModal: function() {
      const modal = $('#modal').modal({
        fadeDuration: 250,
        fadeDelay: 1.5
      });
      $('.modal__btn_one').on('click', function() {
        console.log('good');
        $.modal.close();
      });

      $('.modal__btn_two').on('click', function() {
        console.log('bad');
        $.modal.close();
      });   
    }
  },
  watch: {
    infoData: function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      $('.gamedock__mood .gamedock__val').css('width', `${this.infoData.mood}%`);
      $('.gamedock__health .gamedock__val').css('width', `${this.infoData.health}%`);
      $('.gamedock__food .gamedock__val').css('width', `${this.infoData.food}%`);
    },
    showSc: function(newVal, oldVal) {
      if (this.$parent.gameShow === true) {
        $('.modal__content').text('Присмотрела себе классный гироскутер! Стоит немало. Хочу оплатить по кредитной карте*. Как поступить?');
        $('.modal__btn_one').text('Накопить');
        $('.modal__btn_two').text('Оплатить по кредитке');
        this.showModal();
      }
    },
    isShown: function() {
      if (this.showSc === true) {
        $('.modal__content').text('Присмотрела себе классный гироскутер! Стоит немало. Хочу оплатить по кредитной карте*. Как поступить?');
        $('.modal__btn_one').text('Накопить');
        $('.modal__btn_two').text('Оплатить по кредитке');
        this.showModal();
      }
    },
    userData: function(newVal) {
      const human = $('.human');
      if (newVal.sex === 'Male') {
        human.addClass('human_man');
      } else {
        human.addClass('human_woman');
      }
    }
  },
  events: {

  }
};
