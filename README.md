<h2 align="center">Renamer</h2>

<p align="center">
  <a href="https://github.com/innocenzi/renamer/actions?query=workflow%3Aci">
    <img alt="Status" src="https://github.com/innocenzi/rename/actions/workflows/ci.yml/badge.svg">
  </a>
  <span>&nbsp;</span>
  <a href="https://www.npmjs.com/package/@innocenzi/rename">
    <img alt="npm" src="https://img.shields.io/npm/v/@innocenzi/rename">
  </a>
  <br />
  <br />
  <p align="center">
    A command line utility to batch-rename files via your editor.
  </p>
  <pre><div align="center">npm i -g @innocenzi/rename</div></pre>
</p>

&nbsp;

## Usage

In a directory, use `rn` to open your configured editor. Each line corresponds to a file:

- If you change a line, the corresponding file will be renamed accordingly.
- If you erase the line while keeping the line jump, the file will be deleted.

Note the following scenarios: 

- If you completely delete a line, the operations will be canceled.
- If you rename multiple files with the exact same name, the last one will take over and the previous ones will be deleted.

&nbsp;

## Options

| Argument   | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `--dry`    | Prints the output to the console without actually applying the changes |
| `--silent` | Prevents from printing to the console                                  |

&nbsp;

## Configuration

Your `RENAME_EDITOR` or `EDITOR` environment variable will be used to determine your editor of choice. If none of these are defined, Visual Studio Code will be used instead. If Code is not installed either, or if the configured editor can not be opened, the program will fail.

The following table is a reference from the [Git documentation](https://git-scm.com/book/en/v2/Appendix-C%3A-Git-Commands-Setup-and-Config#ch_core_editor) that can be used to set up your editor.

| Editor                                                        | Environment variable value                                                            |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Atom                                                          | `atom --wait`                                                                         |
| BBEdit (Mac, with command line tools)                         | `bbedit -w`                                                                           |
| Emacs                                                         | `emacs`                                                                               |
| Gedit (Linux)                                                 | `gedit --wait --new-window`                                                           |
| Gvim (Windows 64-bit)                                         | `'C:\Program Files\Vim\vim72\gvim.exe' --nofork '%*'`                                 |
| Kate (Linux)                                                  | `kate`                                                                                |
| nano                                                          | `nano -w`                                                                             |
| Notepad (Windows 64-bit)                                      | `notepad`                                                                             |
| Notepad++ (Windows 64-bit)                                    | `'C:\Program Files\Notepad\notepad.exe' -multiInst -notabbar -nosession -noPlugin`    |
| Scratch (Linux)                                               | `scratch-text-editor`                                                                 |
| Sublime Text (macOS)                                          | `/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl --new-window --wait` |
| Sublime Text (Windows 64-bit)                                 | `'C:\Program Files\Sublime Text 3\sublime_text.exe' -w`                               |
| TextEdit (macOS)                                              | `open --wait-apps --new -e`                                                           |
| Textmate                                                      | `mate -w`                                                                             |
| Textpad (Windows 64-bit)                                      | `'C:\Program Files\TextPad 5\TextPad.exe' -m`                                         |
| UltraEdit (Windows 64-bit)                                    | `Uedit32`                                                                             |
| Vim                                                           | `vim`                                                                                 |
| Visual Studio Code                                            | `code --wait`                                                                         |
| VSCodium (Free/Libre Open Source Software Binaries of VSCode) | `codium --wait`                                                                       |
| WordPad                                                       | `"C:\Program Files\Windows NT\Accessories\wordpad.exe"`                               |
| Xi                                                            | `xi --wait`                                                                           |

&nbsp;

<p align="center">
  <br />
  <br />
  <img width="800px" src="https://i.imgur.com/ou5lra2.gif" alt="Demonstration of the CLI" />
  <br />
  <br />
  <img width="800px" src="https://i.imgur.com/SLoR6C1.gif" alt="Demonstration of the CLI" />
  <br />
  ·
  <br />
  <br />
  <sub>Built with ❤︎ by <a href="https://twitter.com/enzoinnocenzi">Enzo Innocenzi</a>
</p>
