var ralphModule = angular.module('ralphApp', ['ui.router']);

ralphModule.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    
    $urlRouterProvider.otherwise("landing")
    $stateProvider
        .state('landing', {
            url: '/landing',
            controller: 'Landing.contoller',
            templateUrl: '../templates/landing.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'Collection.contoller',
            templateUrl: '../templates/collection.html'
        })
        .state('album', {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '../templates/album.html'
        })
});