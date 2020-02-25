CREATE TABLE IF NOT EXISTS public.Personas(
id serial NOT NULL primary key,
nombre VARCHAR (40) NOT NULL,
apellido VARCHAR (40) NOT NULL,
telefono VARCHAR (40) NOT NULL,
cedula VARCHAR(15) NOT NULL UNIQUE,
correo VARCHAR (100) NOT NULL UNIQUE,
contra VARCHAR (10) NOT NULL
);
	
CREATE TABLE IF NOT EXISTS public.RolUsuarios(
id serial NOT NULL,
idPersona INT NOT NULL,
selecionar VARCHAR (15) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.Login(
id serial NOT NULL,
idPersona INT NOT NULL,
idRolUsuario INT NOT NULL,
correo_elect VARCHAR (50) NOT NULL UNIQUE,
contraseña VARCHAR (10) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.Publicaciones(
id serial NOT NULL,
idImagen TEXT,
idCategoria INT NOT NULL,
idContenido INT NOT NULL,
titulo VARCHAR (20) NOT NULL,
descripcion VARCHAR (300) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.Contenidos(
id serial NOT NULL,
idUsuario INT,
idImagen TEXT,
nombreProducto VARCHAR (35) NOT NULL,
empresa VARCHAR (50) NOT NULL,
descripcion VARCHAR (1000) NOT NULL,
precio VARCHAR (10) NOT NULL,
ciudad VARCHAR (15) NOT NULL,
estado BOOLEAN 
);

CREATE TABLE IF NOT EXISTS public.Imagenes(
id serial NOT NULL,
idContenido INT NOT NULL,
imagen Varchar (100) NOT NULL,
titulo VARCHAR (20) NOT NULL UNIQUE,
descripcion VARCHAR (100) NOT NULL
);


CREATE TABLE IF NOT EXISTS public.Ventas(
id serial NOT NULL,
idContenido INT NOT NULL,
idCategoria INT NOT NULL,
idCompra INT NOT NULL,
productosVendidos VARCHAR (2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.Compras(
id serial NOT NULL,
idPublicacion INT,
idVendedor int,
idImagen TEXT,
nombreProducto VARCHAR (50) NOT NULL,
empresa VARCHAR (50) NOT NULL,
descripcion VARCHAR (1000) NOT NULL,
precio VARCHAR (10) NOT NULL,
ciudad VARCHAR (15) NOT NULL,
fechaCompra TEXT,
nombreVendedor TEXT,
apellidoVendedor TEXT,
telefonoVendedor TEXT,
emailVendedor TEXT,
cedulaVendedor TEXT,
idUsuario TEXT,
nombreComprador TEXT,
apellidoComprador TEXT,
correoComprador TEXT,
telefonoComprador TEXT
);

CREATE TABLE IF NOT EXISTS public.Categorias(
id serial NOT NULL,
idImagen INT NOT NULL,
idContenido INT NOT NULL,
nombreArea VARCHAR (20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.Favoritos(
id serial NOT NULL,
idPublicacion INT NOT NULL,
idImagen INT NOT NULL,
titulo VARCHAR (20) NOT NULL UNIQUE,
descripcion VARCHAR (100) NOT NULL,
precio VARCHAR (10) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.Comentarios(
id serial NOT NULL,
idPersona INT NOT NULL,
idPublicacion INT NOT NULL,
idCompra INT NOT NULL,
descripcion VARCHAR (200) NOT NULL
);


CREATE TABLE IF NOT EXISTS public.ListaCompras(
id serial NOT NULL,
idCompra INT NOT NULL,
idVenta INT NOT NULL,
idPersona INT NOT NULL,
idContenido INT NOT NULL,
productoComprado VARCHAR (10) NOT NULL 
);


CREATE TABLE IF NOT EXISTS public.Historial(
id serial NOT NULL,
idPersona INT NOT NULL
);
insert into personas (primer_nombre,
segundo_nombre,
primer_apellido ,
segundo_apellido,
cedula,
telefono,
ciudad,
correo_elect,
contraseña)
values (
'Jova',
	'Pelo',
	'Peperoni',
	'Concha',
	'15348314',
	'48367123',
	'Lora',
	'asdasd',
	'123'
)























 