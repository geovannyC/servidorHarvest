let datos;
obtenerDatos=()=>{
    let nombre = document.getElementById("Nombre").value;
    let apellido = document.getElementById("Apellido").value;
    let telefono = document.getElementById("Telefono").value;
    let ciudad = document.getElementById("Ciudad").value;
    let correo_elect = document.getElementById("Correo").value;
    let contraseña = document.getElementById("Contraseña").value;
    let data = {
      nombre: nombre, 
      apellido: apellido,
      telefono: telefono,
      ciudad: ciudad, 
      correo_elect: correo_elect,
      contraseña:contraseña
    }
    
    datos = data
    console.log(datos)
  }
module.exports = datos;