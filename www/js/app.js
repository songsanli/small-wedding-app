angular.module('weddingApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "templates/home.html"
    })
    .state('lection', {
      url: "/lection",
      templateUrl: "templates/lection.html"
    })
    .state('timelocation', {
      url: "/timelocation",
      templateUrl: "templates/timelocation.html"
    })
    .state('thanks', {
      url: "/thanks",
      templateUrl: "templates/thanks.html"
    })
    .state('photos', {
      url: "/photos",
      templateUrl: "templates/photos.html"
    });

  $urlRouterProvider.otherwise("/home");
})

// I don't know whethe it's useful if I just need mobile web.
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
