export default {
  template: '#start-template',

  props: ['isShown', 'list'],

  data: function() {
    return {

    };
  },

  mounted: function() {
    console.log('start block !');
  },

  methods: {
    onSelectArticle: function(ev) {
      const card = $(ev.target).closest('.card');
      if (!card.hasClass('offline')) {
        const articleId = card.data('id');
        console.log(articleId);
        ev.preventDefault();
        this.$parent.$emit('changeArticle', articleId);
      }
    }
  },
  events: {

  }
};
