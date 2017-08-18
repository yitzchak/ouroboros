/* @flow */

import Rule from '../Rule'

import type { Action, Command } from '../types'

const TRUE_PATTERN = /^(true|yes|enabled?)$/i
const ITEM_SEPARATOR_PATTERN = /\s*,\s*/

export default class ParseLaTeXMagic extends Rule {
  static commands: Set<Command> = new Set(['load'])
  static parameterTypes: Array<Set<string>> = [new Set([
    'LaTeX',
    'LiterateAgda',
    'LiterateHaskell',
    'PNoWeb',
    'RNoWeb'
  ])]
  static defaultActions: Array<Action> = ['parse']
  static description: string = 'Parses Magic comments in LaTeX or knitr documents.'

  async parse () {
    const output = await this.getResolvedOutput('$DIR_0/$BASE_0-ParsedLaTeXMagic')
    const magic = {}

    await this.firstParameter.parse([{
      names: ['jobName', 'name', 'value'],
      patterns: [/^%\s*!T[eE]X\s+(?:([^:]+)\s*:\s*)?(\w+)\s*=\s*(.*)$/],
      evaluate: (reference, groups) => {
        const schema = this.state.optionSchema.get(groups.name)
        let value = groups.value.trim()

        if (schema) {
          switch (schema.type) {
            case 'strings':
              value = value.split(ITEM_SEPARATOR_PATTERN)
              break
            case 'number':
              value = parseInt(value, 10)
              break
            case 'numbers':
              value = value.split(ITEM_SEPARATOR_PATTERN).map(x => parseInt(x, 10))
              break
            case 'boolean':
              value = TRUE_PATTERN.test(value)
              break
          }
        }

        let jobMagic = magic

        if (groups.jobName) {
          if (!('jobs' in magic)) magic.jobs = {}

          if (groups.jobName in magic.jobs) {
            jobMagic = magic.jobs[groups.jobName]
          } else {
            magic.jobs[groups.jobName] = jobMagic = {}
          }
        }

        jobMagic[groups.name] = value
      }
    }])

    if (output) output.value = magic

    return true
  }
}
