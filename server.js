//configurando o servidor
const express = require("express");
const server = express();

//configurar o server para arquivos estáticos
server.use(express.static('public'));

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }));

//configurando a conexão com o db
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});


//configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true
});


//configura a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("ERRO NO BANCO DE DADOS");

        const donors = result.rows;
        return res.render("index.html", { donors });
    });

});

//pegar dados do formulário
server.post("/", function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    //certifica que todos as informações foram inseridas
    if (name == "" || email == "" || blood == ""){
        return res.send("TODOS OS CAMPOS SÃO OBRIGATÓRIOS");
    }
    
    //adiciona valores no db
    const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3) 
    `
    const values =  [name, email, blood];

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("ERRO NO BANCO DE DADOS!");

        //fluxo ideal
        return res.redirect("/");
    });

});


// ligar o servidor e permitir o acesso ana porta 3000
server.listen(3000, function() {
    console.log("iniciando o servidor...");
});    
