import * as path from 'path'

import { Reference } from '@dicy/types'

import Rule from '../Rule'
import { Action, ParsedLog, ParserMatch } from '../types'

export default class ParseFileListing extends Rule {
  static parameterTypes: Set<string>[] = [new Set<string>(['FileListing'])]
  static defaultActions: Action[] = ['parse']
  static description: string = 'Parse the file listing (fls) file generated by latex. Used to update the dependencies for rule LaTeX.'

  async parse () {
    const output = await this.getResolvedOutput('$FILEPATH_0-ParsedFileListing')
    if (!output) return false

    let rootPath: string = ''
    const parsedLog: ParsedLog = {
      messages: [],
      inputs: [],
      outputs: [],
      calls: []
    }

    await this.firstParameter.parse([{
      names: ['path'],
      patterns: [/^PWD (.*)$/],
      evaluate: (mode: string, reference: Reference, match: ParserMatch): string | void => {
        rootPath = match.groups.path
      }
    }, {
      names: ['type', 'path'],
      patterns: [/^(INPUT|OUTPUT) (.*)$/],
      evaluate: (mode: string, reference: Reference, match: ParserMatch): string | void => {
        const candidate = this.normalizePath(path.resolve(rootPath, match.groups.path))
        const items = match.groups.type === 'INPUT' ? parsedLog.inputs : parsedLog.outputs
        if (!items.includes(candidate)) items.push(candidate)
      }
    }])

    parsedLog.inputs.sort()
    parsedLog.outputs.sort()

    output.value = parsedLog

    return true
  }
}
