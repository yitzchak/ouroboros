# DiCy

[![Build Status][travis svg]][travis]
[![Windows Build Status][appveyor svg]][appveyor]
[![Dependency Status][dependency svg]][dependency]
[![devDependency Status][devdependency svg]][devdependency]

This repository contains various packages associated with DiCy, a
JavaScript/TypeScript based builder for LaTeX, knitr, Literate Agda, Literate
Haskell, and Pweave that automatically builds dependencies. DiCy parses and
filters output logs and error messages generated during build and can build
projects that utilize the following programs to process files.

-   Bibliographies — Biber, BibTeX, BibTeX8, BibTeXu, pBibTeX, upBibTeX
-   Graphics Creation — Asymptote, MetaPost
-   Image/File Conversion — dvipdfm, dvipdfmx, dvips, dvisvgm, epstopdf, pdf2ps,
    ps2pdf
-   Indexing/Glossaries — bib2gls, makeglossaries, makeindex, mendex,
    splitindex, texindy, upmendex
-   LaTeX Engines — LaTeX, LuaLaTeX, pdfLaTeX, pLaTeX, upLaTeX, XeLaTeX
-   Literate Programming/Reproducible Research — Agda, knitr, lhs2TeX,
    patchSynctex, PythonTeX, Pweave, SageTeX

More information, including installation and API documentation is available at
the [DiCy][] website.

## License

This project is licensed under the MIT License - see the LICENSE.md file for
details.

[appveyor svg]: https://ci.appveyor.com/api/projects/status/606n3xt2oa8l2vme?svg=true

[appveyor]: https://ci.appveyor.com/project/yitzchak/dicy/branch/master

[dependency svg]: https://david-dm.org/yitzchak/dicy.svg

[dependency]: https://david-dm.org/yitzchak/dicy

[devdependency svg]: https://david-dm.org/yitzchak/dicy/dev-status.svg

[devdependency]: https://david-dm.org/yitzchak/dicy?type=dev

[dicy]: https://yitzchak.github.io/dicy/

[travis svg]: https://travis-ci.org/yitzchak/dicy.svg?branch=master

[travis]: https://travis-ci.org/yitzchak/dicy
