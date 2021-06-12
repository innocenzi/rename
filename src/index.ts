#!/usr/bin/env node

import createInterface from 'cac'
import { startRenameProcess } from './rename'
import { readFile } from 'fs/promises'
import { invoke, findDirectory } from './utils'
import { logger } from './logger'

invoke(async () => {
	const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), { encoding: 'utf-8' }))
	const cli = createInterface('renamer')
		.option('-d, --dry', 'Do not actually apply the changes', { default: false })
		.option('-s, --silent', 'Do not write on the standard output', { default: false })
		.option('-f, --force', 'Allow line count mismatches', { default: false })
		.usage('[directory] [...options]')
		.version(version)
		.help()

	const { options, args } = cli.parse()

	if (options.help || options.version) {
		return process.exit(0)
	}

	logger.options({ silent: options.silent })

	try {
		await startRenameProcess({
			directory: await findDirectory(args[0]),
			silent: options.silent,
			dry: options.dry,
			force: options.force,
		})
	} catch (error) {
		logger.error(error)
		process.exit(1)
	}
})
