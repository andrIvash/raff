export default {
  template: '#game-template',

  props: ['isShown'],

  data: function() {
    return {

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

  events: {

  }
};
