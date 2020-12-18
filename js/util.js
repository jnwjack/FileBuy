/* isImage(file)

  Checks if file is image via its file extension.

*/
function isImage(file) {
  if (file && file.name.match("\.(png|jpg|gif|jpeg)$")) {
      return true;
  }
  return false;
}

/* isEmailAddress(string)

  Checks if email is valid via RegEx.

*/
function isEmailAddress(string) {
  if (string && string.match("^[^@]+@[^@]+\.[^@]+$")) {
    return true;
  }
  return false;
}


/* formatBytes(number, unitIndex=0)

  Returns string that displays number of bytes
  in units of bytes, KB, or GB.

*/
function formatBytes(number, unitIndex = 0) {
  units = ['bytes', 'KB', 'GB']
  if(number < 1000 || unitIndex === 3) {
    return number.toString(10) + ' ' + units[unitIndex];
  }
  let nextNumber = number / 1000.0;
  nextNumber.toFixed(2);
  return formatBytes(nextNumber, ++unitIndex);
}