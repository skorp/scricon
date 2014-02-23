#!/usr/bin/env node

var program 	= require('commander');
var fs 			= require('fs');
var path 		= require('path');
var DomJS		= require('dom-js').DomJS;
var ig 			= require('imagemagick');
var _ 			= require('underscore')._;
var mkdirp 		= require('mkdirp');



program
    .version(JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version)
    .option('-c, --config [path]', 'Config File')
    .option('-i, --image [--path]', 'Icon/Screen Image ')
    .option('-d, --dest [--path]', 'Destination folder ')
    .option('-t, --types [--type]', 'set type icon or screen','icon')

program.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ '+JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).name+' -c path/to/your/config.xml');
    console.log('    $ '+JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).name+' -c path/to/your/config.xml -i path/to/your/icon.png -s path/to/your/screen.png -d path/to/your/destPath');
    console.log('');

    console.log('  Defaults:');
    console.log('');
    console.log('		type: 		icon');
    console.log('		config: 	config.xml');
    console.log('		icon: 		icon.png');
    console.log('		dest: 		phonegap/www/res/');
    console.log('');

});

program.parse(process.argv);


var configs 	= program.types == 'screen' ? require('./config-screen') : require('./config-icons');
var configFile 	= program.config 	|| path.resolve('config.xml');
var icon 		= program.image 	|| path.resolve('icon.png');
var dPath 		= program.dest 		|| path.resolve('phonegap','www','res');


try {
    var configStat = fs.lstatSync(configFile);
    if(!configStat.isFile()) {
        console.error('%s is not a File',configFile);
        process.exit(1);
    }

    var iconStat = fs.lstatSync(icon);
    if(!iconStat.isFile()) {
        console.error('%s is not a File',icon);
        process.exit(1);
    }

} catch (e) {
    if(e.code == 'ENOENT') {
        console.error('File: %s not Found',e.path);
    } else {
        console.error('sorry another error happened: \r\n %s',e.code)
    }
    process.exit(1);
}

var domjs = new DomJS();

var loadConfig = fs.readFileSync(configFile,'utf8');
domjs.parse(loadConfig, function(err, dom) {

    var i;

    for(i in dom.children) {
        if(dom.children[i].name == configs.childName) {
            if(typeof dom.children[i].attributes[configs.platformAttribute] !== 'undefined') {

                var iconName 	= path.basename(dom.children[i].attributes['src']);
                var pl 			= dom.children[i].attributes[configs.platformAttribute];

                var configData = _.findWhere(configs.data,{'filename':iconName})
                if(typeof configData !== 'undefined') {
                    var platfromExists = _.some(configs.data, function (item) {
                        if(item.plattform == pl) return item;

                        return false;
                    });

                    if(!platfromExists)
                        continue;

                    try {
                        var pathx 		= typeof configData.folder == "undefined"  ? path.resolve(dPath,configs.directory,pl) : path.resolve(dPath,configs.directory,configData.folder);
                        var destPath 	= path.resolve(pathx,iconName);
                        var dirStat = fs.lstatSync(pathx);
                    } catch (e) {
                        if(e.code == 'ENOENT') {
                            mkdirp.sync(pathx);
                        }
                    }

                    sizes = configData.size.split('x');
                    try {
                        ig.resize({
                            srcPath: icon,
                            dstPath: destPath,
                            quality: 1,
                            format: 'png',
                            width: sizes[0],
                            height: sizes[1],
                        },function(err, stdout, stderr){
                            if (err) throw err;
                        });
                        console.log(destPath+' created');
                    }catch (e) {
                        console.error(e.code);
                    }


                }
            }
        }
    }
});
