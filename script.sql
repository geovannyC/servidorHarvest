CREATE TABLE Usuarios(
   id serial NOT NULL,
	nombre VARCHAR (40) NOT NULL,
	apellido VARCHAR (40) NOT NULL,
	telefono VARCHAR (10) NOT NULL,
	ciudad VARCHAR (40) NOT NULL,
	correo_elect VARCHAR (50) NOT NULL,
	contraseña VARCHAR (10) NOT NULL
)