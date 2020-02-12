const Sequelize = require('sequelize');
const sequelize = new Sequelize('harvest', 'postgres', 'marcelo272', 
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
  
  const personas = sequelize.define("personas",{
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.TEXT,
      defaultValue: Sequelize.UUIDV4()
    },
    primer_nombre: Sequelize.TEXT,
    segundo_nombre: Sequelize.TEXT,
    primer_apellido: Sequelize.TEXT,
    segundo_apellido: Sequelize.TEXT,
    cedula: Sequelize.TEXT,
    telefono: Sequelize.TEXT,
    ciudad: Sequelize.TEXT,
    correo_elect: Sequelize.TEXT,
    contraseña: Sequelize.TEXT,
  },
  {
    timestamps: false
})
  const RolUsuario = sequelize.define("RolUsuario",{
    idPersona: Sequelize.TEXT,
    idRolUsuario: Sequelize.TEXT,
    selecionar: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Login = sequelize.define("Login",{
    idPersona: Sequelize.TEXT,
    idRolUsuario: Sequelize.TEXT,
    correo_elect: Sequelize.TEXT,
    contraseña: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Publicaciones = sequelize.define("Publicaciones",{
    idImagen: Sequelize.TEXT,
    idCategoria: Sequelize.TEXT,
    idContenido: Sequelize.TEXT,
    titulo: Sequelize.TEXT,
    descripcion: Sequelize.TEXT,
  },
  {
    timestamps: false
  })
  const Contenidos = sequelize.define("contenidos",{
  
    idimagen: Sequelize.TEXT,
    nombreproducto: Sequelize.TEXT,
    empresa: Sequelize.TEXT,
    descripcion: Sequelize.TEXT,
    precio: Sequelize.TEXT,
    ciudad: Sequelize.TEXT,
    estado: Sequelize.TEXT,
  },
  {
    timestamps: false
  })
  const Imagenes = sequelize.define("Imagenes",{
    idContenido: Sequelize.TEXT,
    imagen: Sequelize.TEXT,
    titulo: Sequelize.TEXT,
    imagen64: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Ventas = sequelize.define("Ventas",{
    idContenido: Sequelize.TEXT,
    idCategoria: Sequelize.TEXT,
    idCompra: Sequelize.TEXT,
    productosVendidos: Sequelize.TEXT
  },
  {
    timestamps: false
  })
 
  const Compras = sequelize.define("Compras",{
    idContenido: Sequelize.TEXT,
    idPublicacion: Sequelize.TEXT,
    idPersona: Sequelize.TEXT,
    fechaCompra: Sequelize.TEXT,
    fecharEntrega: Sequelize.TEXT,
    tipoPago: Sequelize.TEXT,
    estado: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Categorias = sequelize.define("Categorias",{
    idImagen: Sequelize.TEXT,
    idContenido: Sequelize.TEXT,
    nombreArea: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Favoritos = sequelize.define("Favoritos",{
    idPublicacion: Sequelize.TEXT,
    idImagen: Sequelize.TEXT,
    titulo: Sequelize.TEXT,
    descripcion: Sequelize.TEXT,
    precio: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Comentarios = sequelize.define("Comentarios",{
    idPersona: Sequelize.TEXT,
    idPublicacion: Sequelize.TEXT,
    idCompra: Sequelize.TEXT,
    descripcion: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const ListaCompras = sequelize.define("ListaCompras",{
    idCompra: Sequelize.TEXT,
    idVenta: Sequelize.TEXT,
    idPersona: Sequelize.TEXT,
    idContenido: Sequelize.TEXT,
    productoComprado: Sequelize.TEXT
  },
  {
    timestamps: false
  })
  const Historial = sequelize.define("Historial",{
    idPersona: Sequelize.TEXT
  },
  {
    timestamps: false
  })

        
 
exports.personas = personas;
exports.RolUsuario = RolUsuario;
exports.Login = Login;
exports.Publicaciones = Publicaciones;
exports.Contenidos = Contenidos;
exports.Imagenes = Imagenes;
exports.Ventas = Ventas;
exports.Compras = Compras;
exports.Categorias = Categorias;
exports.Favoritos = Favoritos;
exports.Comentarios = Comentarios;
exports.ListaCompras = ListaCompras;
exports.Historial = Historial;