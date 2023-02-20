# XBM Tools

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/troeggla/xbm/run_tests.yml?branch=master)&emsp;[![Codecov Coverage](https://img.shields.io/codecov/c/github/troeggla/xbm/master.svg?style=flat-square)](https://codecov.io/gh/troeggla/xbm/)

This package contains functions for reading and writing XBM-formatted data.
The package exports two main functions. The first of which is `readXBM(data)`,
which reads XBM-formatted data as a string, tries to parse it and returns a
matrix of booleans where each entry represents a "pixel". The second function
is `generateXBM(name, grid)`, which takes a name for the variables in the
output string and a two-dimensional matrix of boolean values and converts it
into XBM-formatted data as a string.
Refer to the [documentation](https://troeggla.github.io/xbm/) for more details.

Files in the XBM format are essentially little C header files containing image
data stored in a numeric format, where each bit of these numbers represents a
pixel. If you want to know more about XBM, please refer to [this Wikipedia
article](https://en.wikipedia.org/wiki/X_BitMap). XBM is not particularly
useful on computers anymore, but it is commonly used as an "image format" for
tiny monochrome OLED displays in combination with Arduino microcontrollers.

To see this package in action, please refer to my Electron-based application
[XBM-Editor](https://github.com/troeggla/xbm-editor), which is a simple drawing
program specifically geared towards working with XBM.
