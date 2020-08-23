function isImage(file) {
  if (file && file.name.match("\.(png|jpg|gif|jpeg)$")) {
      return true;
  }
  return false;
}

function isEmailAddress(string) {
  if (string && string.match("^[^@]+@[^@]+\.[^@]+$")) {
    return true;
  }
  return false;
}

function formatBytes(number, unitIndex = 0) {
  units = ['bytes', 'KB', 'GB']
  if(number < 1000 || unitIndex === 3) {
    return number.toString(10) + ' ' + units[unitIndex];
  }
  let nextNumber = number / 1000.0;
  nextNumber.toFixed(2);
  return formatBytes(nextNumber, ++unitIndex);
}