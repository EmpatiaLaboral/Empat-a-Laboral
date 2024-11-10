const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Crear tablas
db.serialize(() => {
    db.run("CREATE TABLE companies (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE reviews (id INTEGER PRIMARY KEY, companyId INTEGER, rating INTEGER)");
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

    // Insertar datos de ejemplo
    db.run("INSERT INTO companies (name) VALUES ('Empresa A')");
    db.run("INSERT INTO companies (name) VALUES ('Empresa B')");
    db.run("INSERT INTO companies (name) VALUES ('Empresa C')");

    db.run("INSERT INTO reviews (companyId, rating) VALUES (1, 5)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (1, 4)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (1, 3)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (1, 5)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (1, 4)");

    db.run("INSERT INTO reviews (companyId, rating) VALUES (2, 3)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (2, 3)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (2, 4)");

    db.run("INSERT INTO reviews (companyId, rating) VALUES (3, 5)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (3, 5)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (3, 5)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (3, 4)");
    db.run("INSERT INTO reviews (companyId, rating) VALUES (3, 5)");

    // Verificar datos insertados
    db.each("SELECT * FROM users", (err, row) => {
        console.log(row);
    });
});

module.exports = db;