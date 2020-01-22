const Sequelize = require('sequelize');
const sequelize = new Sequelize('baseharvest', 'postgres', 'marcelo272', 
  {
    host: 'localhost',
    dialect: 'postgres',
    
    
  });
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
  const formatoUsuario = sequelize.define("usuarios",{
    nombre: Sequelize.TEXT,
    apellido: Sequelize.TEXT,
    telefono: Sequelize.TEXT,
    ciudad: Sequelize.TEXT,
    correo_elect: Sequelize.TEXT,
    contraseña: Sequelize.TEXT
  },
  {
    timestamps: false
})
  // const formatoUsuario = sequelize.define("InicioSesion",{
  //   correo_elect: Sequelize.JSON,
  //   contraseña: Sequelize.JSON
  // },
  // {
  //   timestamps: false
  // })
  // const formatoUsuario = sequelize.define("Publicaciones",{
  //   titulo: Sequelize.JSON
  // },
  // {
  //   timestamps: false
  // })       
  // const formatoUsuario = sequelize.define("Imagenes",{
  //   imagen64: Sequelize.JSON
  // },
  // {
  //   timestamps: false
  // })
  // const formatoUsuario = sequelize.define("Categorias",{
  //   nombreArea: Sequelize.JSON
  // },
  // {
  //   timestamps: false
  // })
  // const formatoUsuario = sequelize.define("Contenidos",{
  //   nombreProducto: Sequelize.JSON,
  //   empresa: Sequelize.JSON,
  //   descripcion: Sequelize.JSON,
  //   precio: Sequelize.JSON,
  //   estado: Sequelize.BOOLEAN,
  // },
  // {
  //   timestamps: false
  // })
  // const formatoUsuario = sequelize.define("Ventas",{
  //   idUsuarios: Sequelize.JSON,
  //   idContenido: Sequelize.JSON,
  //   idCategoria: Sequelize.JSON,
  //   idCompra: Sequelize.JSON,
  //   idUsuarios: Sequelize.JSON,
  //   idUsuarios: Sequelize.JSON,
  // },
  // {
  //   timestamps: false
  // })
        
 
exports.formatoUsuario = formatoUsuario;