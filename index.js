const express = require ("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4200;
const hbs = require("hbs");
const mysql = require("mysql2");
const path = require("path");
const nodemailer =  require("nodemailer");
const { Console } = require("console");

////////////////////////////////////////////////
 //conectamos la app a una base de datos
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
//Configuracion de middelwares
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
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

//verbo http para recibir datos
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
        let query = conexion.query(sql, data, (err, results) =>{
            if(err) throw err;
            res.render("formularios", {titulo: "Ingresa tus datos para el formulario"},)
        });
    
    } 
    
}); 


//                              UPDATE
app.post("/update", (req, res)=>{
    console.log(req.body.nombre);
    console.log(req.body.precio);
    console.log(req.body.id);

    //res.send("Actualizamos los datos");
    // No olvidar el cambio del nombre de las variables
    let sql = "UPDATE PRODUCTOS SET nombre='" + req.body.nombre + "', precio='" + req.body.precio + "'WHERE idProducto=" + req.body.id;
    let query = conexion.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect("/");
    });
});

//                               DELETE
app.delete("/delete", (req, res)=>{
   /*  console.log(req.body.id); */

    //res.send("Eliminamos los datos"); 
    let sql = "DELETE FROM PRODUCTOS WHERE idProducto="+ req.body.idProducto2;
    let query = conexion.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect("/");
    });
}) 

//                     PRODUCTOS
app.get('/productos', (req, res) =>{
    let sql = "SELECT * FROM PRODUCTOS";
    let query = conexion.query(sql, (err, results)=>{
        if(err) throw err;
        res.render("productos", {titulo: "Lista de productos", results});
    });
}); 


//                          LOGIN
app.get("/login", (req, res)=>{
    res.render("login", {titulo: "Ingresa tus datos para el login"})
}); 
app.post("/login", (req, res) =>{
    const {usuario, email}= req.body;


/*     res.render("index", {
        titulo: "Pagina principal"
    }) */

    if(usuario=="" || email ==""){
        let validacion= "Faltan datos para ingresar"
    
        res.render("login", {
            titulo: "Ingresa tus datos para el login",
            validacion
        })
    }else{
        
        console.log(usuario);
        console.log(email);
        async function main(){
            let transporter = nodemailer.createTransport({
                host:"smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: 'garbarinidamian@gmail.com',
                    pass: 'xaytmvjcsidpctzs',
                }
            })
            let info = await transporter.sendMail({
                from: 'garbarinidamian@gmail.com',
                to: `${email}`,
                subject: 'Gracias por tu compra en nuestra App',
                html: `Gracias por confiar en nosotros para la compra de tus Productos. <br>
                En nuestra App siempre encontraras las mejores ofertas`
            })
            res.render("contacto", {
                titulo: "Recibimos tu mail",
                usuario,
                email
            })

        }
        main().catch(console.error);

    }   
})



app.get("/login", (req, res) =>{
    res.render("login", {titulo: "ingresa tus datos para el login"});
})

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
