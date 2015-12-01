ralphModule.directive("rcmSlider", function() {
    var linkFunction = function(scope, element, attributes) {
        scope.rcmSeekClickHandler = function($event) {
            console.log("Click");
            var newSeekRatio = calculateSeekRatio($event.pageX);
            scope.seekRatio = newSeekRatio;
            scope.seekClickHandler({newSeekRatio: newSeekRatio});
            scope.rcmUseNewRatio = false; // Use parent's seekRatio by default
        };
        scope.rcmSeekMouseDownHandler = function($event) {
            scope.rcmUseNewRatio = !scope.updateOnMove; // use slider's seek ratio only if not updating parent scope on moves
            scope.rcmNewRatio = scope.seekRatio;
            var sliderPageX = element[0].getBoundingClientRect().left; // X-coordinate
            var sliderWidth = element.prop("clientWidth"); // bar width
            console.log("MouseDown");
            // After mousedown, set up tracking mouse moves:
            angular.element(window).on('mousemove', function($event) {
                var newRatio = calculateSeekRatio($event.pageX);
                if (scope.updateOnMove) {
                    // use parent's seek ratio, and trigger parent updates:
                    scope.seekRatio = newRatio; // update in case user doesn't in his code
                    scope.seekClickHandler({newSeekRatio: newRatio});
                } else {
                    // Like Youtube video seek works - bar and media don't change during mousedown.
                    scope.rcmNewRatio = newRatio; // Move the thumb but not the bar right edge
                }
                console.log("Mouse Move");
                scope.$apply();
            });
            // After mousedown, set up looking for mouseup: 
            angular.element(window).on('mouseup', function($event) {
                var finalRatio = calculateSeekRatio($event.pageX);
                scope.seekRatio = finalRatio; // update in case user doesn't in his code
                scope.seekClickHandler({newSeekRatio: finalRatio}); // trigger parent updates
                scope.$apply();
                console.log("Mouse Up");
                scope.rcmUseNewRatio = false; // Force slider template to use parent seekRatio
                angular.element(window).off('mousemove'); // terminate tracking moves
                angular.element(window).off('mouseup'); 
                scope.$apply();
                // scope.rcmSeekClickHandler($event);
            });
        }
        var calculateSeekRatio = function(seekX) {
            var seekBarLeftX = element[0].getBoundingClientRect().left;
            var seekBarWidth = element.prop("clientWidth");
            // Since X can be outside the range of the seekbar, restrict to 0 <= ratio <= 1.
            var seekRatio = (seekX - seekBarLeftX)/seekBarWidth;
            seekRatio = Math.max(0, seekRatio);
            return(Math.min(1, seekRatio)); 
        }
    };
    return {
        templateUrl: "templates/rcmSliderDirective.html",
        restrict: 'E',
        replace: true,
        scope: {
            seekClickHandler: "&",
            seekRatio: "=",
            updateOnMove: "="
        },
        link: linkFunction
    };
});

