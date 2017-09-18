export default {
  template: '#start-template',

  props: ['isShown', 'infoData'],

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
  watch: {
    infoData: function(newVal, oldVal) { // watch it
      //console.log('Prop changed: ', newVal, ' | was: ', oldVal);
      const cards = $('.card');
      cards.each(function(index) {
        if (newVal.articles[index].status === false) {
          $(this).addClass('offline');
        }
      });
    }
  }
};

