## HTML Boilerplate Starter Theme

A modern, HTML starter theme. It comes out of the box with NPM, Gulp.js, Bootstrap 4 and jQuery.

## Installation
Just clone the repo and run npm install in the root to install all the dependencies.

## Folder structure

```
root
│   .gitignore          # folders and files ignored by git
│   README.md           # readme file
│   package.json        # all npm dependencies  
│   gulpconfig.json     # paths for gulp
│   gulpfile.js         # gulp tasks
│   index.html          # main index file      
│   package-lock.json   # automatically generated by npm   
│   rev-manifest.json   # automatically generated by gulp-rev
└───dist              
│   └───fonts           # fonts
│   └───images          # compressed images
│   └───scripts         # main.js and vendor.js minified
│   └───styles          # compiled and minified stylesheets
└───node_modules
└───vendor              # bootstrap and jquery files
└───src
    └───fonts           # all your fonts go here
    └───images          # all your images go here
    └───scripts         # main.js for your custom js code
    └───styles          # all your sass files go here
```

## How to use
1. gulp watch - compile assets during development
```javascript
gulp watch
```

2. gulp prod - compile assets for distribution
```javascript
gulp prod
```

3. gulp distclean - delete all files in the dist folder
```javascript
gulp distclean
```

4. gulp copy-assets - copy all bootstrap and jquery files to vendor
```javascript
gulp copy-assets
```

## License

GNU General Public License 3.0
[GPL 3.0] https://www.gnu.org/licenses/gpl-3.0.en.html
=======
# impresscms-theme-bootup
The base Twitter Bootstrap theme for ImpressCMS starting from ImpressCMS 1.3.10
