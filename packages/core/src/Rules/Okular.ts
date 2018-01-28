import { Command } from '@dicy/types'
import * as path from 'path'
import * as url from 'url'

import File from '../File'
import Rule from '../Rule'
import StateConsumer from '../StateConsumer'
import { CommandOptions, Group, Phase } from '../types'

export default class Okular extends Rule {
  static commands: Set<Command> = new Set<Command>(['open'])
  static parameterTypes: Set<string>[] = [new Set([
    'PortableDocumentFormat', 'PostScript'
  ])]
  static alwaysEvaluate: boolean = true
  static description: string = 'Open targets using okular.'

  static async isApplicable (consumer: StateConsumer, command: Command, phase: Phase, parameters: File[] = []): Promise<boolean> {
    if (process.platform !== 'linux' ||
      parameters.some(file => file.virtual || !consumer.isOutputTarget(file))) {
      return false
    }

    try {
      await consumer.executeCommand({
        command: ['okular', '--help'],
        cd: '$ROOTDIR',
        severity: 'info'
      })
    } catch (error) {
      return false
    }

    return true
  }

  get group (): Group | undefined {
    return 'opener'
  }

  constructCommand (): CommandOptions {
    const command: string[] = ['okular', '--unique']

    const urlObj: url.UrlObject = {
      protocol: 'file:',
      slashes: true,
      pathname: encodeURI(this.firstParameter.realFilePath)
    }

    if (this.options.sourcePath) {
      urlObj.hash = encodeURI(`src:${this.options.sourceLine} ${path.resolve(this.rootPath, this.options.sourcePath)}`)
    }

    command.push(url.format(urlObj))

    if (this.options.openInBackground) {
      command.unshift('--noraise')
    }

    return {
      command,
      cd: '$ROOTDIR',
      severity: 'warning',
      spawn: true
    }
  }
}
