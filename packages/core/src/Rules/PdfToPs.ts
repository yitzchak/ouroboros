import { Command, Phase, CommandOptions } from '../types'
import File from '../File'
import Rule from '../Rule'
import StateConsumer from '../StateConsumer'

export default class PdfToPs extends Rule {
  static parameterTypes: Set<string>[] = [new Set(['PortableDocumentFormat'])]
  static description: string = 'Converts PDF to PS using pdf2ps. Enabled by the `pdfProducer` option.'

  static async isApplicable (consumer: StateConsumer, command: Command, phase: Phase, parameters: File[] = []): Promise<boolean> {
    // Only apply if output format is ps
    return consumer.options.outputFormat === 'ps'
  }

  async initialize () {
    // Zap the previous target since we are building a pdf
    await this.replaceResolvedTarget('$FILEPATH_0', '$DIR_0/$NAME_0.ps')
  }

  constructCommand (): CommandOptions {
    return {
      args: [
        'pdf2ps',
        '{{$FILEPATH_0}}',
        '{{$DIR_0/$NAME_0.ps}}'
      ],
      cd: '$ROOTDIR',
      severity: 'error',
      outputs: ['$DIR_0/$NAME_0.ps']
    }
  }
}
