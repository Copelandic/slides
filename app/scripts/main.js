require.config({
  shim: {
  	"backbone": {
  		deps: ['../components/underscore/underscore', 'jquery'],
  		exports: 'Backbone'
  	}
  },

  paths: {
    jquery: 'vendor/jquery.min',
    backbone: '../components/backbone/backbone'
  }
});

require(['views/app'], function(App) {
  new App();
});