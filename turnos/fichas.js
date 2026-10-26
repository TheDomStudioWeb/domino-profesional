// Vínculo con las fichas de DOMino Profesional (Firestore). Usa la sesión del Hub: mismo sitio, misma sesión.
// Si no hay sesión (o Firebase no carga), el panel de turnos sigue funcionando sin esta parte.
const CFG = { apiKey: "AIzaSyBfI_BBvq61f43ZaFYtZOYvcFZB39jsNt0", authDomain: "domino-profesional.firebaseapp.com", projectId: "domino-profesional", storageBucket: "domino-profesional.firebasestorage.app", messagingSenderId: "124987260145", appId: "1:124987260145:web:757f6e0d6093c16aacfd50" };
const V = '10.8.0', base = `https://www.gstatic.com/firebasejs/${V}/`;
let F = null, estado = null;

export async function conectar() {
  if (estado) return estado;
  estado = (async () => {
    try {
      const [app, auth, fs] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
      const a = app.initializeApp(CFG), au = auth.getAuth(a);
      const user = await new Promise(res => { const off = auth.onAuthStateChanged(au, u => { off(); res(u); }); setTimeout(() => res(null), 6000); });
      if (!user) return { ok: false, motivo: 'sin_sesion' };
      F = { fs, db: fs.getFirestore(a), email: String(user.email || '').toLowerCase() };
      return { ok: true, email: F.email };
    } catch (e) { console.warn('Fichas: no disponible', e); return { ok: false, motivo: 'sin_firebase' }; }
  })();
  return estado;
}
const dig = s => String(s || '').replace(/\D/g, '');
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

// Fichas activas que se parecen al turno: mismo teléfono o nombre parecido.
export async function sugeridas(nombre, tel) {
  const { fs, db } = F, snap = await fs.getDocs(fs.query(fs.collection(db, 'clients'), fs.where('estado', '==', 'activo')));
  const t = dig(tel).slice(-8), n = norm(nombre), out = [];
  snap.forEach(d => {
    const c = d.data(), nc = norm(c.nombre_empresa), tc = dig(c.telefono).slice(-8);
    const mismoTel = t.length >= 7 && tc === t, parecido = n.length > 2 && nc && (nc.includes(n) || n.includes(nc) || n.split(' ').filter(x => x.length > 2).every(x => nc.includes(x)));
    if (mismoTel || parecido) out.push({ id: d.id, nombre: c.nombre_empresa, telefono: c.telefono || '', mascotas: (c.mascotas || []).map(m => m.nombre).join(', '), exacto: mismoTel });
  });
  return out.sort((a, b) => (b.exacto - a.exacto) || a.nombre.localeCompare(b.nombre)).slice(0, 6);
}
export async function nombreDe(id) {
  try { const { fs, db } = F; const s = await fs.getDoc(fs.doc(db, 'clients', id)); return s.exists() ? (s.data().nombre_empresa || '') : ''; } catch (e) { return ''; }
}
export async function crearFicha({ nombre, tel, email, sujeto_nombre, sujeto_tipo }) {
  const { fs, db } = F;
  const datos = { nombre_empresa: String(nombre).trim(), cuit: '', estado: 'activo', fecha_creacion: new Date().toISOString(), usuario_id: '', telefono: String(tel || '').trim(), email_contacto: String(email || '').trim().toLowerCase(), origen: 'turnos', mascotas: sujeto_nombre ? [{ nombre: sujeto_nombre, tipo: sujeto_tipo || 'Perro' }] : [] };
  const r = await fs.addDoc(fs.collection(db, 'clients'), datos); return { id: r.id, nombre: datos.nombre_empresa };
}
export async function sumarMascota(id, sujeto_nombre, sujeto_tipo) {
  if (!sujeto_nombre) return;
  const { fs, db } = F, ref = fs.doc(db, 'clients', id), s = await fs.getDoc(ref); if (!s.exists()) return;
  const ya = (s.data().mascotas || []).some(m => norm(m.nombre) === norm(sujeto_nombre));
  if (!ya) await fs.updateDoc(ref, { mascotas: fs.arrayUnion({ nombre: sujeto_nombre, tipo: sujeto_tipo || 'Perro' }) });
}
