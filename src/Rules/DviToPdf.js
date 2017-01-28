/* @flow */

import BuildState from '../BuildState'
import File from '../File'
import Rule from '../Rule'

export default class DviToPdf extends Rule {
  static fileTypes: Set<string> = new Set(['DVI'])

  static async appliesToFile (buildState: BuildState, jobName: ?string, file: File): Promise<boolean> {
    return buildState.options.outputFormat === 'pdf' &&
      await super.appliesToFile(buildState, jobName, file)
  }

  constructCommand () {
    return `xdvipdfmx -o "${this.resolveOutputPath('.pdf')}" "${this.firstParameter.normalizedFilePath}"`
  }

  async postEvaluate (): Promise<boolean> {
    await this.getResolvedOutputs('.pdf')
    return true
  }
}