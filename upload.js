var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var fileName = document.getElementById('file-name');

dropzone.addEventListener('click', function(e) {
    fileInput.click();
});

dropzone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', function(e) {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    var files = e.dataTransfer.files;
    console.log(files);
    // Display the name of the first uploaded file
    if (files.length > 0) {
        fileName.textContent = 'Uploaded file: ' + files[0].name;
    }
    // Do something with the dropped files
});
fileInput.addEventListener('change', function(e) {
    var files = e.target.files;
    console.log(files);
    if (files.length > 0) {
        fileName.textContent = 'Uploaded file: ' + files[0].name;
    }
    // Do something with the selected file(s)
});