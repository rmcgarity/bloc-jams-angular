var createSongRow = function(songNumber, songName, songLength) {
    // Refactor: ng-repeat
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
    ;
    var $row = $(template);
    // Refactor: replace with ng-click for each case
    var clickHandler = function() {
        var thisSongNumber = parseInt($(this).attr('data-song-number'));
        // Refactor: make currentlyPlayingSongNumber a value service?
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            //
            // Refactor: I think that this can be done with ng-switch within ng-repeat
            var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            $currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        // Refactor by making each case below it's own ng-click method call.
        if (currentlyPlayingSongNumber !== thisSongNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            // Refactor: Do next assignment
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            // Refactor: same ng-switch within ng-repeat
            $(this).html(pauseButtonTemplate);
            // Refactor: Do in the controller via service call
            setSong(thisSongNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
        } else if (currentlyPlayingSongNumber === thisSongNumber) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
            }
        }
    };
    // Refactor: put in the controller, called by the ng-mouseover directive
    var onHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
            
        if (parseInt($songItem.attr('data-song-number')) !== currentlyPlayingSongNumber) {
            $songItem.html(playButtonTemplate);
        }
    };
    
    // Refactor: put in the controller, called by the ng-mouseleave directive
    var offHover = function(event) {
        var $leavingSongItem = $(this).find('.song-item-number');
        var $leavingSongItemNumber = $leavingSongItem.attr('data-song-number');
        if (parseInt($leavingSongItemNumber) !== currentlyPlayingSongNumber) {
            $leavingSongItem.html($leavingSongItemNumber);
        }
    };

    // Refactor: make html directives
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

// Refactor: Didn't I already do this?
var setCurrentAlbum = function(album) {
    currentAlbum = album;
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
    }
};
// Refactor: Next assignment
var updateSeekBarWhileSongPlays = function() {
    
    var setCurrentTimeInPlayerBar = function(currentTime) {
        $('.current-time').text(currentTime);
    }
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(currentSoundFile.getTime()));
        });
    }
 
 };
//Refactor: Next assignment
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
}
// Refactor: Next assignment
var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            if ($(this).parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            } 
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
 
    });
 
};
// Refactor: Put in service
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

// Refactor: Put in service
var filterTimeCode = function(timeInSeconds) {
    var totalSeconds = parseFloat(timeInSeconds);
    var minutes = Math.floor(totalSeconds/60);
    var residualSeconds = Math.ceil(totalSeconds - minutes*60);
    return(minutes + ":" + ("0" + residualSeconds).slice(-2));
}
// Refactor: Directives and controller, assessing the services
var updatePlayerBarSong = function() {
    var setTotalTimeInPlayerBar = function(totalTime) {
        $('.total-time').text(totalTime);
    }
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.left-controls .play-pause').html(playerBarPauseButton);
    var totalSongTime;
    currentSoundFile.bind("loadeddata", function(e) {
        setTotalTimeInPlayerBar(filterTimeCode(currentSoundFile.getDuration()));
    });
}
// Refactor: put in service
var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);
}
// Refactor: put in service
var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}
// Refactor: put in service
var setVolume = function(volume) {
    if (currentSoundFile) {
     currentSoundFile.setVolume(volume);
    }

};
// Refactor: Add to HTML - is this needed?
var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
}

// Refactor: put in service, controller, and HTML
var nextPrevSongClickHandler = function(direction) {
    var getLastSongNumber = function(index) {
        return ((index + currentAlbum.songs.length - direction) % currentAlbum.songs.length) + 1;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Increase for next or decrease for prev current by 1, modulo the number of songs
    currentSongIndex = (currentSongIndex + currentAlbum.songs.length + direction) % currentAlbum.songs.length;
    
    // Set a new current song
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updatePlayerBarSong();
    // Refactor: next assignment
    updateSeekBarWhileSongPlays();
    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.left-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

// Album button templates
// Refactor: Move to the html
var playButtonTemplate  = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Create variables in the global scope to hold current song/album information
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

// Player bar element selectors
var $previousButton = $('.left-controls .previous');
var $nextButton = $('.left-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(function() {nextPrevSongClickHandler(-1);});
    $nextButton.click(function() {nextPrevSongClickHandler(1);});
});