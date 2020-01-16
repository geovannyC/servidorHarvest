const express = require('express');
const router = express.Router();
const consultasDB = require('../db/request')

router.get('/', (req, res, next) =>{
    consultasDB.insertUsr();
    res.status(200).json({
        message: 'HOLA funciono en get'
    })  
});
router.post('/', (req, res, next) =>{
    res.status(200).json({
        message: 'HOLA USO POST'
    })
});
router.get('/:productID', (req, res, next) =>{
    const id = req.params.productID;
    if (id === '1'){
        
        res.status(200).json({
            message: `Hola estoy en la direccion ${id}`
        })  
    }else if (id === '2'){
        
        res.status(200).json({
            message: `Hola estoy en la direccion ${id}`
        })  
    }
    else if (id === '3'){
       
        res.status(200).json({
            message: `Hola estoy en la direccion ${id}`
        })  
    }
    else if (id === '4'){
        
        res.status(200).json({
            message: `Hola estoy en la direccion ${id}`
        })  
    }
})
module.exports = router;