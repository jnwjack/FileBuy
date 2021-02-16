<link rel="stylesheet" type="text/css" href="../../css/file_upload.css">
<script src="../../js/filedrop.js"></script>
<div class="file-button-wrapper" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)" ondragenter="dragEnterHandler(event)" ondragleave="dragLeaveHandler(event)">
  <input type="file" id="file" class="file-button hoverable" accept="image/*" onchange="selectHandler(this)"/>
  <label for="file">
    <object id="upload-svg" data="../../images/upload.svg"></object>
    Choose a file
  </label>
</div>