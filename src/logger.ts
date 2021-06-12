import { green, gray, red, strikethrough, yellow } from 'kleur/colors'
import { Entry, Operation, Options } from './rename'

const isTesting = process.env.NODE_ENV === 'testing'

/**
 * Logs an operation.
 */
function operation(operation: Operation, initialFileName: string, finalFileName: string) {
	if (isTesting) {
		return
	}

	if (operation === 'DELETE') {
		console.log(`${prefix(red('delete'))} ${gray(initialFileName)} ${gray('»')} ${red(strikethrough(initialFileName))}`)
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
function error(error: Error) {
	if (isTesting) {
		return
	}

	console.log(`${prefix(red('error'))} ${error.message}`)
}

/**
 * Logs feedback about the operations.
 */
function feedback(entries: Entry[], resolved: Options) {
	if (isTesting) {
		return
	}

	const renames = entries.filter(({ operation }) => operation === 'RENAME').length
	const deletions = entries.filter(({ operation }) => operation === 'DELETE').length
	const total = renames + deletions
	const feedback = `${total} file${total === 1 ? '' : 's'} updated (${renames} renamed, ${deletions} deleted).`

	console.log(`${prefix(resolved.dry ? yellow('dry run') : green('success'))} ${feedback}`)
}

function prefix(str: string) {
	return `[${str}]`
}

export const logger = {
	operation,
	error,
	feedback,
}
