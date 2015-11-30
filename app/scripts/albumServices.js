

ralphModule
.factory("MusicPlayer", function() {
    var filterTimeCode = function(timeInSeconds) {
        var totalSeconds = parseFloat(timeInSeconds);
        var minutes = Math.floor(totalSeconds/60);
        var residualSeconds = Math.ceil(totalSeconds - minutes*60);
        return(minutes + ":" + ("0" + residualSeconds).slice(-2));
    };

    var updateSeekBarWhileSongPlays = function(callBackToUpdateHtml) {
        if (MusicPlayer.currentSoundFile) {
            MusicPlayer.currentSoundFile.bind("timeupdate", function(event) {
                var currentTime = MusicPlayer.currentSoundFile.getTime();
                var totalTime   = MusicPlayer.currentSoundFile.getDuration();
                MusicPlayer.currentTime = filterTimeCode(currentTime);
                MusicPlayer.totalTime   = filterTimeCode(totalTime);
                MusicPlayer.songRatio   = currentTime / totalTime;
                callBackToUpdateHtml();
            });
        }
    };
    
    // The following object of variables and functions is accessible outside this factory
    var MusicPlayer = {
        currentTime:                "", // Replaces setCurrentTimeInPlayerBar function
        totalTime:                  "", // Replaces setTotalTimeInPlayerBar function
        currentAlbum:               null,
        currentlyPlayingSongNumber: null,
        currentSongFromAlbum:       null,
        currentSoundFile:           null,
        currentVolume:              5, // Was 80
        songRatio:                  0,
        volumeRatio:                0.2,
        
        playSong: function(callBackToUpdateHtml) {
            MusicPlayer.currentSoundFile.play();
            updateSeekBarWhileSongPlays(callBackToUpdateHtml);
        }, 
            
        setSong: function(songNumber, callBackToUpdateHtml) {
            if (MusicPlayer.currentSoundFile) {
                MusicPlayer.currentSoundFile.stop();
            }
            MusicPlayer.currentlyPlayingSongNumber = songNumber;
            MusicPlayer.currentSongFromAlbum = MusicPlayer.currentAlbum.songs[songNumber - 1];
            MusicPlayer.currentSoundFile = new buzz.sound(MusicPlayer.currentSongFromAlbum.audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            MusicPlayer.setVolume(MusicPlayer.volumeRatio);
        },
        getLastSongNumber: function(index) {
            return ((index + MusicPlayer.currentAlbum.songs.length - direction) % MusicPlayer.currentAlbum.songs.length) + 1;
        },
        trackIndex: function(album, song) {
            return album.songs.indexOf(song);
        },
        seek: function(songRatio) {
            if (MusicPlayer.currentSoundFile) {
                MusicPlayer.currentSoundFile.setPercent(songRatio * 100);
                MusicPlayer.songRatio = songRatio;
            }
        },
        setVolume: function(volumeRatio) {
            if (MusicPlayer.currentSoundFile) {
                MusicPlayer.currentSoundFile.setVolume(volumeRatio * 100);
                MusicPlayer.volumeRatio = volumeRatio;
            }
        }
    };
    return MusicPlayer
});


