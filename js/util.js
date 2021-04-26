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

/* formatPrice(number)

  Return value formatted as float such that there will always be 2 decimal places

*/
function formatPrice(number) {
  return number.toFixed(2);
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

/* extractURLRoot(string) 

  Get URL root (e.g. https://filebuy.app/) from string

*/
function extractURLRoot(string) {
  // Get index of 3rd forward slash
  let count = 0;
  let lastOccurence = 0;
  while(count < 3 && lastOccurence !== -1) {
    lastOccurence = string.indexOf('/', lastOccurence+1);
    count++;
  }

  // Return string from index 0 to index of 3rd slash
  return string.substring(0, lastOccurence);
}

/* removeQuotes(string)

  Remove quotation marks surrounding a string

*/
function removeQuotes(string) {
  return string.replace('"', '');
}