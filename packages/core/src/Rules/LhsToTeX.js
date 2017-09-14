/* @flow */

import File from '../File'
import Rule from '../Rule'
import State from '../State'

import type { CommandOptions, Command, OptionsInterface, Phase } from '../types'

export default class LhsToTeX extends Rule {
  static parameterTypes: Array<Set<string>> = [new Set([
    'LiterateHaskell',
    'LiterateAgda'
  ])]
  static description: string = 'Runs lhs2TeX on lhs or lagda files.'

  static async isApplicable (state: State, command: Command, phase: Phase, options: OptionsInterface, ...parameters: Array<File>): Promise<boolean> {
    return parameters.some(file => ((file.type === 'LiterateHaskell' && options.literateHaskellEngine === 'lhs2TeX') ||
      (file.type === 'LiterateAgda' && options.literateAgdaEngine === 'lhs2TeX')))
  }

  constructCommand (): CommandOptions {
    const args = ['lhs2TeX']

    // If the source is a literate Agda file then add the `--agda` option
    if (this.firstParameter.type === 'LiterateAgda') {
      args.push('--agda')
    }

    // Add the style option. `poly` is default so omit it.
    switch (this.options.lhs2texStyle) {
      case 'math':
        args.push('--math')
        break
      case 'newCode':
        args.push('--newcode')
        break
      case 'code':
        args.push('--code')
        break
      case 'typewriter':
        args.push('--tt')
        break
      case 'verbatim':
        args.push('--verb')
        break
    }

    // Add the output file and source files.
    args.push('-o', '{{$DIR_0/$NAME_0.tex}}', '{{$FILEPATH_0}}')

    return {
      args,
      cd: '$ROOTDIR',
      severity: 'error',
      outputs: ['$DIR_0/$NAME_0.tex']
    }
  }
}
