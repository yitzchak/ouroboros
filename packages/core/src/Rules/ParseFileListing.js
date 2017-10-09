/* @flow */

import path from 'path'

import Rule from '../Rule'

import type { Action, ParsedLog } from '../types'

export default class ParseFileListing extends Rule {
  static parameterTypes: Array<Set<string>> = [new Set(['FileListing'])]
  static defaultActions: Array<Action> = ['parse']
  static description: string = 'Parse the file listing (fls) file generated by latex. Used to update the dependencies for rule LaTeX.'

  async parse () {
    const output = await this.getResolvedOutput('$FILEPATH_0-ParsedFileListing')
    if (!output) return false

    let rootPath: string = ''
    const parsedLog: ParsedLog = {
      messages: [],
      inputs: [],
      outputs: [],
      calls: [],
      requests: []
    }

    await this.firstParameter.parse([{
      names: ['path'],
      patterns: [/^PWD (.*)$/],
      evaluate: (reference, groups) => {
        rootPath = groups.path
      }
    }, {
      names: ['type', 'path'],
      patterns: [/^(INPUT|OUTPUT) (.*)$/],
      evaluate: (reference, groups) => {
        const candidate = this.normalizePath(path.resolve(rootPath, groups.path))
        const items = groups.type === 'INPUT' ? parsedLog.inputs : parsedLog.outputs
        if (!items.includes(candidate)) items.push(candidate)
      }
    }])

    parsedLog.inputs.sort()
    parsedLog.outputs.sort()

    output.value = parsedLog

    return true
  }
}
