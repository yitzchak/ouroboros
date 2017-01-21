/* @flow */

import Rule from '../Rule'

import type { Message } from '../types'

export default class ParseBiberLog extends Rule {
  static fileTypes: Set<string> = new Set(['BiberLog'])

  async evaluate () {
    const parsedFile = await this.getOutput(`${this.firstParameter.normalizedFilePath}-ParsedBiberLog`)
    if (!parsedFile) return false
    const messages: Array<Message> = []

    await this.firstParameter.parse([{
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

        messages.push(message)
      }
    }])

    parsedFile.value = { messages }

    return true
  }
}