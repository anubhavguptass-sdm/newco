/* jshint node:true */

'use strict';

const gulp = require('gulp');

gulp.task('build', function() {
	return gulp.start('styles', ['jshint', 'jscs', 'concat']);
});
