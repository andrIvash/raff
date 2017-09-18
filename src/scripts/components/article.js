export default {
  template: '#article-template',

  props: ['isShown', 'articleId'],

  data: function() {
    return {
      isCommented: false
    };
  },

  mounted: function() {
    console.log('article block !');
  },
  methods: {
    goBack: function(ev) {
      ev.preventDefault();
      this.$parent.$emit('goBack');
    },
    sendReview: function(ev) {
      ev.preventDefault();
      const data = $('.article__form').serialize();
      console.log(data);
      this.isCommented = !this.isCommented;
      this.$parent.$emit('sendReview', data);
    }
  },
  
  events: {

  }
};
