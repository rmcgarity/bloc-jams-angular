

ralphModule
.factory("MusicPlayer", function() {
    var filterTimeCode = function(timeInSeconds) {
        var totalSeconds = parseFloat(timeInSeconds);
        var minutes = Math.floor(totalSeconds/60);
        var residualSeconds = Math.ceil(totalSeconds - minutes*60);
        return(minutes + ":" + ("0" + residualSeconds).slice(-2));
    };
    var seek = function(time) {
        if (MusicPlayer.currentSoundFile) {
            MusicPlayer.currentSoundFile.setTime(time);
        }
    };
    var setVolume = function(volume) {
        if (MusicPlayer.currentSoundFile) {
            MusicPlayer.currentSoundFile.setVolume(volume);
        }

    };

    var updateSeekBarWhileSongPlays = function(callBackToUpdateHtml) {
        if (MusicPlayer.currentSoundFile) {
            MusicPlayer.currentSoundFile.bind("timeupdate", function(event) {
                var currentTime = MusicPlayer.currentSoundFile.getTime();
                var totalTime   = MusicPlayer.currentSoundFile.getDuration();
                MusicPlayer.currentTime = filterTimeCode(currentTime);
                MusicPlayer.totalTime   = filterTimeCode(totalTime);
                MusicPlayer.seekBarFillRatio = currentTime / totalTime;
                callBackToUpdateHtml();
            });
                // var $seekBar = $('.seek-control .seek-bar');
                // updateSeekPercentage(seekBarFillRatio);
                // MusicPlayer.currentTime = filterTimeCode(MusicPlayer.currentSoundFile.getTime());
        }
    };
    
    // The following object of variables and functions is accessible outside this factory
    var MusicPlayer = {
        currentTime:                "", // Replaces setCurrentTimeInPlayerBar function
        totalTime:                  "", // Replaces setTotalTimeInPlayerBar function
        seekBarPercentage:         null,
        currentAlbum:               null,
        currentlyPlayingSongNumber: null,
        currentSongFromAlbum:       null,
        currentSoundFile:           null,
        currentVolume:              80,
        seekBarFillRatio:           0,
        
        playSong: function(callBackToUpdateHtml) {
            MusicPlayer.currentSoundFile.play();
            updateSeekBarWhileSongPlays(callBackToUpdateHtml);
        }, 
        
        // Refactor next lesson
        updateSeekPercentage: function($seekBar, seekBarFillRatio) {
            var offsetXPercent = seekBarFillRatio * 100;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(100, offsetXPercent);

            var percentageString = offsetXPercent + '%';
            // $seekBar.find('.fill').width(percentageString);
            // $seekBar.find('.thumb').css({left: percentageString});
        },
        
        setupSeekBars: function() {
            // var $seekBars = $('.player-bar .seek-bar');
            // Refactor next assignment
            // $seekBars.click(function(event) {
                // var offsetX = event.pageX - $(this).offset().left;
                // var barWidth = $(this).width();
                // var seekBarFillRatio = offsetX / barWidth;
                //if ($(this).parent().attr('class') == 'seek-control') {
                //    seek(seekBarFillRatio * currentSoundFile.getDuration());
                //} else {
                //    setVolume(seekBarFillRatio * 100);
                //}
                //updateSeekPercentage($(this), seekBarFillRatio);
            // });
            // $seekBars.find('.thumb').mousedown(function(event) {
            //    var $seekBar = $(this).parent();
            //    $(document).bind('mousemove.thumb', function(event){
            //        var offsetX = event.pageX - $seekBar.offset().left;
            //        var barWidth = $seekBar.width();
            //        var seekBarFillRatio = offsetX / barWidth;
            //        if ($(this).parent().attr('class') == 'seek-control') {
            //            seek(seekBarFillRatio * currentSoundFile.getDuration());
            //        } else {
            //            setVolume(seekBarFillRatio * 100);
            //        } 
            //        updateSeekPercentage($seekBar, seekBarFillRatio);
            //    });
            //    $(document).bind('mouseup.thumb', function() {
            //        $(document).unbind('mousemove.thumb');
            //        $(document).unbind('mouseup.thumb');
            //    });
            //}
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
            setVolume(MusicPlayer.currentVolume);
        },
        getLastSongNumber: function(index) {
            return ((index + MusicPlayer.currentAlbum.songs.length - direction) % MusicPlayer.currentAlbum.songs.length) + 1;
        },
        trackIndex: function(album, song) {
            return album.songs.indexOf(song);
        },
    }
    return MusicPlayer
});


