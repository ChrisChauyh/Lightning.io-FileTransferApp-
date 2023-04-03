(async () => {
    let authenticated = false;
    const userName = localStorage.getItem('userName');
    if (userName) {
        const nameEl = document.querySelector('#userName');
        nameEl.value = userName;
        const user = await getUser(nameEl.value);
        authenticated = user?.authenticated;
    }
    if (authenticated) {
        document.querySelector('#playerName').textContent = "User: "+ userName;
        setDisplay('loginControls', 'none');
        setDisplay('user-actions', 'block');
        setDisplay('upload', 'block');
        setDisplay('wrapper', 'block');

    } else {
        setDisplay('loginControls', 'block');
        setDisplay('user-actions', 'none');
        setDisplay('upload', 'none');
        setDisplay('wrapper', 'none');
    }
})();

async function loginUser() {
    await loginOrCreate(`/api/auth/login`);
}
async function createUser() {
    await loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
    const userName = document.querySelector('#userName')?.value;
    const password = document.querySelector('#userPassword')?.value;
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ email: userName, password: password }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    const body = await response.json();

    if (response?.status === 200) {
        localStorage.setItem('userName', userName);
        window.location.href = 'index.html';
    } else {
        const modalEl = document.querySelector('#msgModal');
        modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
        const msgModal = new bootstrap.Modal(modalEl, {});
        msgModal.show();
    }
}

function setdata(){
    localStorage.setItem("texts",document.getElementById("text-area").value);
    const playerNameReferenceElement = document.getElementById("playerNameReference");
    playerNameReferenceElement.value = localStorage.getItem('userName');

    const textinputelementreference = document.getElementById("textinputReference");
    textinputelementreference.value =  localStorage.getItem("texts");

    const filenamereference = document.getElementById("file-namereference");
    filenamereference.value = localStorage.getItem("localfilename");
    fetch('/upload', {
        method: 'post',
    }).then(()=>(window.location.href='/generate.html'));

}

function logout() {
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
}

async function getUser(email) {
    // See if we have a user with the given email.
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
        return response.json();
    }

    return null;
}

function setDisplay(controlId, display) {
    const playControlEl = document.querySelector(`#${controlId}`);
    if (playControlEl) {
        playControlEl.style.display = display;
    }
}
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
        localStorage.setItem("localfilename",files[0].name);
    }
});
fileInput.addEventListener('change', function(e) {
    var files = e.target.files;
    console.log(files);
    if (files.length > 0) {
        fileName.textContent = 'Uploaded file: ' + files[0].name;
        localStorage.setItem("localfilename",files[0].name);
    }

    // Do something with the selected file(s)
});


//show text
function showtext(){
    const textResult = document.getElementById('text-result');
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('text');

    if (text) {
        textResult.textContent = text;
    }

}
