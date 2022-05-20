/* jshint node:true */

'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');

gulp.task('concat', function () {
	return gulp.src('js/head/*.js')
		.pipe(filter(function (file) {
			return (!/^head\.js$/.test(file.relative));
		}))
		.pipe(concat('head.js'))
		.pipe(gulp.dest('js/head'));
});
