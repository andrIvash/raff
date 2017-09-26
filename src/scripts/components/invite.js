
export default {
  template: '#invite-template',

  props: {
    isShown: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object
    },
    listData: {
      type: Array,
      default:[{
        id: 0,
        name: '',
        city: '',
        summ: ''
      }]
    }
  },
  data: function() {
    return {

    };
  },

  mounted: function() {
    console.log('invite block !');
  },
  methods: {
    onInvite: function(ev) {
      const userId = (this.listData[$(ev.target).closest('.score').find('.score__number').text() - 1].id);
      this.$parent.$emit('onInvite', userId);
    }
  },

  events: {

  }
};
