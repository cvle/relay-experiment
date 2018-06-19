'use strict';

const chalk = require('chalk');
const spawn = require('cross-spawn');
const program = require('commander');
const { runWatcher } = require('./watcher');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .option('--client-path <path>', 'change the client directory')
  .option('--server-path <path>', 'change the server directory');

program
  .command('dev')
  .description('runs watcher for client')
  // .option('--dev', 'print additional logs')
  .action(async function(env, options) {
    // install dependencies
    await installDependencies();
    // run watceher
    // perform more tasks if needed
    runWatcher();
  });

program.parse(process.argv);

function installDependencies() {
  return new Promise((resolve, reject) => {
    // Install all the dependencies before running the watcher
    const command = 'npm';
    const args = ['install'];

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code !== 0) {
        console.log(
          chalk.red('We had an error installing the dependencies.', code)
        );
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      console.log(chalk.green('All the dependecies have been installed.'));
      resolve();
    });
  });
}
