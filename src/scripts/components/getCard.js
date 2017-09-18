

export default {
  template: '#getcard-template',

  props: ['isShown'],

  data: function() {
    return {
    };
  },

  mounted: function() {
    console.log('get card block !');
    // $('#appslider').bxSlider(
    //   {
    //     minSlides: 1,
    //     maxSlides: 4,
    //     slideWidth: 262,
    //     slideMargin: 10,
    //     auto: true
    //   }
    // );
    $(document).ready(function() {
      $('#appslider').owlCarousel({
        nav: true,
        margin: 20,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
            nav: false,
            dots: true
          },
          700: {
            items: 2,
            nav: true
          },
          1000: {
            items: 3,
            nav: true
          },
          1240: {
            items: 4,
            nav: true
          },
          1900: {
            items: 4,
            nav: true
          }
        }
      });
    });

  },

  methods: {

  },

  events: {

  }
};
