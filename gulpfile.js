const gulp = require('gulp');

var AUTOPREFIXER_CONFIG,
    HTML_PRETTIFY_CONFIG,
    HTMLprettify,
    PROCESSORS,
    autoprefixer,
    browserSync,
    csso,
    jade,
    mqpacker,
    perfectionist,
    postcss,
    sass,
    babel,
    spritesmith;

//#browser refresh
browserSync = require('browser-sync');

//# css compile
sass = require('gulp-sass');
autoprefixer = require('gulp-autoprefixer');
csso = require('gulp-csso');

//# postCSS
postcss = require('gulp-postcss');
mqpacker = require("css-mqpacker");
perfectionist = require('perfectionist');

//# html compile
jade = require('gulp-jade');
HTMLprettify = require('gulp-html-prettify');

//# js compile
babel = require('gulp-babel');

//# sprite
spritesmith = require('gulp.spritesmith');

AUTOPREFIXER_CONFIG = {
    browsers: ['ie >= 8', 'last 3 versions', '> 2%'],
    cascade: false
};

HTML_PRETTIFY_CONFIG = {
    indent_char: '  ',
    indent_size: 2
};

PROCESSORS = [
    mqpacker, perfectionist({
        maxValueLength: false,
        maxAtRuleLength: false,
        maxSelectorLength: true
    })
];

/* -----------------------------------
 gulp tasks
 ----------------------------------- */
gulp.task('server', ['scss', 'jade', 'sprite'], function () {
    browserSync
        .init({
        server: './build',
        open: false
    });
    gulp.watch('dev/views/**/*.jade', ['jade']);
    gulp.watch('dev/src/scss/**/*.scss', ['scss']);
    return gulp.watch('src/images/**/*.png', ['sprite']);
});

gulp.task('scss', function () {
    return gulp
        .src('dev/src/scss/**/!(_)*.scss')
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
        })).on('error', sass.logError)
        .pipe(autoprefixer(AUTOPREFIXER_CONFIG))
        .pipe(csso()).pipe(postcss(PROCESSORS))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

gulp.task('jade', function () {
    return gulp
        .src('dev/views/**/!(_)*.jade')
        .pipe(jade())
        .on('error', console.log)
        .pipe(HTMLprettify(HTML_PRETTIFY_CONFIG))
        .pipe(gulp.dest('build'))
        .on('end', browserSync.reload);
});

gulp.task('sprite', ['scss'], function () {
    var spriteData;
    spriteData = gulp.src('src/images/**/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '../../../src/scss/assets/_sprite.scss',
        imgPath: '../img/sprite.png'
    }));
    return spriteData.pipe(gulp.dest('build/common/img/'));
});

gulp.task('default', ['server']);
