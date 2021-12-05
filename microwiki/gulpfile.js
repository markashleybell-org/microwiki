/// <binding ProjectOpened='copy-vendor-sources, watch-scss' />

const { src, dest, watch, series } = require('gulp');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sassCompiler = require('sass');
const sass = require('gulp-sass')(sassCompiler);
const sourcemaps = require('gulp-sourcemaps');

const scssOptions = {
    precision: 10,
    outputStyle: 'expanded',
    indentWidth: 4
};

const copyBootstrapSource = () =>
    src('./node_modules/bootstrap/scss/**/*.scss')
        .pipe(dest('./wwwroot/css/src/vendor/bootstrap'));

const copyBootstrapIconsFonts = () =>
    src('./node_modules/bootstrap-icons/font/**/*.{woff,woff2}')
        .pipe(dest('./wwwroot/css/dist'));

const copyBootstrapIconsCss = () =>
    src('./node_modules/bootstrap-icons/font/**/*.css')
        .pipe(postcss([cssnano()]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('./wwwroot/css/dist'));

const copyCodemirrorCss = () =>
    src('./wwwroot/css/src/codemirror/**/*.css')
        .pipe(postcss([cssnano()]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('./wwwroot/css/dist/codemirror'));

const compileScss = () =>
    src('./wwwroot/css/src/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(scssOptions).on('error', sass.logError))
        .pipe(postcss([autoprefixer({ cascade: false }), cssnano()]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./wwwroot/css/dist'));

const watchScss = () =>
    watch('./wwwroot/css/src/**/main.scss', series(compileScss));

module.exports = {
    'build-css': series(copyBootstrapSource, copyBootstrapIconsFonts, copyBootstrapIconsCss, copyCodemirrorCss, compileScss),
    'copy-vendor-sources': series(copyBootstrapSource, copyBootstrapIconsFonts, copyBootstrapIconsCss, copyCodemirrorCss),
    'watch-scss': watchScss
};
