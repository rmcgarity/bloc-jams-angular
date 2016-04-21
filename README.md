# Bloc-Jams-Angular
A digital music player, like Spotify. Written in angular, using [grunt](http://gruntjs.com). Uses the [Buzz!](http://buzz.jaysalvat.com) audio API library.

####Example Screenshot
![Bloc Jams](https://github.com/rmcgarity/foundation/blob/master/assets/images/Bloc-Jams-Foundation%20Screen%20Shot.JPG "Bloc-Jams")

####Features
* Click on a collection (album)
* Play/pause a song
* Skip to next song
* Fast forward/rewind
* Drag to location
* Adjust volume
* Auto-adjusts view for different window sizes

####Note
I began this project by refactoring my earlier [foundation](https://github.com/rmcgarity) project.

####Installation
```
$ git clone https://github.com/rmcgarity/bloc-jams-angular.git
$ npm install
```
####Use
In the cloned directory, run
```
$ grunt
```
Then navigate to http://localhost:3000/album

####Contact
* ralph_mcgarity@yahoo.com

#### Directory Structure
```
├── Gruntfile.js
├── LICENSE
├── Procfile
├── README.md
├── app
│   ├── assets
│   │   └── images (not detailed)
│   │   └── music (not detailed)
│   ├── pages
│   │   └── index.html
│   ├── scripts
│   │   └── albumServices.js
│   │   └── app.js
│   │   └── collectionServices.js
│   │   └── fixtures.js
│   │   └── rcmSliderDirective.js
│   ├── styles
│   │   └── album.css
│   │   └── collection.css
│   │   └── landing.css
│   │   └── main.css
│   │   └── normalize.css
│   │   └── player_bar.css
│   └── templates
│   │   └── album.html
│   │   └── collection.html
│   │   └── landing.html
│   │   └── rcmSliderDirective.html
├── Gruntfile.js
├── package.json
└── server.js
```
#### Grunt plugins
A list of the Grunt plugins in this application.
##### Watch
[Grunt watch](https://github.com/gruntjs/grunt-contrib-watch) watches for changes to file content and then executes Grunt tasks when a change is detected.

##### Copy
[Grunt copy](https://github.com/gruntjs/grunt-contrib-copy) copies files from our development folders and puts them in the folder that will be served with the frontend of your application.

##### Clean
[Grunt clean](https://github.com/gruntjs/grunt-contrib-clean) "cleans" or removes all files in your distribution folder (`dist`) so that logic in your stylesheets, templates, or scripts isn't accidentally overridden by previous code in the directory.

