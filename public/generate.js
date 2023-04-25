

var host = window.location.hostname;
var port = window.location.port;
var imgSrc1 = "https://api.qrserver.com/v1/create-qr-code/?data=";
var imgSrc2 = "&size=200x200";
var img = document.getElementById("qrimage");
var a = document.getElementById("downloadbtn");
var text = document.getElementById("text-result");
const urlParams = new URLSearchParams(window.location.search);
const filenameHash = urlParams.get('value');
img.src = imgSrc1 + "https://" + host + ":" + port + "/download/" + filenameHash+ imgSrc2;
a.href = "https://" + host + ":" + port + "/download/" + filenameHash;
text.innerText = "This is your text: \n \n" + localStorage.getItem("texts");

