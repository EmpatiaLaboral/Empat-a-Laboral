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

// SEO Helper Script - Mejora de Metadatos para Base de Datos
db.serialize(() => {
    // Meta descripción dinámica basada en el contenido de la base de datos
    db.get("SELECT COUNT(*) AS totalCompanies FROM companies", (err, row) => {
        if (!err && row) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                const newMetaDescription = document.createElement("meta");
                newMetaDescription.name = "description";
                newMetaDescription.content = `Explora ${row.totalCompanies} empresas en Empatía Laboral. Consulta reseñas y calificaciones de compañías destacadas por su trato justo y equidad laboral.`;
                document.head.appendChild(newMetaDescription);
            }
        }
    });

    // Palabras clave basadas en los nombres de las empresas
    db.all("SELECT name FROM companies", (err, rows) => {
        if (!err && rows) {
            const keywords = rows.map(row => row.name).join(", ");
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                const newMetaKeywords = document.createElement("meta");
                newMetaKeywords.name = "keywords";
                newMetaKeywords.content = `empresas, reseñas, calificaciones, ${keywords}`;
                document.head.appendChild(newMetaKeywords);
            }
        }
    });
});

// Título dinámico para la página según la actividad
document.addEventListener("DOMContentLoaded", function () {
    const originalTitle = document.title;

    db.get("SELECT COUNT(*) AS totalReviews FROM reviews", (err, row) => {
        if (!err && row) {
            document.title = `Reseñas Disponibles: ${row.totalReviews} | Empatía Laboral`;
        } else {
            document.title = originalTitle;
        }
    });
});
