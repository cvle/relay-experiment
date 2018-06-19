const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const watchman = require('fb-watchman');

const dir = path.resolve(__dirname, '../src');
const validExtensions = ['*.tsx'];

function runWatcher() {
  const client = new watchman.Client();

  client.capabilityCheck(
    { optional: [], required: ['relative_root'] },
    function(error, resp) {
      if (error) {
        console.log(error);
        client.end();
        return;
      }

      // Initiate the watch
      client.command(['watch-project', dir], function(error, resp) {
        if (error) {
          console.log(chalk.yellow('Error initiating watch:', error));
          return;
        }

        // Handling warnings
        if ('warning' in resp) {
          console.log(chalk.red('Error initiating watch:', resp.warning));
        }

        // Watch established, building subscription
        buildSubscription(client, resp.watch, resp.relative_path);
      });
    }
  );
}

function buildSubscription(client, watch, relative_path) {
  sub = {
    // Match the extensions
    expression: ['allof', ['match'].concat(validExtensions)],
    // Which fields we're interested in
    fields: ['name', 'size', 'mtime_ms', 'exists', 'type'],
  };

  if (relative_path) {
    sub.relative_root = relative_path;
  }

  client.command(['subscribe', watch, 'watcher', sub], function(error, resp) {
    if (error) {
      // The subscription failed
      console.log(chalk.yellow('Failed to subscribe', error));
      return;
    }
    console.log('subscription ' + resp.subscribe + ' established');
  });

  client.on('subscription', function(resp) {
    if (resp.subscription !== 'watcher') return;

    resp.files.forEach(function(file) {
      // Converts Int64 instance to javascript integer
      const mtime_ms = +file.mtime_ms;

      console.log('File changed: ' + file.name, mtime_ms);
    });
  });
}

module.exports = {
  runWatcher,
};
