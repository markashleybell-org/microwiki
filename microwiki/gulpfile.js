/// <binding ProjectOpened='watch-scss' />

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const scssOptions = {
    precision: 10,
    outputStyle: 'expanded',
    indentWidth: 4
};

gulp.task('sass', () =>
    gulp.src('./wwwroot/css/**/*.scss')
        .pipe(sass(scssOptions).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gulp.dest('./wwwroot/css')));

gulp.task('watch-scss', () => 
    gulp.watch('./wwwroot/css/**/*.scss', gulp.series('sass')));
