/* jshint node:true */

'use strict';

const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('jscs', function() {
	return gulp.src(['js/components/*.js', 'js/utils/*.js', 'js/*.js'])
		.pipe(jscs())
		.pipe(jscs.reporter());
});