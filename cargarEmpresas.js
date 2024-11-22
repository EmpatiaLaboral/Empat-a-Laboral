const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const empresas = require("./empresas.json");


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOGqbWfkbBeHcu-jjZYNggKNXq8QMRFBI",
  authDomain: "empatia-laboral-b6595.firebaseapp.com",
  projectId: "empatia-laboral-b6595",
  storageBucket: "empatia-laboral-b6595.appspot.com",
  messagingSenderId: "632150523448",
  appId: "1:632150523448:web:ac54fcffe193c3e00030cd",
  measurementId: "G-VGE7VZRXE9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar empresas
const cargarEmpresas = async () => {
  try {
    for (const empresa of empresas) {
      const id = `${empresa.lat}_${empresa.lng}`;
      const ref = doc(db, "empresas", id);
      await setDoc(ref, {
        nombre: empresa.nombre,
        direccion: empresa.direccion,
        lat: empresa.lat,
        lng: empresa.lng,
        sector: empresa.sector,
        creador: "Empatía Laboral"
      });
      console.log(`Empresa ${empresa.nombre} añadida con éxito.`);
    }
  } catch (error) {
    console.error("Error al cargar empresas: ", error);
  }
};

cargarEmpresas();
