import { green, gray, red, strikethrough, yellow } from 'kleur/colors'
import { Entry, getOptionsWithDefaults, Operation, Options } from './rename'

const isTesting = process.env.NODE_ENV === 'testing'

function prefix(str: string) {
	return `[${str}]`
}

export class Logger {
	protected _options: Options = getOptionsWithDefaults({})

	/**
	 * Sets the options for this instance.
	 */
	options(opts: Partial<Options>) {
		this._options = getOptionsWithDefaults(opts)
	}

	protected shouldPrint() {
		return !isTesting && !this._options.silent
	}

	/**
	 * Logs an operation.
	 */
	operation(operation: Operation, initialFileName: string, finalFileName: string) {
		if (!this.shouldPrint()) {
			return
		}

		if (operation === 'DELETE') {
			console.log(
				`${prefix(red('delete'))} ${gray(initialFileName)} ${gray('»')} ${red(strikethrough(initialFileName))}`,
			)
		}

		if (operation === 'RENAME') {
			console.log(`${prefix(yellow('rename'))} ${gray(initialFileName)} ${gray('»')} ${yellow(finalFileName)}`)
		}

		if (operation === 'NONE') {
			console.log(`${prefix(gray('ignore'))} ${gray(initialFileName)} ${gray('»')} ${gray(finalFileName)}`)
		}
	}

	/**
	 * Logs an error.
	 */
	error(error: Error) {
		if (!this.shouldPrint()) {
			return
		}

		console.log(`${prefix(red('error'))} ${error.message}`)
	}

	/**
	 * Logs feedback about the operations.
	 */
	feedback(entries: Entry[], resolved: Options) {
		if (!this.shouldPrint()) {
			return
		}

		const renames = entries.filter(({ operation }) => operation === 'RENAME').length
		const deletions = entries.filter(({ operation }) => operation === 'DELETE').length
		const total = renames + deletions
		const feedback = `${total} file${total === 1 ? '' : 's'} updated (${renames} renamed, ${deletions} deleted).`

		console.log(`${prefix(resolved.dry ? yellow('dry run') : green('success'))} ${feedback}`)
	}
}

export const logger = new Logger()
