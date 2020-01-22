const http = require('http');
const http1= new XMLHttpRequest();
const API_URL = "http://localhost:3000/server/bingo";
http1.open("POST", API_URL, true);
http1.setRequestHeader("Content-Type", "application/json");
alert("Se ha registrado correctamente");
window.location.assign("../web/registro.html");