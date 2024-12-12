const gulp = require('gulp');
require('../gulpfile');

function prebuild() {
  const taskInstance = gulp.task('prebuild');
  if (taskInstance === undefined) {
    console.error('no task named compileLib registered');
    return;
  }
  taskInstance.apply(gulp);
}

prebuild();
