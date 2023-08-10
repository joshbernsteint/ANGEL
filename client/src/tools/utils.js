
//Converts a time from seconds into HH:MM:SS
export function convertTime(length_seconds){

    function padZero(time){
        return (time < 10) ? `0${time}` : `${time}`
    }
    const hours = Math.floor(length_seconds / 3600)
    length_seconds %= 3600;
    const minutes = Math.floor(length_seconds / 60);
    length_seconds %= 60;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(length_seconds)}`
}

/**
 * Determines if the port # is a valid value
 * @param {*} num: The value to be checked
 * @returns: `True` if the value is a valid port #, `false` otherwise
 */
export function isValidPort(num){
    return (0 <= num && num <= 65535)
}

/**
 * Returns the file extension of the passed string
 * @param {String} fileName: The name of the file
 * @returns: The file extension of the passed file in capital letters
 */
export function getFileExtension(fileName){
    return fileName.split('.').pop().toUpperCase();
}

/**
 * Returns the size of the file expressed as a string
 * @param {int} file_size_num: An integer representing the number of bytes in the file
 * @param {int} sig_figs: The number of signifiicant figures the result will have
 * @returns: A string containing the size of the file with `sig_figs` figures and an appropriate unit
 */
export function getFileSize(file_size_num, sig_figs=4){
    var result = "";
    const num_digits = file_size_num.toString().length;
    if(num_digits > 9){//If the file size can be expressed in GB
        result = `${(file_size_num / 1E9).toString().substring(0,sig_figs+1)} GB`
    }
    else if(num_digits > 6){//if the file size can be expressed in MB
        result = `${(file_size_num / 1E6).toString().substring(0,sig_figs+1)} MB`
    }
    else{//If the file size can be expressed in KB
        result += `${(file_size_num / 1E3).toString().substring(0,sig_figs+1)} KB`
    }
    return result;
}


/**
 * Determines if `file` is a duplicate within `file_list`
 * @param {File} file: A File object
 * @param {int} index: The index of `file` in `file_list`
 * @param {list} file_list: A list of File objects
 * @returns: **True** if `file` is a duplicate, **False** if it is unique
 */
export function isDuplicateFile(file, index, file_list){
    var retVal = false;
    retVal = !file_list.every((el,i) => {
        if(i !== index){
            if(el.name === file.name && el.size === file.size && el.lastModified === file.lastModified){
                return false;
            }
        }
        return true;
    })
    return retVal;
}

/**
 * Gets the number of unique file types in the file_list
 * @param {list} file_list: A list of **File** objects
 * @returns: A list containing each unique file type, or "None" if the list is empty
 */
export function getUniqueFileTypes(file_list){
    var test_set = new Set();
    var result = []
    file_list.forEach(el => {
        const file_extension = getFileExtension(el.name);
        if(!test_set.has(file_extension)){
            result.push(file_extension);
            test_set.add(file_extension);
        }
    })
    return (result.length === 0) ? "None" : result;
}