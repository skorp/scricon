### PhoneGap Build Icon and Screen's

Generates Icons or Screen Images for Phonegap Build, from an existing image.


### Install
```bash
$ npm install -g scricon
```
* Imagemagick

On Mac (HomeBrew)
```bash
$ brew install imagemagick
```

On Ubuntu
``bash
$ apt-get install imagemagick
```

* Install node dependencies

```bash
$ npm install
```
###Usage: scricon [options]

```bash

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -c, --config [path]   Config File
    -i, --image [--path]  Icon/Screen Image
    -d, --dest [--path]   Destination folder
    -t, --types [--type]  set type icon or screen

  Examples:


    $ scricon -c path/to/your/config.xml -t screen
    //creating icons
    $ scricon -c path/to/your/config.xml -i path/to/your/icon.png  -d path/to/your/destPath`-t icon
    //creating screens
    $ scricon -c path/to/your/config.xml -i path/to/your/screen.png  -d path/to/your/destPath`-t screen //it's creating screen images

  Defaults:

		type: 		icon
		config: 	config.xml
		icon: 		icon.png
		dest: 		phonegap/www/res/

```