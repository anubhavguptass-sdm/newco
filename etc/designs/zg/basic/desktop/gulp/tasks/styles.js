/* jshint node:true */

'use strict';

const gulp = require('gulp');
const handleErrors = require('../util/handleErrors');
const sass = require('gulp-sass');
const filter = require('gulp-filter');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const settings = require('../../package.json');

gulp.task('styles', function () {
	return gulp.src('sass/**/*.scss')
		.pipe(filter(function (file) {
			return (!/\/_/.test(file.path) || !/^_/.test(file.relative));
		}))
		.pipe(sass().on('error', handleErrors))
		.pipe(postcss([
			autoprefixer({browsers: settings.browserslist})
		]))
		.pipe(gulp.dest('css'));
});
