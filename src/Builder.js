/* @flow */

import fs from 'fs-promise'
import path from 'path'
import yaml from 'js-yaml'

import BuildState from './BuildState'
import BuildStateConsumer from './BuildStateConsumer'
import File from './File'
import Rule from './Rule'

import type { Command, Option, Phase, RuleInfo } from './types'

export default class Builder extends BuildStateConsumer {
  ruleClasses: Array<Class<Rule>> = []

  static async create (filePath: string, options: Object = {}) {
    const schema = await Builder.getOptionDefinitions()
    const buildState = await BuildState.create(filePath, options, schema)
    const builder = new Builder(buildState)

    await builder.initialize()

    return builder
  }

  async initialize () {
    const ruleClassPath: string = path.join(__dirname, 'Rules')
    const entries: Array<string> = await fs.readdir(ruleClassPath)
    this.ruleClasses = entries
      .map(entry => require(path.join(ruleClassPath, entry)).default)
  }

  async analyzePhase () {
    for (const ruleClass: Class<Rule> of this.ruleClasses) {
      const jobNames = ruleClass.ignoreJobName ? [undefined] : this.options.jobNames
      for (const jobName of jobNames) {
        const rule = await ruleClass.analyzePhase(this.buildState, jobName)
        if (rule) {
          await this.addRule(rule)
        }
      }
    }
  }

  async analyzeFiles () {
    while (true) {
      const file: ?File = Array.from(this.files).find(file => !file.analyzed)

      if (!file) break

      for (const ruleClass: Class<Rule> of this.ruleClasses) {
        const jobNames = file.jobNames.size === 0 ? [undefined] : Array.from(file.jobNames.values())
        for (const jobName of jobNames) {
          const rule = await ruleClass.analyzeFile(this.buildState, jobName, file)
          if (rule) {
            await this.addRule(rule)
          }
        }
      }

      file.analyzed = true
    }

    this.calculateDistances()
  }

  getAvailableRules (command: ?Command): Array<RuleInfo> {
    return this.ruleClasses
      .filter(rule => !command || rule.commands.has(command))
      .map(rule => ({ name: rule.name, description: rule.description }))
  }

  async evaluateRule (rule: Rule) {
    if (rule.success) {
      await rule.evaluate()
    } else {
      this.info(`Skipping rule ${rule.id} because of previous failure.`)
    }
  }

  async evaluate () {
    const rules: Array<Rule> = Array.from(this.rules).filter(rule => rule.needsEvaluation && rule.constructor.phases.has(this.phase))
    const ruleGroups: Array<Array<Rule>> = []

    for (const rule of rules) {
      let notUsed = true
      for (const ruleGroup of ruleGroups) {
        if (this.isConnected(ruleGroup[0], rule)) {
          ruleGroup.push(rule)
          notUsed = false
          break
        }
      }
      if (notUsed) ruleGroups.push([rule])
    }

    for (const ruleGroup of ruleGroups) {
      const independents = []
      let dependents = []
      let minimumCount = Number.MAX_SAFE_INTEGER

      for (const x of ruleGroup) {
        const inputCount = ruleGroup.reduce((count, y) => this.getDistance(y, x) === 1 ? count + 1 : count, 0)
        if (inputCount === 0) {
          independents.push(x)
        } else if (inputCount === minimumCount) {
          dependents.push(x)
        } else if (inputCount < minimumCount) {
          dependents = [x]
          minimumCount = inputCount
        }
      }

      for (const rule of independents.concat(dependents)) {
        await this.checkUpdates()
        await this.evaluateRule(rule)
      }
    }

    await this.checkUpdates()
  }

  async checkUpdates () {
    for (const file of this.files) {
      for (const rule of file.rules.values()) {
        await rule.addInputFileActions(file)
      }
      file.hasBeenUpdated = false
    }
  }

  async run (...commands: Array<Command>): Promise<boolean> {
    for (const command of commands) {
      for (const phase: Phase of ['initialize', 'execute', 'finalize']) {
        await this.runPhase(phase, command)
      }
    }

    return Array.from(this.rules).every(rule => rule.success)
  }

  async runPhase (phase: Phase, command: Command): Promise<void> {
    this.command = command
    this.phase = phase
    for (const file of this.files) {
      file.hasBeenUpdated = file.hasBeenUpdatedCache
      file.analyzed = false
    }
    let evaluationCount = 0

    await this.analyzePhase()

    while (evaluationCount < 20 && (Array.from(this.files).some(file => !file.analyzed) ||
      Array.from(this.rules).some(rule => rule.needsEvaluation))) {
      await this.analyzeFiles()
      await this.evaluate()
      evaluationCount++
    }
  }

  static async getOptionDefinitions (): Promise<{ [name: string]: Option }> {
    const contents = await fs.readFile(path.resolve(__dirname, '..', 'resources', 'option-schema.yaml'), { encoding: 'utf-8' })
    return yaml.load(contents)
  }
}
