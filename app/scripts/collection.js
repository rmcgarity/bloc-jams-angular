// var albumModule = angular.module('albumModule');
ralphModule.factory("albums", [function albumsFactory() {
    var theImage = "/assets/images/album_covers/01.png";
    var albums = [
        {image: theImage, name: "The Colors", composer: "Picasso", numberOfSongs: 8},
        {image: theImage, name: "The Colors", composer: "Monet", numberOfSongs: 8},
        {image: theImage, name: "Water", composer: "Manet", numberOfSongs: 8},
        {image: theImage, name: "Impressionism", composer: "Renoir", numberOfSongs: 8},
        {image: theImage, name: "Dark", composer: "Degas", numberOfSongs: 8},
        {image: theImage, name: "The Points", composer: "Seurat", numberOfSongs: 8},
        {image: theImage, name: "Bright Colors", composer: "van Gogh", numberOfSongs: 8},
        {image: theImage, name: "Sails", composer: "Caillebot", numberOfSongs: 8},
        {image: theImage, name: "The Red", composer: "Rousseau", numberOfSongs: 8},
        {image: theImage, name: "Light", composer: "Bazille", numberOfSongs: 8},
        {image: theImage, name: "The Shadows", composer: "Hassam", numberOfSongs: 8},
        {image: theImage, name: "The Less Known", composer: "Weir", numberOfSongs: 8}
        ];
    return albums;
}]);
