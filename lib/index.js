'use babel'

import { CompositeDisposable } from 'atom'

// Internal vars
let subscriptions
const grammarScopes = []

export function activate () {
  subscriptions = new CompositeDisposable()

  subscriptions.add(atom.config.observe('linter-proselint.enabledScopes', scopes => {
    // Remove any old scopes
    grammarScopes.splice(0, grammarScopes.length)
    // Add the current scopes
    Array.prototype.push.apply(grammarScopes, scopes)
  }))
}

export function deactivate () {
  subscriptions.dispose()
}

export function provideLinter () {
  const Helpers = require('atom-linter')
  return {
    name: 'proselint',
    grammarScopes,
    scope: 'file',
    lintOnFly: false,
    lint: function (textEditor) {
      const filePath = textEditor.getPath()

      return Helpers.exec('proselint', ['--json', filePath]).then(function (output) {
        const errors = JSON.parse(output.toString()).data.errors

        return errors.map(function (error) {
          return {
            type: error.type === 'error' ? 'Error' : 'Warning',
            text: error.message,
            range: [[ error.line - 1, error.column - 1 ], [ error.line - 1, error.column - 1 + error.extent ]],
            filePath: filePath
          }
        })
      })
    }
  }
}
