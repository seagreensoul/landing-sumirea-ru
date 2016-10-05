/* Vars */
var gulp = require('gulp'),
    cssmin = require('gulp-cssmin'),
    jsmin = require('gulp-jsmin'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),

    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),

//optional
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    //svgSprite = require("gulp-svg-sprites"),

    browserSync = require('browser-sync').create();


/* Sources */
var src_path = 'sources/';
var src_js = src_path + 'js/**/*.js',
    src_css = src_path + 'css/**/*.css',
    src_stylus = src_path + 'css/**/*.styl',
    src_img = src_path + 'img/**/*',
    src_video = 'sources/video/**/*',
    src_ico = src_path + 'img/favicon/*.ico',
    src_jade = src_path + 'html/*.pug',
    src_watch_jade = src_path + 'html/**/**.pug',
    src_fonts = src_path + 'fonts/**/*';

var npm_src = [
    //material-design-lite
    {
        src: 'node_modules/material-design-lite/material.min.*',
        dest: 'material'
    },

    //flexboxgrid
    {
        src: 'node_modules/flexboxgrid/dist/flexboxgrid.min.*',
        dest: 'css'
    },

    //flexboxgrid helpers
    {
        src: 'node_modules/flexboxgrid-helpers/dist/flexboxgrid-helpers.min.*',
        dest: 'css'
    },

    //normalize
    {
        src: 'node_modules/normalize.css/normalize.css',
        dest: 'css',
        minify: {
            css: true
        }
    },

    //Vidage
    {
        src: 'node_modules/vidage/dest/scripts/Vidage.js',
        //src: 'sources/deps/Vidage.js',
        dest: 'js'
    },

    //anime js
    {
        src: 'node_modules/animejs/anime.js',
        dest: 'js',
        minify: {
            js: true
        }
    },

    //please js
    {
        src: 'node_modules/pleasejs/dist/Please.js',
        dest: 'js'
    },

    //jquery
    {
        src: 'node_modules/jquery/dist/jquery.min.js',
        dest: 'js'
    },

    //full-page js
    {
        src: 'node_modules/fullpage.js/jquery.fullPage.js',
        dest: 'js'
    },

    //full-page css
    {
        src: 'node_modules/fullpage.js/jquery.fullPage.css',
        dest: 'css'
    }
];


/* Destination folder */
var DEST = 'dist/assets/';
var dest_html = 'dist/';


/* Other */
var YOUR_LOCALS = {}; //for jade

var browsers_ver = ['not ie <= 9', 'iOS > 7'];


/* Tasks */
gulp.task('default', ['build', 'watch']);

gulp.task('build', [
    'buildJs',
    'buildCss',
    'buildStylus',
    'buildJade',
    'buildFonts',
    'buildImg',
    'reloadVideo',
    'buildFavicon',
    'buildDeps'
]);


// Watch Files For Changes
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    //watch sources
    gulp.watch(src_watch_jade, ['reloadJade']);
    gulp.watch(src_js, ['reloadJs']);
    gulp.watch(src_css, ['reloadCss']);
    gulp.watch(src_stylus, ['reloadStylus']);
    gulp.watch(src_img, ['reloadImg']);
    gulp.watch(src_video, ['reloadVideo']);
    gulp.watch(src_fonts, ['reloadFonts']);

    //Reload builded
    gulp.watch(dest_html + '*.html').on('change', browserSync.reload);
    gulp.watch(DEST + '/**/*').on('change', browserSync.reload);
});

/* -------------------- Deploy */
gulp.task('buildDeps', function () {
    /*gulp.src(src_js)
     .pipe(concat("js.min.js"))
     .pipe(gulp.dest(DEST))*/
});

/* -------------------- Deploy */
gulp.task('sprites', function () {
    return gulp.src('./sources/fonts/icons/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest(DEST + 'img/icons/'));
});


/* -------------------- Dependencies */

gulp.task('buildDeps', function () {
    npm_src.forEach(function (dep) {
        //if we need to minify anything
        if (dep.minify) {
            //if we need to minify css
            if (dep.minify.css) {
                gulp.src(dep.src)
                    .pipe(cssmin())
                    .pipe(gulp.dest(DEST + dep.dest))
            }

            //if we need to minify js
            if (dep.minify.js) {
                gulp.src(dep.src)
                    .pipe(jsmin())
                    .pipe(gulp.dest(DEST + dep.dest))
            }
        } else {
            gulp.src(dep.src)
                .pipe(gulp.dest(DEST + dep.dest))
        }
    });
});


/* -------------------- JS */
//Reload
gulp.task('reloadJs', function () {
    gulp.src(src_js)
        .pipe(concat("js.min.js"))
        .pipe(gulp.dest(DEST + 'js'))
});

//Build
gulp.task('buildJs', function () {
    gulp.src(src_js)
        .pipe(jsmin())
        .pipe(concat("js.min.js"))
        .pipe(gulp.dest(DEST + 'js'))
});


/* -------------------- CSS */
//Reload
gulp.task('reloadCss', function () {
    gulp.src(src_css)
        .pipe(concat("css.min.css"))
        .pipe(gulp.dest(DEST + 'css'))
});

//Build
gulp.task('buildCss', function () {
    gulp.src(src_css)
        .pipe(autoprefixer({
            browsers: browsers_ver,
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(concat("css.min.css"))
        .pipe(gulp.dest(DEST + 'css'))
});


/* -------------------- Stylus */
//Reload
gulp.task('reloadStylus', function () {
    gulp.src(src_stylus)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: browsers_ver,
            cascade: false
        }))
        .pipe(concat("style.min.css"))
        .pipe(gulp.dest(DEST + 'css'))
});

//Build
gulp.task('buildStylus', function () {
    gulp.src(src_stylus)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: browsers_ver,
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(concat("style.min.css"))
        .pipe(gulp.dest(DEST + 'css'))
});


/* -------------------- Jade */
//Reload
gulp.task('reloadJade', function () {
    gulp.src(src_jade)
        .pipe(plumber())
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(dest_html))
});

//Build
gulp.task('buildJade', function () {
    gulp.src(src_jade)
        .pipe(plumber())
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest(dest_html))
});


/* -------------------- Video */
//Reload
gulp.task('reloadVideo', function () {
    gulp.src(src_video)
        .pipe(gulp.dest(DEST + 'video'))
});


/* -------------------- Images */
//Reload
gulp.task('reloadImg', ['buildImg']);

//Build
gulp.task('buildImg', function () {
    gulp.src(src_img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(DEST + 'img'))
});

//Build
gulp.task('buildFavicon', function () {
    gulp.src(src_ico)
        .pipe(gulp.dest(dest_html))
});


/* -------------------- Fonts */
//Reload
gulp.task('reloadFonts', ['buildFonts']);

//Build
gulp.task('buildFonts', function () {
    gulp.src(src_fonts)
        .pipe(gulp.dest(DEST + 'fonts'))
});