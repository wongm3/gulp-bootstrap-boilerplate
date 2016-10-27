/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var bower = require('gulp-bower');
var rename = require('gulp-rename');
var header = require('gulp-header');
var packageJSON = require('./package.json');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

/**
 * Paths to project folders
 */

var paths = {
    output: 'dist/**/*',
    bower: 'bower_components',
    styles: {
        bootstrap: 'bower_components/bootstrap-sass/assets/stylesheets',
        input: 'src/css/app.scss',
        output: 'dist/css'
    },
    fonts: {
        input: 'bower_components/bootstrap-sass/assets/fonts/**/*',
        output: 'dist/fonts/'
    }
};

/**
 * Template for banner to add to file headers
 */

var banner = {
    full :
    '/*!\n' +
    ' * <%= package.name %> v<%= package.version %>: <%= package.description %>\n' +
    ' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
    ' * MIT License\n' +
    ' * <%= package.repository.url %>\n' +
    ' */\n\n',
    min :
    '/*!' +
    ' <%= package.name %> v<%= package.version %>' +
    ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
    ' | MIT License' +
    ' | <%= package.repository.url %>' +
    ' */\n'
};

/**
 * Gulp Tasks
 */

// Process, lint, and minify Sass files
gulp.task('build:styles', ['build:fonts'], function () {
    return gulp.src(paths.styles.input)
        .pipe(sass({
            includePaths: [
                paths.styles.bootstrap
            ]
        }))
        .pipe(prefix({
            browsers: ['last 2 version', '> 1%'],
            cascade: true,
            remove: true
        }))
        .pipe(header(banner.full, { package: packageJSON }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(header(banner.min, { package: packageJSON }))
        .pipe(gulp.dest(paths.styles.output));
});

gulp.task('build:fonts', ['build:fonts:bootstrap']);

// Bootstrap fonts
gulp.task('build:fonts:bootstrap', function () {
    return gulp.src(paths.fonts.input)
        .pipe(gulp.dest(paths.fonts.output));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function () {
    del.sync([
        paths.output
    ]);
});

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
gulp.task('default', function () {
    runSequence('bower', 'compile');
});