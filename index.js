const express = require ("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4200;
const hbs = require("hbs");
const mysql = require("mysql2");
const path = require("path");
const nodemailer =  require("nodemailer");

////////////////////////////////////////////////
/* //conectamos la app a una base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDTB,
    database: process.env.DATABASE
});

//Conectamos la DATABASE
const conectar = (
        conexion.connect((error)=>{
        if(error) throw error;
        console.log("Base de datos conectada");

    })
);
 */

//Configuracion de middelwares
app.use(express.json());
//app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: false}));

//Configuramos la vista de la app
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, 'views/partials'));         

/* 
app.get("/", (req, res)=>{
    res.send("Nos estamos conectando a una Base de datos")
}); */
app.get("/", (req, res)=>{
    res.render("index.hbs", {titulo: "Pagina principal"})
});  


//                            FORMULARIO



app.get("/formularios", (req, res)=>{
    res.render("formularios", {titulo: "Formulario para completar"})
}); 


// verbo http para recibir datos
app.post("/formularios", (req, res)=>{
   // console.log(req.body);
    //Desestructuracion
/*     console.log(req.body.nombre);
    console.log(req.body.precio);
    console.log(req.body.descripcion);
 */
const {nombre, precio, descripcion} = req.body;

//validacion basica
    if(nombre=="" || precio ==""){
        let validacion= "Faltan datos para ingresar el producto"
        res.render("formularios", {
            titulo: "Formulario para completar",
            validacion
        })
    }else{
        console.log(nombre);
        console.log(precio);
        console.log(descripcion);

    //conectar();

    let data = {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion
    }
    let sql = "INSERT INTO PRODUCTOS SET ?" 
    /*     let query = conexion.query(sql, data, (err, results) =>{
            if(err) throw err;
            res.render("formularios", {titulo: "Ingresa tus datos para el formulario"})
        });*/
    
    } 
    
})  ; 

//                          LOGIN

app.get("/login", (req, res)=>{
    res.render("login", {titulo: "Ingresa tus datos para el login"})
}); 


app.post("/login", (req, res) =>{
    console.log(req.body);

    const {usuario, password}= req.body;
    console.log(usuario);
    console.log(password);
    res.send("Tus datos son correctos");
})

app.get("/login", (req, res) =>{
    res.render("login", {titulo: "ingresa tus datos para el login"});
})





//                     PRODUCTOS

app.get('/productos', (req, res) =>{
    let sql = "SELECT * FROM PRODUCTOS";
/*   let query = conexion.query(sql, (err, results)=>{
        if(err) throw err;
        res.render("productos", {titulo: "Lista de productos", results});
    }); */
}); 





//                            CONTACTO
app.get("/contacto", (req, res)=>{
    res.render("contacto", {titulo: "Escribenos"})
}); 




app.listen(port, ()=>{
    console.log(`servidor corriendo en el puerto ${port}`);
})
app.on("error", (error) =>{
    console.log(`Tenemos un error ${error}`);
});
