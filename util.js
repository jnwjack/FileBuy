function isImage(file) {
  if (file && file.name.match("\.(png|jpg|gif|jpeg)$")) {
      return true;
  }
  return false;
}