import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Tu misma configuración de Firebase (Ambas apps apuntan al mismo motor)
const firebaseConfig = {
  apiKey: "AIzaSyBfI_BBvq61f43ZaFYtZOYvcFZB39jsNt0",
  authDomain: "domino-profesional.firebaseapp.com",
  projectId: "domino-profesional",
  storageBucket: "domino-profesional.firebasestorage.app",
  messagingSenderId: "124987260145",
  appId: "1:124987260145:web:757f6e0d6093c16aacfd50"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

window.cerrarSesionCliente = async function() {
    if (confirm("¿Estás seguro que querés cerrar sesión?")) {
        await signOut(auth);
        window.location.href = 'login-cliente.html';
    }
}

async function cargarEmpresasCliente(usuarioId) {
    const selector = document.getElementById('selector-empresas-cliente');
       
    try {
        const q = query(
            collection(db, "clients"),
            where("usuario_id", "==", usuarioId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            selector.style.display = 'none';
            return;
        }

        if (querySnapshot.size === 1) {
            selector.style.display = 'none';
        } else {
            selector.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const empresa = doc.data();
                selector.innerHTML += `<option value="${doc.id}">${empresa.nombre_empresa}</option>`;
            });
            selector.style.display = 'block';
         selector.addEventListener('change', () => {
    cargarEntregas('recientes');
});
    selector.addEventListener('change', () => {
    ID_CLIENTE_PRUEBA = selector.value;
    cargarEntregas('recientes');
});
        }

    } catch (error) {
        console.error("Error al cargar empresas:", error);
    }
}

onAuthStateChanged(auth, async (usuario) => {
    if (!usuario) {
        window.location.href = 'login-cliente.html';
        return;
    }
    const usuarioId = usuario.email;
    await cargarEmpresasCliente(usuarioId);
    cargarEntregas('recientes');
});

const formCliente = document.getElementById('form-cliente-subir');
const mensajeExito = document.getElementById('mensaje-exito');

// Simulamos que el cliente ya entró con su Magic Link (Hardcodeamos el ID de la Empresa Alfa para la prueba)
// En producción, este ID vendrá en la URL (ej: portal-cliente.html?id=ID_EMPRESA_ALFA)
let ID_CLIENTE_PRUEBA = "Hmv0osbnN35e2QXB9Jdw"; 

formCliente.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoria = document.getElementById('cliente-categoria').value;
    const archivoInput = document.getElementById('cliente-archivo');
    const archivos = archivoInput.files;
    const fechaHoy = new Date().toLocaleDateString('es-ES');

    try {
        const btnSubmit = formCliente.querySelector('.btn-primary');
        btnSubmit.innerText = "Subiendo...";
        btnSubmit.disabled = true;

        for (const archivo of archivos) {
            const nombreArchivo = archivo.name;
            const storageRef = ref(storage, `documentos/${ID_CLIENTE_PRUEBA}/${fechaHoy}/${nombreArchivo}`);
            await uploadBytes(storageRef, archivo);
            const downloadURL = await getDownloadURL(storageRef);
            await addDoc(collection(db, "documents"), {
                cliente_id: ID_CLIENTE_PRUEBA,
                categoria: categoria,
                nombre_archivo: nombreArchivo,
                fecha_subida: fechaHoy,
                estado: "Pendiente de Procesar",
                url_descarga: downloadURL
            });
        }

        formCliente.reset();
        formCliente.style.display = 'none';
        mensajeExito.style.display = 'block';
        btnSubmit.innerText = "Subir y Notificar al Estudio";
        btnSubmit.disabled = false;

    setTimeout(() => {
    mensajeExito.style.display = 'none';
    formCliente.style.display = 'block';
}, 3000);

    } catch (error) {
        alert("Hubo un error al enviar el documento.");
        console.error(error);
    }
});

// Función para cambiar de empresa activa
function cambiarEmpresaActiva(idEmpresa) {
    localStorage.setItem('empresa_activa', idEmpresa);
    // Disparamos un evento para que las otras partes de la app se refresquen
    window.dispatchEvent(new Event('empresaCambiada'));
    
    // Si estamos en el dashboard, recargamos la lista
    if(typeof cargarClientes === 'function') cargarClientes();
}

// Escuchamos el cambio en toda la aplicación
window.addEventListener('empresaCambiada', () => {
    const id = localStorage.getItem('empresa_activa');
    console.log("Nueva empresa seleccionada:", id);
    // Aquí iría el filtro lógico que usaremos en el futuro
});
async function cargarEntregas(filtro = 'recientes', orden = 'reciente') {
    const listaEntregas = document.getElementById('lista-entregas');
    listaEntregas.innerHTML = "<p style='color: var(--text-muted);'>Cargando...</p>";
    
    try {
        const ahora = new Date();
        const hace30dias = new Date();
        hace30dias.setDate(ahora.getDate() - 30);
        const limite = Timestamp.fromDate(hace30dias);

        let q;
        if (filtro === 'recientes') {
            q = query(
                collection(db, "entregas"),
                where("cliente_id", "==", ID_CLIENTE_PRUEBA),
                where("fecha_timestamp", ">=", limite)
            );
        } else {
            q = query(
                collection(db, "entregas"),
                where("cliente_id", "==", ID_CLIENTE_PRUEBA),
                where("fecha_timestamp", "<", limite)
            );
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listaEntregas.innerHTML = "<p style='color: var(--text-muted);'>No hay documentos en esta sección.</p>";
            return;
        }

        listaEntregas.innerHTML = '';
        let entregas = [];
querySnapshot.forEach((doc) => {
    entregas.push({ id: doc.id, ...doc.data() });
});

entregas.sort((a, b) => {
    const fechaA = a.fecha_timestamp?.toDate() || new Date(0);
    const fechaB = b.fecha_timestamp?.toDate() || new Date(0);
    return orden === 'antiguo' ? fechaA - fechaB : fechaB - fechaA;
});

entregas.forEach((entrega) => {
    listaEntregas.innerHTML += `
        <div class="doc-item" style="margin-bottom: 10px;">
            <div>
                <h4>${entrega.nombre_archivo}</h4>
                <p style="color: var(--text-muted); font-size: 0.85rem;">
                    ${entrega.categoria} | ${entrega.fecha_envio}
                </p>
            </div>
            <a href="${entrega.url_descarga}" target="_blank" class="btn-activar">
                Descargar
            </a>
        </div>
    `;
});
    } 
    catch (error) {
        console.error("Error al cargar entregas:", error);
        listaEntregas.innerHTML = "<p style='color: var(--rojo-alerta);'>Error al cargar documentos.</p>";
    }
}

window.filtrarEntregas = function(filtro) {
    document.getElementById('btn-recientes').className = filtro === 'recientes' ? 'btn-primary' : 'btn-secundario';
    document.getElementById('btn-historicos').className = filtro === 'historicos' ? 'btn-primary' : 'btn-secundario';
    cargarEntregas(filtro);
}

window.filtrarEntregasFecha = function(orden) {
    document.getElementById('pill-reciente').className = orden === 'reciente' ? 'btn-primary' : 'btn-secundario';
    document.getElementById('pill-antiguo').className = orden === 'antiguo' ? 'btn-primary' : 'btn-secundario';
    cargarEntregas('recientes', orden);
}

setInterval(() => {
    cargarEntregas('recientes');
}, 15 * 60 * 1000);