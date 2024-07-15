const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const path = require('path');
const tsConfig = require('./tsconfig.json');
const merge2 = require('merge2');

gulp.task('compileTSXForESM', () => {
  const tsStream = gulp
    .src(['src/**/*.tsx', 'src/**/*.ts', '!**/node_modules/**/*.*'])
    .pipe(
      gulpTs({
        rootDir: __dirname,
        ...tsConfig.compilerOptions,
      })
    );

  const jsStream = tsStream.js.pipe(gulp.dest('lib/es'));
  const dtsStream = tsStream.dts.pipe(gulp.dest('lib/es'));
  return merge2([jsStream, dtsStream]);
});
