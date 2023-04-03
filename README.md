# Part II Computational Physics

This repository holds the resources for the Part II Computational Physics
run by Professor Austen Lamacraft at Cavendish Laboratory, University of Cambridge.

## Installation

1. Install [Quarto](https://quarto.org/)
2. Install the Quarto integration for your editor of choice
3. Set up a virtual environment
   1. `python -m venv .venv`
   2. Activate the environment
      1. UNIX: `source .venv/bin/python`
      2. VSCode: `Python: Select Intepreter` → Select the local virtual environment
   3. Install the requirements: `pip install -r requirements.txt`
4. Render the Quarto book using your Quarto integration. The VS Code extension has a `Render Project` command, which will open a preview server in VS Code. However, note that this uses the option `no-watch-inputs` which won't watch for changes to the files. Strangely, if you just use `Render` it will render the current file and _will_ take the defaults from `_quarto.yml`, i.e. watch inputs and no browser. But you won't be able to switch to live preview of _another_ file. Alternatively, stop `quarto preview` after the live server has opened and then restart it from the command line with no options to use the options in `_quarto.yml`.