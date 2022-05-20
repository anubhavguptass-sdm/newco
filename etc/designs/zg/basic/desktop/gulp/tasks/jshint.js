/* jshint node:true */

'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');

gulp.task('jshint', function() {
	return gulp.src(['js/components/*.js', 'js/utils/*.js', 'js/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});