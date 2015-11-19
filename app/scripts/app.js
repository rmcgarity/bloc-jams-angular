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
    $scope.totalTime = MusicPlayer.totalTime;
    console.log("thisAlbum name: '" + $scope.thisAlbum.name + "'");
    $scope.selectedSong = MusicPlayer.currentlyPlayingSongNumber;
    $scope.songIsPlaying = false;
    $scope.currentTime = MusicPlayer.currentTime;
    
    $scope.songClickHandler = function(rowMode, tableIndex, song) {
        // var index = 1;
        console.log("songClickHandler, rowMode: " + rowMode  + ", index: ", tableIndex + ", song name: " + song.name);
        if (rowMode == "notSelected") {
            MusicPlayer.setSong(tableIndex+1);
            $scope.selectedSong = MusicPlayer.currentlyPlayingSongNumber;
            $scope.songIsPlaying = true;
            MusicPlayer.currentSoundFile.play();
            MusicPlayer.updatePlayerBarSong();
            MusicPlayer.updateSeekBarWhileSongPlays();
        }
        if (rowMode != "notSelected") {
            $scope.playPauseClick();
        }
    };
    $scope.playPauseClick = function() {
        console.log("playPause called");
        if (MusicPlayer.currentSoundFile.isPaused()) {
            MusicPlayer.currentSoundFile.play();
            MusicPlayer.updateSeekBarWhileSongPlays();
        } else {
            MusicPlayer.currentSoundFile.pause();
        }
        $scope.songIsPlaying = !$scope.songIsPlaying;
    };
    $scope.nextPrevSongClick = function(direction) {
        console.log("nexPreviousClick called");
        var currentSongIndex = MusicPlayer.trackIndex(MusicPlayer.currentAlbum, MusicPlayer.currentSongFromAlbum);
        // Increase for next or decrease for prev current by 1, modulo the number of songs
        currentSongIndex = (currentSongIndex + MusicPlayer.currentAlbum.songs.length + direction) % MusicPlayer.currentAlbum.songs.length;

        // Set a new current song
        MusicPlayer.setSong(currentSongIndex+1);
        MusicPlayer.currentSoundFile.play();
        MusicPlayer.updatePlayerBarSong();
        MusicPlayer.updateSeekBarWhileSongPlays();

        // Update the Player Bar and Song List
        $scope.selectedSong = currentSongIndex +1;
        $scope.songIsPlaying = true;
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