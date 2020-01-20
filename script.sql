CREATE TABLE usuarios(
   ID SERIAL PRIMARY KEY,
   Nombre JSON NOT NULL,
	Apellido JSON NOT NULL,
	email JSON NOT NULL,
	pass text
)