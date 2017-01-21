/* @flow */

import Rule from '../Rule'
import File from '../File'

import type { Phase } from '../types'

export default class ParseLaTeXMagic extends Rule {
  static phases: Set<Phase> = new Set(['configure'])
  static fileTypes: Set<string> = new Set(['LaTeX'])

  output: ?File

  async initialize () {
    this.output = await this.getOutput(`${this.firstParameter.normalizedFilePath}-ParsedLaTeXMagic`)
  }

  async evaluate () {
    const magic = {}

    await this.firstParameter.parse([{
      names: ['name', 'value'],
      patterns: [/^%\s*!T[eE]X\s+(\w+)\s*=\s*(.*)$/],
      evaluate: (reference, groups) => {
        if (groups.name === 'jobNames') {
          magic[groups.name] = groups.value.trim().split(/\s*,\s*/)
        } else {
          magic[groups.name] = groups.value.trim()
        }
      }
    }])

    if (this.output) this.output.value = magic

    return true
  }
}