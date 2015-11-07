var ralphModule = angular.module('ralphApp', ['ui.router']);

ralphModule.controller("LandingController", function($scope) {
    $scope.blocTagline = "Turn the music up!";
});
ralphModule.controller("CollectionController", function($scope) {
    $scope.collectionContainer = {
        collection: collectionList
    };
});
ralphModule.controller("AlbumController", function($scope) {
    $scope.songContainer = {
        songs: albumPicasso.songs
    }
});

ralphModule.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    // $locationProvider.otherwise("/landing")
    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'LandingController',
            templateUrl: '/templates/landing.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'CollectionController',
            templateUrl: '/templates/collection.html'
        })
        .state('album', {
            url: '/album',
            controller: 'AlbumController',
            templateUrl: '/templates/album.html'
        })
});