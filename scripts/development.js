const chalk = require('chalk');
const spawn = require('cross-spawn');
const commander = require('commander');
const { runWatcher } = require('./watcher');
const packageJson = require('../package.json');
const log = console.log;

function init() {
  const program = new commander.Command(packageJson.version);

  program
    .command('setup')
    .description('install dependencies and setup')
    .action(async () => {
      await clean();
      await installDependencies();
      // perform more tasks if needed, migrations, reconciliation, etc.
    });

  program
    .command('watch')
    .option('--no-install', 'performs an install before running the watcher')
    .description('runs watcher for client')
    .action(async (opts) => {
      await clean();

      if (opts.install) {
        // install dependencies
        await installDependencies();
      }

      // run watceher
      runWatcher();
      // perform more tasks if needed
    });

  program.parse(process.argv);
}

function clean() {
  return new Promise((resolve, reject) => {
    // install all the dependencies before running the watcher
    const command = 'rm';
    const args = ['-rf', 'dist'];

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code !== 0) {
        log(chalk.red('We had an error while cleaning', code));
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      log(chalk.green('Cleanup done.'));
      resolve();
    });
  });
}

function installDependencies() {
  return new Promise((resolve, reject) => {
    // install all the dependencies before running the watcher
    const command = 'npm';
    const args = ['install'];

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code !== 0) {
        log(chalk.red('We had an error installing the dependencies.', code));
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      log(chalk.green('All the dependecies have been installed.'));
      resolve();
    });
  });
}

init();
