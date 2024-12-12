const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const gulpBabel = require('gulp-babel');
const path = require('path');
const tsConfig = require('./tsconfig.json');
const {
  factory: getBabelConfig,
  messages,
} = require('./scripts/getBabelConfig.js');
const merge2 = require('merge2');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');

gulp.task('cleanLib', function cleanLib() {
  return del(['lib/**/*']);
});

gulp.task('compileTSXForESM', () => {
  const tsStream = gulp
    .src(['src/**/*.tsx', 'src/**/*.ts', '!**/node_modules/**/*.*'])
    .pipe(
      gulpTs({
        rootDir: __dirname,
        ...tsConfig.compilerOptions,
      })
    );

  const jsStream = tsStream.js
    .pipe(gulpBabel(getBabelConfig({ isESM: true })))
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/g, "$1'$2.css'"))
    .pipe(gulp.dest('lib/es'));

  const dtsStream = tsStream.dts.pipe(gulp.dest('lib/es'));
  return merge2([jsStream, dtsStream]);
});

gulp.task('compileScss', () => {
  return gulp
    .src(['src/**/*.scss', '!**/node_modules/**/*.*'])
    .pipe(
      sass({
        importer: (url, prev, done) => {
          done({ file: url });
        },
      })
    )
    .pipe(gulp.dest('lib/es'))
    .pipe(gulp.dest('lib/cjs'));
});

// 需要单开一个任务，为babel处理TS & Intl & 保存文件
gulp.task('intl', function () {
  const babelConfig = getBabelConfig({ isESM: true, prebuild: true });
  return gulp
    .src(['src/**/*.tsx', 'src/**/*.ts', '!**/node_modules/**/*.*'])
    .pipe(gulpBabel(babelConfig));
  // .pipe(gulp.dest('tmp'));
});

gulp.task(
  'compileLib',
  gulp.series(['cleanLib', 'compileScss', 'compileTSXForESM'])
);

gulp.task(
  'prebuild',
  gulp.series([
    'intl',
    function () {
      console.log(messages);
      for (let message of messages) {
        console.log(message);
      }
    },
  ])
);

// gulp.task('test', gulp.series(['prebuild']))
