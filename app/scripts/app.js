var ralphModule = angular.module('ralphApp', ['ui.router']);

ralphModule.controller("LandingController", function($scope) {
    // Placeholder to check program behavior
    alert("Hello World from Landing!");
})
ralphModule.controller("CollectionController", function($scope) {
    // Placeholder to check program behavior
    alert("Hello World from Collection!");
})
ralphModule.controller("AlbumController", function($scope) {
    // Placeholder to check program behavior
    alert("Hello World from Album!");
})

ralphModule.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    // $locationProvider.otherwise("/landing")
    $stateProvider
        .state('landing', {
            url: '/landing',
            controller: 'LandingController',
            templateUrl: '../templates/landing.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'CollectionController',
            templateUrl: '../templates/collection.html'
        })
        .state('album', {
            url: '/album',
            controller: 'AlbumController',
            templateUrl: '../templates/album.html'
        })
});