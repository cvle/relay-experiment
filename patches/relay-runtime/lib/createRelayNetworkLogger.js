/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule createRelayNetworkLogger
 * 
 * @format
 */

'use strict';

var _require = require('./ConvertToExecuteFunction'),
    convertFetch = _require.convertFetch,
    convertSubscribe = _require.convertSubscribe;

function createRelayNetworkLogger(LoggerTransaction) {
  return {
    wrapFetch: function wrapFetch(fetch, graphiQLPrinter) {
      return function (request, variables, cacheConfig, uploadables) {
        var wrapped = wrapExecute(convertFetch(fetch), LoggerTransaction, graphiQLPrinter);
        return wrapped(request, variables, cacheConfig, uploadables);
      };
    },
    wrapSubscribe: function wrapSubscribe(subscribe, graphiQLPrinter) {
      return function (request, variables, cacheConfig) {
        var wrapped = wrapExecute(convertSubscribe(subscribe), LoggerTransaction, graphiQLPrinter);
        return wrapped(request, variables, cacheConfig);
      };
    }
  };
}

function wrapExecute(execute, LoggerTransaction, graphiQLPrinter) {
  return function (request, variables, cacheConfig, uploadables) {
    var transaction = void 0;

    function addLogs(error, response, status) {
      // Only print GraphiQL links for non-batch requests.
      if (graphiQLPrinter && request.kind === require('./RelayConcreteNode').REQUEST) {
        transaction.addLog('GraphiQL', graphiQLPrinter(request, variables));
      }
      transaction.addLog('Cache Config', cacheConfig);
      transaction.addLog('Variables', JSON.stringify(variables, null, 2));
      if (status) {
        transaction.addLog('Status', status);
      }
      if (error) {
        transaction.addLog('Error', error);
      }
      if (response) {
        transaction.addLog('Response', response);
      }
    }

    function flushLogs(error, response, status) {
      addLogs(error, response, status);
      transaction.flushLogs(error, response, status);
    }

    function commitLogs(error, response, status) {
      addLogs(error, response, status);
      transaction.commitLogs(error, response, status);
    }

    var observable = execute(request, variables, cacheConfig, uploadables);

    var isSubscription = request.operationKind === 'subscription';

    return observable['do']({
      start: function start() {
        transaction = new LoggerTransaction({
          request: request,
          variables: variables,
          cacheConfig: cacheConfig,
          uploadables: uploadables
        });
        console.time && console.time(transaction.getIdentifier());
        if (isSubscription) {
          flushLogs(null, null, 'subscription is sent.');
        }
      },
      next: function next(payload) {
        flushLogs(null, payload);
        console.time && console.time(transaction.getIdentifier());
      },
      error: function error(_error) {
        return commitLogs(_error, null, null);
      },
      complete: function complete() {
        if (isSubscription) {
          commitLogs(null, null, 'subscription was closed.');
        } else {
          // the last `next` already flushed the logs, just mark as committed
          // without spamming the logs
          transaction.markCommitted();
        }
      },
      unsubscribe: function unsubscribe() {
        return commitLogs(null, null, isSubscription ? 'subscription is unsubscribed.' : 'execution is unsubscribed.');
      }
    });
  };
}

module.exports = createRelayNetworkLogger;