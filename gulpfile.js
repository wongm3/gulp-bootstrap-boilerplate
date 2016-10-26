/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var bower = require('gulp-bower');

/**
 * Paths to project folders
 */

var paths = {
    bower: 'bower_components'
};

/**
 * Gulp Tasks
 */

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(paths.bower));
});

/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
    'clean:dist',
    'build:styles'
]);

// Compile files (default)
gulp.task('default', ['bower']);