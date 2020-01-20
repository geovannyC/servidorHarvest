const {Pool } = require('pg');
const config ={
    user: 'postgres',
    host: 'localhost',
    password: 'marcelo272',
    database: 'baseharvest'
};
const pool = new Pool (config)
const datUsr = async() =>{
    try{
        const datUsr=await pool.query('select * from userExample');
        console.log(datUsr.rows);
        pool.end();
    }catch(error){
        console.log(error)
    }
}
const insertUsr = async() =>{
    const text= "INSERT INTO userExample(id,nombre, apellido, edad, email) VALUES ($1,$2,$3,$4,$5)"
    const VALUES=[1,'Juanito','Comela',21,'juanComela@gmail.com']
    const res = await pool.query(text, VALUES);
    console.log(res)
    pool.end();
}
const deleteUsr = async() =>{
    const text = 'DELETE FROM userExample WHERE nombre = $1';
    const value = ['pepito'];
    const res = await pool.query(text,value);
    console.log(res)
}
const updateUsr = async()=>{
    const text = 'UPDATE userExample SET nombre = $1 WHERE nombre = $2';
    const values = ['pepito', 'Juanito'];
    const res = await pool.query(text,values);
    pool.end();
    console.log(res)
}
const prueba;
exports.datUsr = datUsr;
exports.insertUsr = insertUsr;
exports.deleteUsr = deleteUsr;
exports.updateUsr = updateUsr;
