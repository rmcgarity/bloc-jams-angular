// var albumModule = angular.module('albumModule');
// angular.module('albumModule')
ralphModule
    .factory("theImage", function() {
        // I followed the pattern given at www.sitepoint.com/tidy-angular-controllers-factories-services/
        var theImage = function(index) {
            // The slice function below forces a leading zero on numbers less than 10
            return "/assets/images/album_covers/" + ("0" + index).slice(-2) + ".png";
        };
        return(theImage);
    })
    .factory("albums", ["theImage", function(theImage) {
        aIndex = 1; // Album Index
        return [
            {image: theImage(aIndex++), name: "The Colors", composer: "Picasso", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "More Colors", composer: "Monet", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "Water", composer: "Manet", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "Impressionism", composer: "Renoir", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "Dark", composer: "Degas", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "The Points", composer: "Seurat", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "Bright Colors", composer: "van Gogh", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "Sails", composer: "Caillebot", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "The Red", composer: "Rousseau", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "Light", composer: "Bazille", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "The Shadows", composer: "Hassam", numberOfSongs: 8},
            {image: theImage(aIndex++), name: "The Less Known", composer: "Weir", numberOfSongs: 8}
            ];
}]);
