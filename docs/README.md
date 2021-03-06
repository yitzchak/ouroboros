# DiCy

A JavaScript/TypeScript based builder for [LaTeX][], [knitr][],
[Literate Agda][], [Literate Haskell][], and [Pweave][] that automatically
builds dependencies. It parses and filters output logs and error messages
generated during build and can build projects that utilize the following
programs to process files.

-   Bibliographies — [Biber][], [BibTeX][], [BibTeX8][], BibTeXu,
    [pBibTeX][], [upBibTeX][]
-   Graphics Creation — [Asymptote][], [MetaPost][]
-   Image/File Conversion — [dvipdfm][], [dvipdfmx][], [dvips][],
    [dvisvgm][], [epstopdf][], [pdf2ps][], [ps2pdf][]
-   Indexing/Glossaries — [bib2gls][], [makeglossaries][], [makeindex][],
    [mendex][], [splitindex][], [texindy][], [upmendex][]
-   LaTeX Engines — [LaTeX][], [LuaLaTeX][], [pdfLaTeX][], [pLaTeX][],
    [upLaTeX][], [XeLaTeX][]
-   Literate Programming/Reproducible Research — [Agda][], [knitr][],
    [lhs2TeX][], [patchSynctex][], [PythonTeX][], [Pweave][], [SageTeX][]

## Installation

DiCy can be accessed via a library, via a JSON-RPC server or via the command
line. The packages that implement these interfaces are listed below. In general
to install a package use a command like `npm install @dicy/core`. Whereas to
install for command line access use `npm install -g @dicy/cli`.

| Package          | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| [@dicy/core][]   | JavaScript/TypeScript library interface                       |
| [@dicy/client][] | JavaScript/TypeScript library interface using JSON-RPC server |
| [@dicy/cli][]    | Command line interface                                        |
| [@dicy/server][] | JSON-RPC server interface                                     |

## Documentation

Basic usage of the Command Line interface and library can be found below. For
more detailed documentation please see the following pages.

-   [Comparison of Builders][] — A comparision of DiCy to [arara][] and
    [latexmk][].
-   [Commands][] — The commands that can be passed to DiCy.
-   [Configuration][] — How DiCy configures the build including the order of
    configuration.
-   [Options][] — The options that can be passed to DiCy from the command line,
    the YAML option files, or TeX magic comments.
-   [API][] — Usage details on the library interface and the JSON-RPC interface.

## Command Line Usage

The command line interface is generally called via

```bash
dicy [command] [options] [inputs...]
```

where the following commands are available (`--help` will enumerate options):

| Command         | Alias | Description                                                         |
| :-------------- | :---: | ------------------------------------------------------------------- |
| build           |   b   | Build the inputs.                                                   |
| clean           |   c   | Clean up after a previous build.                                    |
| log             |   l   | Report messages from any logs.                                      |
| graph           |   g   | Create a dependency graph from a previous build.                    |
| scrub           |   s   | Clean all generated files from a previous build.                    |
| build,clean     |   bc  | Build the inputs and then clean up.                                 |
| build,log       |   bl  | Build the inputs and report messages from any logs.                 |
| build,log,clean |  blc  | Build the inputs, report messages from any logs, and then clean up. |

The [options][] that can be specified are generally the same options accessible
via the library interface.

## Library Usage

The primary class in `@dicy/core` and `@dicy/client` is the `DiCy` class. For
instance, to build `foo.tex` and report any log messages:

```javascript
const dicy = new DiCy()

dicy.on('log', (filePath, messages) => {
  for (const message of messages) {
    const nameText = event.name ? `[${event.name}] ` : ''
    const typeText = event.category ? `${event.category}: ` : ''
    const text = `${event.severity} ${nameText}${typeText}${event.text.replace('\n', ' ')}`

    console.log(text)
  }
})

await dicy.setInstanceOptions('foo.tex', { synctex: true })
await dicy.run('foo.tex', ['load', 'build', 'log', 'save'])
```

Any sequence of commands listed below may be used, but the first and last
commands should always be `load` and `save`, respectively.

| Command | Description                       |
| ------- | --------------------------------- |
| build   | Build the input file              |
| clean   | Clean up after a build            |
| graph   | Graph dependencies using GraphViz |
| log     | Report log messages generated     |

For more details regarding library usage please see the [API][] documentation.

[@dicy/cli]: https://www.npmjs.com/package/@dicy/cli

[@dicy/client]: https://www.npmjs.com/package/@dicy/client

[@dicy/core]: https://www.npmjs.com/package/@dicy/core

[@dicy/server]: https://www.npmjs.com/package/@dicy/server

[agda]: http://wiki.portal.chalmers.se/agda/pmwiki.php

[api]: https://yitzchak.github.io/dicy/api

[arara]: https://ctan.org/pkg/arara

[asymptote]: http://asymptote.sourceforge.net/

[bib2gls]: https://ctan.org/pkg/bib2gls

[biber]: http://biblatex-biber.sourceforge.net/

[bibtex]: http://www.bibtex.org/

[bibtex8]: https://www.ctan.org/pkg/bibtex8bit

[comparison of builders]: https://yitzchak.github.io/dicy/comparison-of-builders

[commands]: https://yitzchak.github.io/dicy/commands

[configuration]: https://yitzchak.github.io/dicy/configuration

[dvipdfm]: https://www.ctan.org/pkg/dvipdfm

[dvipdfmx]: http://project.ktug.org/dvipdfmx/

[dvips]: http://www.tug.org/texinfohtml/dvips.html

[dvisvgm]: http://dvisvgm.bplaced.net/

[epstopdf]: https://www.ctan.org/pkg/epstopdf

[knitr]: https://yihui.name/knitr/

[latex]: https://www.latex-project.org/

[latexmk]: https://ctan.org/pkg/latexmk

[lhs2tex]: http://www.andres-loeh.de/lhs2tex/

[literate agda]: http://wiki.portal.chalmers.se/agda/pmwiki.php?n=Main.LiterateAgda

[literate haskell]: https://wiki.haskell.org/Literate_programming

[lualatex]: http://www.luatex.org/

[makeglossaries]: https://www.ctan.org/pkg/glossaries

[makeindex]: https://www.ctan.org/pkg/makeindex

[mendex]: https://www.ctan.org/pkg/mendex

[metapost]: http://www.tug.org/metapost.html

[options]: https://yitzchak.github.io/dicy/options

[patchsynctex]: https://cran.r-project.org/package=patchSynctex

[pbibtex]: https://www.ctan.org/pkg/pbibtex-base

[pdf2ps]: http://linux.die.net/man/1/pdf2ps

[pdflatex]: http://www.tug.org/applications/pdftex/

[platex]: https://www.ctan.org/pkg/platex

[ps2pdf]: http://ghostscript.com/doc/current/Ps2pdf.htm

[pweave]: https://github.com/mpastell/Pweave

[pythontex]: https://www.ctan.org/pkg/pythontex

[sagetex]: https://www.ctan.org/tex-archive/macros/latex/contrib/sagetex/

[splitindex]: https://www.ctan.org/pkg/splitindex

[texindy]: http://xindy.sourceforge.net/

[upbibtex]: http://www.t-lab.opal.ne.jp/tex/uptex_en.html

[uplatex]: https://www.ctan.org/pkg/uplatex

[upmendex]: https://www.ctan.org/pkg/upmendex

[xelatex]: http://xetex.sourceforge.net/
