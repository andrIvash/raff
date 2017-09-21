export default {
  template: '#article-template',

  props: ['isShown', 'article', 'userData', 'infoData'],

  data: function() {
    return {
      //isCommented: false,
      comment: ''
    };
  },

  mounted: function() {
    console.log('article block !');
  },
  methods: {
    goBack: function(ev) {
      ev.preventDefault();
      this.$parent.$emit('save', this.article.id);
      this.$parent.$emit('goBack');
    },
    // send post and participation in the competition
    sendReview: function(ev) {
      ev.preventDefault();
      const data = $('.article__form-textarea').val();
      console.log(data);
      const postObj = {
        userId: this.userData.personId,
        name: `${this.userData.firstName} ${this.userData.lastName}`,
        photo: this.userData.photoSmall,
        text: data,
        likes: 0,
        date: Date.now()
      };
      
      //add score for comment
      this.$parent.info.summ = this.$parent.info.summ + 50;
      
      //this.isCommented = !this.isCommented;
      this.$parent.$emit('sendReview', postObj);
    },
    // add like to article
    onLiked: function() {
      console.log('like article');
      // add-remove like and check likes rate
      this.$parent.info.articles[this.article.id].like = !this.$parent.info.articles[this.article.id].like;
      if (this.$parent.info.articles[this.article.id].like) {
        // add like
        this.$parent.article.likes = this.$parent.article.likes + 1;
        // add score for like
        this.$parent.info.summ = this.$parent.info.summ + 10;
      } else {
        // remove like 
        this.$parent.article.likes = this.$parent.article.likes - 1;
        this.$parent.article.likes = this.$parent.article.likes < 0 ? 0 : this.$parent.article.likes;
        // remove score for like  
        this.$parent.info.summ = (this.$parent.info.summ - 10 < 0) ? 0 : this.$parent.info.summ - 10;
      }

      this.$parent.$emit('save', this.article.id);
    },
    // add like to comment
    onCommentLiked: function(ev) {
      const parent = $(ev.target).closest('.comment');
      const id = parent.data('id');
      console.log('like comment');
      console.log(id);
      console.log(this.$parent.info.articles[this.article.id].comments[id]);
      this.$parent.info.articles[this.article.id].comments[id] = !this.$parent.info.articles[this.article.id].comments[id];
      if (this.$parent.info.articles[this.article.id].comments[id]) {
        // add like
        this.$parent.article.comments[id].likes = this.$parent.article.comments[id].likes + 1;
        parent.addClass('active');
      } else {
        // remove like 
        this.$parent.article.comments[id].likes = this.$parent.article.comments[id].likes - 1;
        this.$parent.article.comments[id].likes = this.$parent.article.comments[id].likes < 0 ? 0 : this.$parent.article.comments[id].likes;
        parent.removeClass('active');
      }

      this.$parent.$emit('save', this.article.id);
    }
  },
  watch: {
    isShown: function(newVal) {
      if (newVal) {
        this.$parent.article.watch = this.$parent.article.watch + 1; //  add watch episode
      }
    }
  }
};
