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
  units = ['bytes', 'KB', 'MB']
  if(number < 1000 || unitIndex === 3) {
    return number.toString(10) + ' ' + units[unitIndex];
  }
  let nextNumber = number / 1000.0;
  nextNumber = nextNumber.toFixed(2);
  return formatBytes(nextNumber, ++unitIndex);
}

/* truncateString(string)

  Return string that is truncated after a fixed length.
  An ellipsis if there is truncation.

*/
function truncateString(string) {
  const maxLength = 15;
  if(string.length > maxLength) {
    return string.substring(0, maxLength) + '...';
  } else {
    return string;
  }
}

/* validateEmail(email, confirm)

  Check if email and confirm are equal and valid email addresses.

*/
function validateEmail(email, confirm) {
  if(email !== confirm) {
    alert('Error: Email and Email Confirm must match');
    return false;
  }

  if(!isEmailAddress(email)) {
    alert('Error: Invalid Email');
    return false;
  }

  return true;
}