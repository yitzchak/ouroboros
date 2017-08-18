# Changes

All significant changes to this project will be documented in the notes below.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased &mdash; YYYY-MM-DD

### Added

- Support for PythonTeX \[[#69][]].

## [v0.8.0][] &mdash; 2017-08-15

### Added
- Support for epstopdf.
- Support for LaTeX engines platex and uplatex.
- Support for BibTeX engines bibtex8, bibtexu, pbibtex and upbibtex.
- Support for index engines texindy, mendex and upmendex.

### Fixed
- BibTeX execution directory issues that made citations in sub-files fail to
  resolve.

## [v0.7.0][] &mdash; 2017-07-26

### Added
- Add support for splitindex.

## [v0.6.0][] &mdash; 2017-07-16

### Added
- Add `consoleEventOutput` option \[[#53][]].
- Add `intermediatePostScript` and `ignoreHomeOptions` options \[[#51]].

### Changed
- Improved display of CLI log messages \[[#53]].

## [v0.5.0][] &mdash; 2017-07-12

### Added
- Improved BibTeX log parsing \[[#47]].
- Option to control knitr concordance \[[#49]].
- Support and options for literate Agda source \[[#49]].
- Options for literate Haskell processing \[[#49]].
- Improved dependency analysis for BibTex, Biber and makeindex \[[#49]].

## [v0.4.1][] &mdash; 2017-07-04

### Fixed

- Some incorrect asynchronous code in rules.
- Check for job specific output formats for `dvipdfmx` and others.

## [v0.4.0][] &mdash; 2017-07-02

### Added
- Parsing of LaTeX3 style message in log files.

### Fixed
- Made detection of file updates more robust.

## [v0.3.2][] &mdash; 2017-06-23

### Fixed

- Some issues with clearing of rule failure flags.

## [v0.3.1][] &mdash; 2017-06-23

### Fixed

- Some issues with cache loading and file updates.

## [v0.3.0][] &mdash; 2017-06-23

### Added

- Parsing of knitr concordance files and updating of source references in log
  messages.

## [v0.2.2][] &mdash; 2017-06-10

### Fixed

- Previous rule failure no longer prevents rule evaluation if the inputs of the
  rule have changed.

## [v0.2.1][] &mdash; 2017-06-08

### Fixed

- PatchSyncTeX rule failure causes a warning message versus causing an error
  essage to be sent. This makes a  missing patchSynctex library a non-critical
  failure.

## [v0.2.0][] &mdash; 2017-06-05

### Added

- Scrub command \[[#21][]].
- Ability to override environment variables \[[#23][]].
- Kill command \[[#27][]].
- Validation of in memory file cache \[[#30][]].

### Changed

- Improve response to repeated rule failure \[[#27][]].

## [v0.1.0][] &mdash; 2017-04-29

### Added

- Library API for building documents (@dicy/core).
- Command line interface for building documents (@dicy/cli).
- Rules for running various TeX programs such as: `asy`, `bibtex`, `biber`,
  `xdvipdfmx`, `dvips`, `dvisvgm`, `graphviz`, `knitr`, `(pdf)latex`,
  `lhs2TeX`, `makeglossaries`, `makeindex`, `mpost`, `pdf2ps`, `ps2pdf` and
  `sage`.
- Log parsing for Asymptote, BibTeX, Biber, and LaTeX.
- Configuration parsing in YAML or TeX magic comments.

[v0.8.0]: https://github.com/yitzchak/dicy/compare/v0.7.0...v0.8.0
[v0.7.0]: https://github.com/yitzchak/dicy/compare/v0.6.0...v0.7.0
[v0.6.0]: https://github.com/yitzchak/dicy/compare/v0.5.0...v0.6.0
[v0.5.0]: https://github.com/yitzchak/dicy/compare/v0.4.1...v0.5.0
[v0.4.1]: https://github.com/yitzchak/dicy/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/yitzchak/dicy/compare/v0.3.2...v0.4.0
[v0.3.2]: https://github.com/yitzchak/dicy/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/yitzchak/dicy/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/yitzchak/dicy/compare/v0.2.2...v0.3.0
[v0.2.2]: https://github.com/yitzchak/dicy/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/yitzchak/dicy/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/yitzchak/dicy/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/yitzchak/dicy/tree/v0.1.0

[#69]: https://github.com/yitzchak/dicy/pull/69
[#53]: https://github.com/yitzchak/dicy/pull/53
[#51]: https://github.com/yitzchak/dicy/pull/51
[#49]: https://github.com/yitzchak/dicy/pull/49
[#47]: https://github.com/yitzchak/dicy/pull/47
[#30]: https://github.com/yitzchak/dicy/pull/30
[#27]: https://github.com/yitzchak/dicy/pull/27
[#23]: https://github.com/yitzchak/dicy/pull/23
[#21]: https://github.com/yitzchak/dicy/pull/21
