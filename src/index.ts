#!/bin/env node

import createInterface from 'cac'
import { startRenameProcess } from './rename'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { invoke, findDirectory } from './utils'
import { red } from 'kleur/colors'

invoke(async () => {
	const { version } = JSON.parse(await readFile(join(__dirname, '..', 'package.json'), { encoding: 'utf-8' }))
	const cli = createInterface('renamer')
		.option('-d, --dry', 'Do not actually apply the changes', { default: false })
		.option('-s, --silent', 'Do not write on the standard output', { default: false })
		.usage('[directory] [...options]')
		.version(version)
		.help()

	const { options, args } = cli.parse()

	if (options.help) {
		return process.exit(0)
	}

	try {
		await startRenameProcess({
			directory: await findDirectory(args[0]),
			silent: options.silent,
			dry: options.dry,
		})
	} catch (error) {
		console.log(`[${red('error')}]`, error.message)
		process.exit(1)
	}
})
