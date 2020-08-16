function isImage(file) {
  if (file && file.name.match("\.(png|jpg|gif|jpeg)$")) {
      return true;
  }
  return false;
}

function isEmailAddress(string) {
  if(string && string.match("^[^@]+@[^@]+\.[^@]+$")) {
    return true;
  }
  return false;
}