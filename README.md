<h2 align="center">Renamer</h2>
<p align="center">
  A command line utility to batch-rename files via your editor.
</p>

<p align="center">
  <a href="https://github.com/innocenzi/renamer/actions?query=workflow%3Aci">
    <img alt="Status" src="https://github.com/innocenzi/rename/actions/workflows/ci.yml/badge.svg">
  </a>
  <span>&nbsp;</span>
  <a href="https://www.npmjs.com/package/@innocenzi/rename">
    <img alt="npm" src="https://img.shields.io/npm/v/@innocenzi/rename">
  </a>
  <br />
  <pre><div align="center">npm i -g @innocenzi/rename</div></pre>
</p>

&nbsp;

## Usage

In a directory, use `rn` to open Code. Each line corresponds to a file:

- If you change a line, the corresponding file will be renamed accordingly.
- If you erase the line while keeping the line jump, the file will be deleted.

&nbsp;

## Options

| Argument   | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `--dry`    | Prints the output to the console without actually applying the changes |
| `--force`  | Allows offsetting file names when completely removing a line           |
| `--silent` | Prevents from printing to the console                                  |

&nbsp;

## Roadmap

- [ ] Tests
- [ ] Support other editors
      This feature requires the ability to have a persistent configuration, the same way `git` does.

<p align="center">
  <br />
  ·
  <br />
  <br />
  <sub>Built with ❤︎ by <a href="https://twitter.com/enzoinnocenzi">Enzo Innocenzi</a>
</p>
