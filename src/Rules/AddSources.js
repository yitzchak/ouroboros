/* @flow */

import Rule from '../Rule'

import type { Command } from '../types'

export default class AddSources extends Rule {
  static commands: Set<Command> = new Set(['load'])
  static alwaysEvaluate: boolean = true
  static ignoreJobName: boolean = true
  static description: string = 'Add additional source files.'

  async run () {
    for (const file of this.options.sources) {
      await this.getFile(file)
    }

    return true
  }
}
