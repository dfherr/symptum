/* This file contains some helper methods to convert base64 data to blob and other way around!
    The exported functions are used in upload picture feature to handle POST and GET request for picture of the drug
 */

 /**
  * Returns the format of base64string of a image
  * @param {*} data 
  */
export function dataFormat(data) {
    return data.split("/")[1].split(";")[0];
}

