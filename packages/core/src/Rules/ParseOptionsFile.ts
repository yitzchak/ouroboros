import Rule from '../Rule'

import { Action, Command } from '../types'

export default class ParseOptionsFile extends Rule {
  static commands: Set<Command> = new Set<Command>(['load'])
  static defaultActions: Array<Action> = ['parse']
  static description: string = 'Parses the YAML option file.'

  async preEvaluate () {
    await this.getResolvedInputs(['$HOME/.dicy.yaml', 'dicy.yaml', '$NAME.yaml'])
    if (this.inputs.length === 0) this.actions.delete('run')
  }

  async parse () {
    for (const input of this.inputs) {
      const output = await this.getOutput(`${input.filePath}-ParsedYAML`)
      if (output) {
        output.value = await input.readYaml()
      }
    }

    return true
  }
}
