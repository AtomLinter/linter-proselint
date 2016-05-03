'use babel'

module.exports.provideLinter = function () {
  const Helpers = require('atom-linter')
  return {
    name: 'proselint',
    grammarScopes: ['source.gfm', 'source.pfm', 'source.md', 'text.plain', 'text.tex.latex', 'text.tex.latex.beamer', 'text.tex.latex.memoir'],
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
