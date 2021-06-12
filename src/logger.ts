import { green } from 'kleur'
import { gray, red, strikethrough, yellow } from 'kleur/colors'
import { Entry, Operation } from './rename'

const isTesting = process.env.NODE_ENV === 'testing'

/**
 * Logs an operation.
 */
function operation(operation: Operation, initialFileName: string, finalFileName: string) {
	if (isTesting) {
		return
	}

	if (operation === 'DELETE') {
		console.log(`[${red('delete')}] ${gray(initialFileName)} » ${red(strikethrough(initialFileName))}`)
	}

	if (operation === 'RENAME') {
		console.log(`[${yellow('rename')}] ${gray(initialFileName)} » ${yellow(finalFileName)}`)
	}

	if (operation === 'NONE') {
		console.log(`  [${gray('keep')}] ${gray(initialFileName)} » ${gray(finalFileName)}`)
	}
}

/**
 * Logs an error.
 */
function error(error: Error) {
	if (isTesting) {
		return
	}

	console.log(`[${red('error')}] ${error.message}`)
}

/**
 * Logs feedback about the operations.
 */
function feedback(entries: Entry[]) {
	if (isTesting) {
		return
	}

	const renames = entries.filter(({ operation }) => operation === 'RENAME').length
	const deletions = entries.filter(({ operation }) => operation === 'DELETE').length

	console.log(
		`[${green('success')}] ${entries.length} file${
			entries.length > 1 ? 's' : ''
		} updated (${renames} renamed, ${deletions} deleted).`,
	)
}

export const logger = {
	operation,
	error,
	feedback,
}
