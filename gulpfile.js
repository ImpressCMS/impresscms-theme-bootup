'use strict';

// ## Globals
const gulp          = require('gulp');
const watch         = require('gulp-watch');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const browserSync   = require('browser-sync').create();
const uglify        = require('gulp-uglify');
const plumber       = require('gulp-plumber');
const cssnano       = require('gulp-cssnano');
const sourcemaps    = require('gulp-sourcemaps');
const imagemin      = require('gulp-imagemin');
const concat        = require('gulp-concat');
const del           = require('del');
const gulpSequence  = require('gulp-sequence')
const rev           = require('gulp-rev');
const babel 				= require('gulp-babel');
const jshint 				= require('gulp-jshint');

// configs
const config = require( './gulpconfig.json' );
const paths = config.paths;

const autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

// gulp main js
gulp.task('mainjs', function () {
	const mainScripts = [
    paths.src.js
	];
	gulp.src(mainScripts)
      	.pipe(plumber(function(error) {
            console.error(error.message);
            gulp.emit('finish');
        }))
      	.pipe(sourcemaps.init())
        .pipe(babel({
          presets: ['env']
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(browserSync.stream());
});

// gulp vendor js
gulp.task('vendorjs', function () {
    const vendorScripts = [
      paths.src.jquery,
      paths.src.bootstrapjs
    ];
    gulp.src(vendorScripts)
      	.pipe(plumber(function(error) {
            console.error(error.message);
            gulp.emit('finish');
        }))
      	.pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
				.pipe(uglify())
      	.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(browserSync.stream());
});

// gulp minify css for production
gulp.task('minify-css', function () {
    return gulp.src(paths.src.css)
        .pipe(plumber({
          errorHandler: function( err ) {
            console.log( err ) ;
            this.emit( 'end' );
          }
        }))
        .pipe(sass({
          outputStyle: 'compressed',
          errLogToConsole: true
        }))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(cssnano({
          discardComments: {removeAll: true}
        }))
        .pipe( sourcemaps.write( './' ) )
        .pipe(gulp.dest(paths.dest.css))
        .pipe(browserSync.stream());
});

// compress images
gulp.task( 'imagemin', function() {
    gulp.src( paths.src.img )
        .pipe( imagemin([
          imagemin.jpegtran({progressive: true}),
          imagemin.gifsicle({interlaced: true}),
          imagemin.svgo({plugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]})
        ]) )
        .pipe( gulp.dest( paths.dest.img ) )
        .pipe(browserSync.stream());
});

// move all fonts to dist folder
gulp.task('fonts', function() {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(browserSync.stream());
});

// gulp watch sequence
gulp.task('watchsequence', function(callback) {
    gulpSequence( 'minify-css', ['mainjs', 'vendorjs'], ['imagemin', 'fonts'], callback );
});

// gulp watch task
gulp.task('watch', ['watchsequence'], function () {
    browserSync.init([paths.src.css, paths.src.js, './index.html', paths.src.img, paths.src.fonts], {
      server: {
        baseDir: "./"
      }
    });
    gulp.watch(paths.src.css, ['minify-css']);
    gulp.watch(paths.src.js, ['mainjs']);
	  gulp.watch(paths.src.fonts, ['fonts']);
  	gulp.watch(paths.src.img, ['imagemin']);
});

// Deleting any file inside the dist folder
gulp.task('distclean', del.bind(null, ['./dist/**/*']));

// gulp rev for production
gulp.task( 'rev', function() {
  gulp.src([paths.dest.css + '/main.css', paths.dest.js + '/main.js'], {base: './'})
    .pipe(rev())
    .pipe(gulp.dest('./'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./'));
});

// gulp production task
gulp.task('prod', function (callback) {
    gulpSequence( 'distclean', 'minify-css', ['mainjs', 'vendorjs'], ['imagemin', 'fonts'], 'rev', callback );
});

// copy assets to vendor folder
gulp.task( 'copy-assets', function() {

    // bootstrap js
    var stream = gulp.src( paths.node + '/bootstrap/dist/js/**/*.js' )
        .pipe( gulp.dest( paths.vendor + '/js/bootstrap4' ) );

    // bootstrap sass
    gulp.src( paths.node + '/bootstrap/scss/**/*.scss' )
        .pipe( gulp.dest( paths.vendor + '/sass/bootstrap4' ) );

    // jquery
    gulp.src( paths.node + '/jquery/dist/**/*.js' )
        .pipe( gulp.dest( paths.vendor + '/js/jquery' ) );

    return stream;
});
