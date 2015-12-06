var ralphModule = angular.module('ralphApp', ['ui.router']);

ralphModule.controller("LandingController", ["$scope", "$window", function($scope, $window) {
    $scope.blocTagline = "Turn the music up!";
    var revealPointCss = {opacity:'1', transform: 'scaleX(1) translateY(0)'};
    if ($window.innerHeight > 950) {
        $scope.revealPoint = revealPointCss;
    }
}]);
ralphModule.controller("CollectionController", ["$scope", "albums", function($scope, albums) {
    $scope.albums = albums;
}]);
ralphModule.controller("AlbumController", ["$scope", "albumPicasso", "MusicPlayer", function($scope, albumPicasso, MusicPlayer) {
    MusicPlayer.currentAlbum = albumPicasso;
    $scope.thisAlbum = MusicPlayer.currentAlbum;
    console.log("thisAlbum name: '" + $scope.thisAlbum.name + "'");
    $scope.selectedSong = MusicPlayer.currentlyPlayingSongNumber;
    $scope.songIsPlaying = false;
    $scope.currentTime = "";

    $scope.currentTime      = MusicPlayer.currentTime;
    $scope.totalTime        = MusicPlayer.totalTime;
    $scope.songRatio        = MusicPlayer.songRatio;
    $scope.volumeRatio      = MusicPlayer.volumeRatio;
    
    var updateHtmlTimeInfo = function() {
        $scope.$apply(function() {
            $scope.currentTime      = MusicPlayer.currentTime;
            $scope.totalTime        = MusicPlayer.totalTime;
            $scope.songRatio        = MusicPlayer.songRatio;
            $scope.volumeRatio      = MusicPlayer.volumeRatio;
        });
    };
    
    $scope.songClickHandler = function(tableIndex, song) {
        // var index = 1;
        console.log("songClickHandler, index: ", tableIndex + ", song name: " + song.name);
        MusicPlayer.setSong(tableIndex+1, updateHtmlTimeInfo);
        $scope.selectedSong = MusicPlayer.currentlyPlayingSongNumber;
        $scope.songIsPlaying = true;
        // Play a song - pass the callback that updates HTML
        MusicPlayer.playSong(updateHtmlTimeInfo);
    };
    $scope.playPauseClick = function() {
        console.log("playPause called");
        if (MusicPlayer.currentSoundFile) {
            if (MusicPlayer.currentSoundFile.isPaused()) {
                MusicPlayer.playSong(updateHtmlTimeInfo);
            } else {
                MusicPlayer.currentSoundFile.pause();
            }
            $scope.songIsPlaying = !$scope.songIsPlaying;
        }
    };
    $scope.nextPrevSongClick = function(direction) {
        console.log("nexPreviousClick called");
        if (MusicPlayer.currentSoundFile) {
            var currentSongIndex = MusicPlayer.trackIndex(MusicPlayer.currentAlbum, MusicPlayer.currentSongFromAlbum);
            // Increase for next or decrease for prev current by 1, modulo the number of songs
            currentSongIndex = (currentSongIndex + MusicPlayer.currentAlbum.songs.length + direction) % MusicPlayer.currentAlbum.songs.length;

            // Set a new current song
            MusicPlayer.setSong(currentSongIndex+1, updateHtmlTimeInfo);
            MusicPlayer.playSong(updateHtmlTimeInfo);

            // Update the Player Bar and Song List
            $scope.selectedSong = currentSongIndex +1;
            $scope.songIsPlaying = true;
        }
    };
    $scope.songSeekClicker = function(songRatio) {
        MusicPlayer.seek(songRatio);
    };
    $scope.volumeSeekClicker = function(volumeRatio) {
        MusicPlayer.setVolume(volumeRatio);
    };
}]);

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
            templateUrl: '/templates/landing.html',
            data : {
                bodyClass : 'landing'
            }
        })
        .state('collection', {
            url: '/collection',
            controller: 'CollectionController',
            templateUrl: '/templates/collection.html',
            data : {
                bodyClass : 'collection'
            }
        })
        .state('album', {
            url: '/album',
            controller: 'AlbumController',
            templateUrl: '/templates/album.html',
            data : {
                bodyClass : 'album'
            }
        })
});
// This directive enables the overall html body's class properties to be custom
// for each route (landing, collection, and album).
ralphModule.directive('bodyClassChooser', function($rootScope) {
    var linkFunction = function(scope, element, attributes) {
        $rootScope.$on("$stateChangeSuccess", 
            function(event, toState, toParams, fromState, fromParams) {
            var fromBodyClass = angular.isDefined(fromState.data) &&
                            angular.isDefined(fromState.data.bodyClass) 
                            ? fromState.data.bodyClass : null;
            var toBodyClass = angular.isDefined(toState.data) &&
                            angular.isDefined(toState.data.bodyClass) 
                            ? toState.data.bodyClass : null;
            
            if (fromBodyClass != toBodyClass) {
                if (fromBodyClass) {
                    element.removeClass(fromBodyClass);
                }
                if (toBodyClass) {
                    element.addClass(toBodyClass);
                }
            }
        });
    }
    return {
        restrict: "A",
        scope: {},
        link: linkFunction
    }
});
ralphModule.filter("convertToMinSec", function() {
    return function(timeInSeconds) {
        var returnString = "";
        if (isFinite(timeInSeconds) && (timeInSeconds != null)) {
            var totalSeconds = parseFloat(timeInSeconds);
            var minutes = Math.floor(totalSeconds/60);
            var residualSeconds = Math.ceil(totalSeconds - minutes*60);
            returnString = minutes + ":" + ("0" + residualSeconds).slice(-2);
        }
        return returnString;
    };
});