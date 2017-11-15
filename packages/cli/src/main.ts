#! /usr/bin/env node

import * as _ from 'lodash'
import * as cliui from 'cliui'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as yaml from 'js-yaml'
import * as yargs from 'yargs'
import chalk from 'chalk'

import {
  getOptionDefinitions,
  Command,
  DiCy,
  Message,
  OptionDefinition,
  Reference
} from '@dicy/core'

const columns = Math.min(Math.max(process.stdout.columns || 80, 80), 132)

const optionNames: {[name: string]: string} = {}
const commandLists: any = {}

const handler = async (argv: any) => {
  const options: {[name: string]: any} = {}
  for (const name in argv) {
    const value = argv[name]
    if (name in optionNames && value !== undefined && value !== false) {
      options[optionNames[name]] = name.startsWith('no-') ? !argv[name] : argv[name]
    }
  }
  const commands = commandLists[argv._]
  const inputs: string[] = argv.inputs || []
  const saveLog: boolean = !!argv['save-log']
  console.log(saveLog)

  function log (message: Message) {
    const ui = cliui()
    const severityColumnWidth = 10

    function printReference (reference: Reference | undefined, label: string) {
      if (!reference) return
      const start = reference.range && reference.range.start
        ? ` @ ${reference.range.start}`
        : ''
      const end = reference.range && reference.range.end
        ? `-${reference.range.end}`
        : ''
      return printRow('', chalk.dim(`[${label}] ${reference.file}${start}${end}`))
    }

    function printRow (severity: string, text: string) {
      ui.div({
        text: severity || '',
        width: severityColumnWidth
      }, {
        text,
        width: columns - severityColumnWidth
      })
    }

    let severity: string

    switch (message.severity) {
      case 'error':
        severity = chalk.red('(ERROR)')
        break
      case 'warning':
        severity = chalk.yellow('(WARNING)')
        break
      case 'trace':
        severity = '(TRACE)'
        break
      default:
        severity = chalk.blue('(INFO)')
        break
    }

    let text = message.text

    if (message.name || message.category) {
      text = `[${message.name}${message.category ? '/' : ''}${message.category || ''}] ${message.text}`
    }

    text.split('\n').forEach((line: string, index: number) => printRow(index === 0 ? severity : '', index === 0 ? line : `- ${line}`))

    printReference(message.source, 'Source')
    printReference(message.log, 'Log')

    console.log(ui.toString())
  }

  let success = true
  const cache = new DiCy()

  for (const filePath of inputs) {
    let messages: Message[] = []
    const dicy = await cache.get(path.resolve(filePath))
    await dicy.setInstanceOptions(options)
    dicy
      .on('log', (newMessages: Message[]) => {
        messages = messages.concat(newMessages)
        newMessages.forEach(log)
      })

    process.on('SIGTERM', () => dicy.kill())
    process.on('SIGINT', () => dicy.kill())

    success = await dicy.run(commands) || success

    if (saveLog) {
      const { dir, name } = path.parse(filePath)
      const logFilePath = path.join(dir, `${name}-log.yaml`)
      const contents = yaml.safeDump(messages, { skipInvalid: true })
      await fs.writeFile(logFilePath, contents)
    }
  }

  await cache.destroy()

  process.exit(success ? 0 : 1)
}

yargs
  .wrap(columns)
  .usage('DiCy - A builder for LaTeX, knitr, literate Agda, literate Haskell and Pweave that automatically builds dependencies.')
  .demandCommand(1, 'You need to specify a command.')
  .help()

getOptionDefinitions().then((definitions: OptionDefinition[]) => {
  function getOptions (commands: Command[]) {
    const options: { [name: string]: any } = {
      'save-log': {
        boolean: true,
        description: 'Save the log as a YAML file <name>-log.yaml.'
      }
    }

    for (const definition of definitions) {
      // Skip environment variables
      if (definition.name.startsWith('$') || definition.name.includes('_')) continue

      if (definition.commands && !definition.commands.some(command => commands.includes(command as Command))) continue

      const addOption = (name: string, option: any) => {
        optionNames[name] = definition.name
        if (definition.values) {
          option.choices = definition.values
        }
        options[name] = option
      }
      const name = _.kebabCase(definition.name).replace('lhs-2-tex', 'lhs2tex')
      const negatedName = `no-${name}`
      const description = definition.description
      const alias = (definition.aliases || []).filter(alias => alias.length === 1)

      switch (definition.type) {
        case 'strings':
          addOption(name, {
            type: 'array',
            alias,
            description
          })
          break
        case 'number':
          addOption(name, {
            type: 'number',
            alias,
            description
          })
          break
        case 'boolean':
          if (definition.defaultValue) {
            addOption(name, {
              type: 'boolean',
              hidden: true
            })
            addOption(negatedName, {
              type: 'boolean',
              alias,
              description: description.replace('Enable', 'Disable')
            })
          } else {
            addOption(negatedName, {
              type: 'boolean',
              hidden: true
            })
            addOption(name, {
              type: 'boolean',
              alias,
              description
            })
          }
          break
        case 'string':
          addOption(name, {
            type: 'string',
            alias,
            description
          })
          break
      }
    }

    return options
  }

  function createCommand (commands: Command[], description: string) {
    const name = commands.join(',')
    const alias = commands.map(c => c.substr(0, 1)).join('')

    commands.unshift('load')
    commands.push('save')

    commandLists[name] = commands
    commandLists[alias] = commands

    yargs
      .command({
        command: `${name} <inputs...>`,
        aliases: [alias],
        describe: description,
        builder: yargs => {
          return yargs
            .options(getOptions(commands))
            .epilogue('All boolean options can be negated by adding or removing the `no-` prefix.')
        },
        handler
      })
  }

  createCommand(['build'], 'Build the inputs.')
  createCommand(['clean'], 'Clean up after a previous build.')
  createCommand(['scrub'], 'Clean up generated files after a previous build.')
  createCommand(['log'], 'Report messages from any logs.')
  createCommand(['graph'], 'Create a dependency graph from a previous build.')
  createCommand(['build', 'clean'], 'Build the inputs and then clean up.')
  createCommand(['build', 'log'], 'Build the inputs and report messages from any logs.')
  createCommand(['build', 'log', 'clean'], 'Build the inputs, report messages from any logs, and then clean up.')

  /* tslint:disable:no-unused-expression */
  yargs.argv
}, error => { console.log(error) })
