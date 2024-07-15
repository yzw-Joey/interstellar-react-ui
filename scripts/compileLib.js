const gulp = require('gulp');
require('../gulpfile');

function compileLib() {
  const taskInstance = gulp.task('compileTSXForESM');
  if (taskInstance === undefined) {
    console.error('no task named compileLib registered');
    return;
  }
  taskInstance.apply(gulp);
}

compileLib();
