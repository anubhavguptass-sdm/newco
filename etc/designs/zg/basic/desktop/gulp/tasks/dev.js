/* jshint node:true */

'use strict';

const gulp = require('gulp');

gulp.task('dev', function () {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['jshint', 'concat']);
});
