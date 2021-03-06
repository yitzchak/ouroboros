import { Command } from '@dicy/types'

import Rule from '../Rule'
import { Phase } from '../types'

export default class FindLogFiles extends Rule {
  static commands: Set<Command> = new Set<Command>(['build', 'log'])
  static phases: Set<Phase> = new Set<Phase>(['initialize'])
  static alwaysEvaluate: boolean = true
  static description: string = 'Find preexisting log files.'

  async run () {
    // Look for physical log files
    await this.getGlobbedFiles('$OUTDIR/$JOB.@(log|*lg)')
    return true
  }
}
