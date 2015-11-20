var ralphModule = angular.module('ralphApp', ['ui.router']);
// var ralphModule = angular.module('ralphApp', ['ui.router']);

ralphModule.controller("LandingController", function($scope) {
    $scope.blocTagline = "Turn the music up!";
});
ralphModule.controller("CollectionController", ["$scope", "albums", function($scope, albums) {
    $scope.albums = albums;
}]);
ralphModule.controller("AlbumController", ["$scope", "albumPicasso", "MusicPlayer", function($scope, albumPicasso, MusicPlayer) {
    MusicPlayer.currentAlbum = albumPicasso;
    $scope.thisAlbum = MusicPlayer.currentAlbum;
    console.log("thisAlbum name: '" + $scope.thisAlbum.name + "'");
    $scope.selectedSong = MusicPlayer.currentlyPlayingSongNumber;
    $scope.songIsPlaying = false;
    
    // Refactor: Move to the seekerbar directive on next lesson
    var filterTimeCode = function(timeInSeconds) {
        var totalSeconds = parseFloat(timeInSeconds);
        var minutes = Math.floor(totalSeconds/60);
        var residualSeconds = Math.ceil(totalSeconds - minutes*60);
        return(minutes + ":" + ("0" + residualSeconds).slice(-2));
    };
    var updateSeekBarWhileSongPlays = function() {
        if (MusicPlayer.currentSoundFile) {
            MusicPlayer.currentSoundFile.bind("timeupdate", function(event) {
                $scope.currentTime = filterTimeCode(MusicPlayer.currentSoundFile.getTime());
                $scope.$apply();
            });
        }
    }
    var updatePlayerBarSong = function() {
        MusicPlayer.currentSoundFile.bind("loadeddata", function(e) {
            $scope.totalTime = filterTimeCode(MusicPlayer.currentSoundFile.getDuration());
            $scope.$apply();
            console.log("$scope.totalTime '" + $scope.totalTime + "'");
        });
    }
    
    $scope.songClickHandler = function(tableIndex, song) {
        // var index = 1;
        console.log("songClickHandler, index: ", tableIndex + ", song name: " + song.name);
        MusicPlayer.setSong(tableIndex+1);
        $scope.selectedSong = MusicPlayer.currentlyPlayingSongNumber;
        $scope.songIsPlaying = true;
        MusicPlayer.currentSoundFile.play();
        // MusicPlayer.updatePlayerBarSong();
        updatePlayerBarSong();
        // MusicPlayer.updateSeekBarWhileSongPlays();
        updateSeekBarWhileSongPlays();
    };
    $scope.playPauseClick = function() {
        console.log("playPause called");
        if (MusicPlayer.currentSoundFile) {
            if (MusicPlayer.currentSoundFile.isPaused()) {
                MusicPlayer.currentSoundFile.play();
                // MusicPlayer.updateSeekBarWhileSongPlays();
                updateSeekBarWhileSongPlays();
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
            MusicPlayer.setSong(currentSongIndex+1);
            MusicPlayer.currentSoundFile.play();
            // MusicPlayer.updatePlayerBarSong();
            updatePlayerBarSong();
            // MusicPlayer.updateSeekBarWhileSongPlays();
            updateSeekBarWhileSongPlays();

            // Update the Player Bar and Song List
            $scope.selectedSong = currentSongIndex +1;
            $scope.songIsPlaying = true;
        }
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