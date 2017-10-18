/* @flow */

import Rule from '../Rule'

import type { Action, Command, Message, ParsedLog } from '../types'

export default class ParseBiberLog extends Rule {
  static parameterTypes: Array<Set<string>> = [new Set(['BiberLog'])]
  static commands: Set<Command> = new Set(['build', 'log'])
  static defaultActions: Array<Action> = ['parse']
  static description: string = 'Parses any biber produced logs.'

  async parse () {
    const output = await this.getResolvedOutput('$FILEPATH_0-ParsedBiberLog')
    if (!output) return false

    const parsedLog: ParsedLog = {
      messages: [],
      inputs: [],
      outputs: [],
      calls: []
    }

    await this.firstParameter.parse([{
      // Input messages
      names: ['text', 'input'],
      patterns: [/^[^>]+> INFO - ((?:Found BibTeX data source|Reading) '([^']+)')$/],
      evaluate: (reference, groups) => {
        parsedLog.inputs.push(groups.input)

        const message: Message = {
          severity: 'info',
          name: 'Biber',
          text: groups.text,
          log: reference
        }

        parsedLog.messages.push(message)
      }
    }, {
      // Output messages
      names: ['text', 'output'],
      patterns: [/^[^>]+> INFO - ((?:Writing|Logfile is) '([^']+)'.*)$/],
      evaluate: (reference, groups) => {
        parsedLog.outputs.push(groups.output)

        const message: Message = {
          severity: 'info',
          name: 'Biber',
          text: groups.text,
          log: reference
        }

        parsedLog.messages.push(message)
      }
    }, {
      // All other messages
      names: ['severity', 'text'],
      patterns: [/^[^>]+> (INFO|WARN|ERROR) - (.*)$/],
      evaluate: (reference, groups) => {
        let severity = 'error'
        switch (groups.severity) {
          case 'INFO':
            severity = 'info'
            break
          case 'WARN':
            severity = 'warning'
            break
        }

        const message: Message = {
          severity,
          name: 'Biber',
          text: groups.text,
          log: reference
        }

        parsedLog.messages.push(message)
      }
    }])

    output.value = parsedLog

    return true
  }
}
