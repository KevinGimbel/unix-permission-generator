const { parallel, src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');

function javascript() {
    return src('src/*.js')
        .pipe(babel())
        // .pipe(uglify())
        .pipe(dest('assets/'));
}

function css() {
    return src('src/*.css')
        .pipe(cleanCSS())
        .pipe(dest('assets/'));
}

exports.default = parallel(javascript, css);
exports.dev = watch(['src/**/*'], parallel(javascript, css));