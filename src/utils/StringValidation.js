/**
  @module stringValidation
*/

/**
 * Removes invalid commas from the input string.
 * An invalid comma is any comma that appears at the beginning of the string
 * or is immediately preceded by another comma.
 * @param {string} str - The string to be processed.
 * @returns {string} - The processed string.
 */
export function removeInvalidCommas(str) {

    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === ',') {
            if (i === 0 || str.charAt(i - 1) === ',') {
                str = str.substring(0, i) + '' + str.substring(i + 1);
            }
        }
    }

    return str;
}


/**
 * Removes any trailing comma from the input string.
 * A trailing comma is any comma that appears at the end of the string.
 * @param {string} str - The string to be processed.
 * @returns {string} - The processed string.
 */
export function removeAnyTrailingComma(str) {
    if (str.charAt(str.length - 1) === ',')
        return str.substring(0, str.length - 1);
    return str;
}

/**
 * Checks if a new string contains a duplicate of the last element of the original string.
 * The original string is split into its parts using commas as a delimiter,
 * and the last element is compared to the last element of the new string,
 * which is also split using commas as a delimiter.
 * @param {string} originalStr - The original string.
 * @param {string} newStr - The new string.
 * @returns {boolean} - A boolean value indicating whether or not the new string
 * contains a duplicate of the last element of the original string.
 */
export function isDuplicate(originalStr, newStr) {

    if (newStr.length < originalStr.length)
        return false;

    const newStrParts = newStr.split(',');
    let lastElement = newStrParts[newStrParts.length - 1];
    return originalStr.split(',').includes(lastElement);

}

