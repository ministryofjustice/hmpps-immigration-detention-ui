import ValidationError from '../model/validationError'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const fieldHasErrors = (errors: ValidationError[], field: string) => {
  return !!errors.find(error => error.fields.indexOf(field) !== -1)
}

export const dateItems = (year: string, month: string, day: string, prefix: string, errors: ValidationError[]) => {
  return [
    {
      name: `day`,
      classes: `govuk-input--width-2${fieldHasErrors(errors, `${prefix}-day`) ? ' govuk-input--error' : ''}`,
      value: day,
      attributes: { maxLength: 2 },
    },
    {
      name: `month`,
      classes: `govuk-input--width-2${fieldHasErrors(errors, `${prefix}-month`) ? ' govuk-input--error' : ''}`,
      value: month,
      attributes: { maxLength: 2 },
    },
    {
      name: `year`,
      classes: `govuk-input--width-4${fieldHasErrors(errors, `${prefix}-year`) ? ' govuk-input--error' : ''}`,
      value: year,
      attributes: { maxLength: 4 },
    },
  ]
}
