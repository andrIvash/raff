import { API } from '../api';

export default {
  template: '#start-template',

  props: ['isShown', 'infoData', 'articleList'],

  data: function() {
    return {
      resultArticle: {}
    };
  },

  mounted: function() {
    console.log('start block !');
  },

  methods: {
    onSelectArticle: function(ev) {
      const that = this;
      const card = $(ev.target).closest('.card');
      if (!card.hasClass('offline')) {
        const articleId = card.data('id');
        console.log(articleId);
        ev.preventDefault();

        API.getKeyFromDB({key: `raff_activity-articles-${articleId}`}, function(res) { //check user list
          console.log(res);
          if (res !== null) {
            that.resultArticle = JSON.parse(res.Value);
          } else {  // add user to list
            that.resultArticle = {
              id: articleId,
              likes: 0,
              watch: 0,
              comments: [
                // {
                //  userId: '',
                //  name: '',
                //  photo: '',
                //  text: '',
                //  likes: ''
                // }
              ]
            };
          }
          console.log(that.resultArticle);
          that.$parent.$emit('changeArticle', that.resultArticle);
        });
      }
    }
  },
  watch: {
    infoData: function(newVal, oldVal) { // watch it
      
    }
  }
};

