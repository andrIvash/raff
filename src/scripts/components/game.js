export default {
  template: '#game-template',

  props: ['isShown', 'infoData'],

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
    }
  },
  watch: {
    infoData: function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      $('.gamedock__mood .gamedock__val').css('width', `${this.infoData.mood}%`);
      $('.gamedock__health .gamedock__val').css('width', `${this.infoData.health}%`);
      $('.gamedock__food .gamedock__val').css('width', `${this.infoData.food}%`);
    }
  },
  events: {

  }
};
