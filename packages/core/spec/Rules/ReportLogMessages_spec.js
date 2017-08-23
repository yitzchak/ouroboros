/* @flow */

import 'babel-polyfill'

import ReportLogMessages from '../../src/Rules/ReportLogMessages'
import { initializeRule } from '../helpers'

async function initialize (value?: Object) {
  const { rule } = await initializeRule({
    RuleClass: ReportLogMessages,
    parameters: [{
      filePath: 'LaTeXLog_pdfTeX.log-ParsedLaTeXLog',
      value
    }]
  })

  spyOn(rule, 'log')

  return { rule }
}

describe('ReportLogMessages', () => {
  describe('run', () => {
    it('logs all messages in a parsed log file.', async (done) => {
      const { rule } = await initialize({
        inputs: [],
        outputs: [],
        calls: [],
        messages: [{
          severity: 'info',
          text: 'foo'
        }, {
          severity: 'warning',
          text: 'bar'
        }]
      })

      expect(await rule.run()).toBe(true)
      expect(rule.log).toHaveBeenCalledWith({
        severity: 'info',
        text: 'foo'
      })
      expect(rule.log).toHaveBeenCalledWith({
        severity: 'warning',
        text: 'bar'
      })

      done()
    })

    it('does not log any messages when there are none in the parsed log file.', async (done) => {
      const { rule } = await initialize()

      expect(await rule.run()).toBe(true)
      expect(rule.log).not.toHaveBeenCalled()

      done()
    })
  })
})
