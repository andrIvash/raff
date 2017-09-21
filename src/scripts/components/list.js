
export default {
  template: '#list-template',

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
    console.log('list block !');
  },
  methods: {
    goPlay: function(ev) {
      ev.preventDefault();
      this.$parent.$emit('goPlay');
    }
  },

  events: {

  }
};
