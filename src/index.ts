#!/usr/bin/env node

import createInterface from 'cac'
import { startRenameProcess } from './rename'
import { readFile } from 'fs/promises'
import { invoke } from './utils'
import { logger } from './logger'

invoke(async () => {
	const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), { encoding: 'utf-8' }))
	const cli = createInterface('renamer')
		.option('-D, --dry', 'Do not actually apply the changes', { default: false })
		.option('-s, --silent', 'Do not write on the standard output', { default: false })
		.option('-d, --dirs, --dir', 'Only match directories', { default: false })
		.option('-f, --files, --file', 'Only match files', { default: false })
		.option('-b, --base <directory>', 'Base directory in which to search', { default: process.cwd() })
		.option('--depth <depth>', 'Specify the maximum depth when using a globstar')
		.usage('[match] [...options]')
		.version(version)
		.help()

	const { options, args } = cli.parse()

	if (options.help || options.version) {
		return process.exit(0)
	}

	if (options.files && options.dirs) {
		logger.error(new Error('You cannot use both --files and --dirs.'))
	}

	logger.options({ silent: options.silent })

	try {
		await startRenameProcess({
			glob: args[0],
			directory: options.base,
			onlyDirectories: options.dirs,
			onlyFiles: options.files,
			silent: options.silent,
			depth: options.depth,
			dry: options.dry,
		})
	} catch (error) {
		logger.error(error)
		process.exit(1)
	}
})
