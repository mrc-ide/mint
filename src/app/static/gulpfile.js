'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minify = require('gulp-clean-css'),
    hash = require('gulp-hash-filename'),
    inject = require('gulp-inject'),
    del = require('del');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(hash())
        .pipe(gulp.dest('public/css'))
        .pipe(minify({compatibility: 'ie8'}))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('inject', function () {
    const target = gulp.src(['public/*.ftl']);
    const sources = gulp.src(['public/css/*.min.css'], {read: false});
    return target.pipe(inject(sources))
        .pipe(gulp.dest('public'));
});

gulp.task('cssmap', function () {
    //Avoid pac4j session error state resulting from DevTools request for this css map
    return gulp.src('node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css.map')
        .pipe(gulp.dest('public/css'));
});

gulp.task('copy-templates', function () {
    return gulp.src('templates/**.ftl')
        .pipe(gulp.dest('public'));
});

gulp.task('clean-css', function () {
    return del('public/css/**', {force: true});
});

gulp.task('styles', gulp.series('clean-css', gulp.parallel('sass', 'cssmap'), 'inject'));
