var host = window.location.hostname;
    var port = window.location.port;
    var imgSrc1 = "https://api.qrserver.com/v1/create-qr-code/?data=";
    var imgSrc2 = "&size=200x200";
    var img = document.getElementById("qrimage");
    var a =document.getElementById("downloadbtn");
    img.src = imgSrc1 + "http://"+ host + ":" + port + "/download/"+localStorage.getItem("localfilename")+ imgSrc2;
    a.href = "http://"+ host + ":" + port + "/download/"+localStorage.getItem("localfilename");
    // document.body.appendChild(img);

