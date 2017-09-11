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

  },

  events: {

  }
};
