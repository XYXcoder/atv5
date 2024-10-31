function login() {
    let _data = {
        username: username,
        password: password
    };

    fetch('https://dominio.com/auth', {
        method: "POST",
        body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(json => {
        const expirationDate = new Date(Date.now() + (60 * 60 * 1000)); // Exemplo de expiração de 1 hora
        localStorage.setItem("token", json.jwt_token);
        localStorage.setItem("tokenExpiration", expirationDate.toISOString());
    })
    .catch(err => console.log(err));
}

function doAction() {
    const token = localStorage.getItem("token");
    const expiration = new Date(localStorage.getItem("tokenExpiration"));

    if (Date.now() > expiration) {
        alert("Seu token expirou. Por favor, faça login novamente.");
        // Redirecionar para a página de login ou atualizar o token
        return;
    }

    fetch('https://dominio.com/do_SomeAction', {
        method: "POST",
        body: JSON.stringify(null),
        headers: {
            "Content-type": "application/json;",
            "Authorization": `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(`response: ${json}`);
    })
    .catch(err => console.log(err));
}
function doDBAction(id) {
    var query = "SELECT * FROM users WHERE userID='" + id + "'";
}
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database'
});

function doDBAction(id) {
    const query = "SELECT * FROM users WHERE userID = ?";
    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        console.log(results);
    });
}
