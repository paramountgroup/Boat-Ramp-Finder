var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css'),
	minifyHtml = require("gulp-minify-html");
	
	
// Uglify Javascript files and send the js directory in the build directory	
gulp.task('scripts', function(){
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min'}))
		.pipe(gulp.dest('./build/js/'));
});

// minify CSS files
gulp.task('styles', function(){
	gulp.src('css/*.css')
		.pipe(minifyCSS())
		.pipe(rename({ suffix: '.min'}))
		.pipe(gulp.dest('./build/minCSS/'));
});


// minify the html files in the main project directory and send them to the build directory
gulp.task('minify-html', function () {
    gulp.src('/*.html') // path to your files
    .pipe(minifyHtml())
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['scripts', 'styles', 'minify-html']);
