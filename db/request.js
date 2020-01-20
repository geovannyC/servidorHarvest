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
    nombre: Sequelize.JSON,
    apellido: Sequelize.JSON,
    email: Sequelize.JSON,
    pass: Sequelize.TEXT
  },
  {
    timestamps: false
})
 
exports.formatoUsuario = formatoUsuario;;