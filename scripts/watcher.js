const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const watchman = require('fb-watchman');
const log = console.log;

// Directory to watch
const dir = path.resolve(__dirname, '../src');

function runWatcher() {
  const client = new watchman.Client();

  client.capabilityCheck(
    { optional: [], required: ['relative_root'] },
    function(error, resp) {
      if (error) {
        log(chalk.red('Error in the capability check:', error));
        client.end();
        return;
      }

      // Initiate the watch
      client.command(['watch-project', dir], function(error, resp) {
        // Handling errors
        if (error) {
          log(chalk.red('Error initiating watch:', error));
          return;
        }

        // Handling warnings
        if ('warning' in resp) {
          log(chalk.yellow('Error initiating watch:', resp.warning));
        }

        // Watch established, building subscription
        buildSubscription(client, resp.watch, resp.relative_path);
      });
    }
  );
}

function compile() {
  // install all the dependencies before running the watcher
  const command = 'npm';
  const args = ['run', 'compile:relay:stream'];

  const child = spawn(command, args, { stdio: 'inherit' });

  child.on('data', (data) => {
    log(chalk.grey('buildClient', data));
  });

  child.on('close', (code) => {
    if (code !== 0) {
      log(chalk.red('We had an error building the client', code));
      return;
    }
  });
}

function buildSubscription(client, watch, relative_path) {
  client.command(['clock', watch], function(error, resp) {
    if (error) {
      console.error('Failed to query clock:', error);
      return;
    }

    sub = {
      // Match any `.js` file in the dir_of_interest
      expression: ['anyof', ['match', '*.ts'], ['match', '*.tsx']],
      // Which fields we're interested in
      fields: ['name', 'size', 'exists', 'type'],
      // add our time constraint
      since: resp.clock,
    };

    if (relative_path) {
      sub.relative_root = relative_path;
    }

    client.command(['subscribe', watch, 'watcher', sub], function(error, resp) {
      if (error) {
        // The subscription failed
        log(chalk.red('Failed to subscribe \n', error));
        return;
      }
      log(chalk.green('Subscription ' + resp.subscribe + ' established.'));
    });

    client.on('subscription', function(resp) {
      if (resp.subscription !== 'watcher') return;

      resp.files.forEach(function(file) {
        console.log('file changed: ' + file.name);
        compile();
      });
    });
  });
}

module.exports = {
  runWatcher,
};
