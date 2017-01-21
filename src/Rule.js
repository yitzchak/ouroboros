/* @flow */

import BuildState from './BuildState'
import File from './File'
import BuildStateConsumer from './BuildStateConsumer'

import type { Command, Phase } from './types'

export default class Rule extends BuildStateConsumer {
  static fileTypes: Set<string> = new Set()
  static phases: Set<Phase> = new Set(['execute'])
  static commands: Set<Command> = new Set(['build'])

  id: string
  parameters: Array<File> = []
  inputs: Map<string, File> = new Map()
  outputs: Map<string, File> = new Map()
  timeStamp: number
  needsEvaluation: boolean = false
  success: boolean = true

  static async analyze (buildState: BuildState, jobName: ?string, file: File): Promise<?Rule> {
    if (this.commands.has(buildState.command) &&
      this.phases.has(buildState.phase) &&
      this.fileTypes.has(file.type)) {
      const rule = new this(buildState, jobName, file)
      await rule.initialize()
      return rule
    }
  }

  constructor (buildState: BuildState, jobName: ?string, ...parameters: Array<File>) {
    super(buildState, jobName)
    this.parameters = parameters
    this.id = buildState.getRuleId(this.constructor.name, jobName, ...parameters)
    for (const file: File of parameters) {
      if (jobName) file.jobNames.add(jobName)
      this.inputs.set(file.normalizedFilePath, file)
      // $FlowIgnore
      file.addRule(this)
    }
  }

  async initialize () {}

  get firstParameter (): File {
    return this.parameters[0]
  }

  async evaluate (): Promise<boolean> {
    return false
  }

  async getOutput (filePath: string): Promise<?File> {
    filePath = this.normalizePath(filePath)
    let file: ?File = this.outputs.get(filePath)

    if (!file) {
      file = await this.getFile(filePath)
      if (!file) return
      this.outputs.set(filePath, file)
    }

    return file
  }

  async addOutputs (filePaths: Array<string>) {
    for (const filePath of filePaths) {
      await this.getOutput(filePath)
    }
  }

  *getTriggers (): Iterable<File> {
    for (const file: File of this.inputs.values()) {
      if (file.hasTriggeredEvaluation) yield file
    }
  }

  async updateOutputs () {
    for (const file: File of this.outputs.values()) {
      await file.update()
    }
  }

  async getInput (filePath: string): Promise<?File> {
    filePath = this.normalizePath(filePath)
    let file: ?File = this.inputs.get(filePath)

    if (!file) {
      file = await this.getFile(filePath)
      if (!file) return
      // $FlowIgnore
      await file.addRule(this)
      this.inputs.set(filePath, file)
    }

    return file
  }

  async addInputs (filePaths: Array<string>) {
    for (const filePath of filePaths) {
      await this.getInput(filePath)
    }
  }

  async addResolvedInputs (exts: Array<string>) {
    for (const ext of exts) {
      const filePath = this.resolveOutputPath(ext)
      await this.getInput(filePath)
    }
  }

  async addResolvedOutputs (exts: Array<string>, circularDependency: boolean = false) {
    for (const ext of exts) {
      const filePath = this.resolveOutputPath(ext)
      await this.getOutput(filePath)
      if (circularDependency) {
        await this.getInput(filePath)
      }
    }
  }

  toString (): string {
    return this.id
  }
}
