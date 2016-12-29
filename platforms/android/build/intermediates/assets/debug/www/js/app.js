// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp = angular.module('starter', ['ui.rCalendar','ionic', 'ngCordova', 'starter.controllers', 'starter.services','starter.directives','ngResource','ion-autocomplete','ionic-datepicker','ionic-timepicker','ionic-monthpicker','ion-place-tools'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    controller : "AppCtrl",
    templateUrl: 'templates/menu.html'
  })
  
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller : 'DashboardCtrl'
      }
    },
    onEnter: function($state, Auth){
      if(!Auth.isLoggedIn())
      {
        $state.go('login');
      }
    }    
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller : 'LoginCtrl'
  })

  .state('app.sitevisit', {
    url: '/sitevisit',
    views: {
      'menuContent': {
        templateUrl: 'templates/listsitevisit.html',
        controller : 'SiteVisitCtrl'
      }
    }
  })

  .state('app.calendarsitevisit', {
    url: '/calendarsitevisit',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendarsitevisit.html',
        controller : 'CalendarSiteVisitCtrl'
      }
    }
  })

  .state('formsitevisit', {
    url: '/formsitevisit',
    templateUrl: 'templates/formsitevisit.html',
    controller : 'FormSiteVisitCtrl',
    cache:'false'
  })

 .state('app.maps', {
    url: '/maps',
    views: {
      'menuContent': {
              templateUrl: 'templates/maps.html',
              controller: 'MapCtrl'
      }
    }
  })


  .state('app.complainhandling', {
      url: '/complainhandling',
      views: {
        'menuContent': {
          templateUrl: 'templates/complainhandling.html',
          controller : 'ComplainHandlingCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});


myapp.constant('ApiEndPoint', {
  "url" : 'http://eportal.gos.co.id/eportal_dev/index.php/api'
//  "url" : '/api'
});

myapp.constant('radius', {
  "meters" : 200
//  "url" : '/api'
});


myapp.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);