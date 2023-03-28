export const removeInvalidCommas = (str) =>{

    for(let i=0; i<str.length; i++){
        if(str.charAt(i)===','){
            if(i===0||str.charAt(i-1)===','){
                str = str.substring(0, i) + '' + str.substring(i + 1);
            }
        }
    }

    return str;
}

export const removeAnyTrailingComma = (str) => {
    if(str.charAt(str.length-1)===',')
        return str.substring(0, str.length-1);
    return str;
}

export const isDuplicate = (originalStr, newStr) => {

    if(newStr.length<originalStr.length)
        return false;

    const newStrParts = newStr.split(',');
    let lastElement = newStrParts[newStrParts.length - 1];
    return originalStr.split(',').includes(lastElement);
    
}

