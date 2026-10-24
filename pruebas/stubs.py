# Firebase simulado en memoria para probar DOMino Profesional sin red
FIRESTORE = r'''
const S = window.__DB__ = window.__DB__ || JSON.parse(localStorage.getItem('__DBX__')||'null') || window.__SEED__;
let _n=1000;
const save=()=>{try{localStorage.setItem('__DBX__',JSON.stringify(S))}catch(e){}};
export class Timestamp{constructor(ms){this.ms=ms} toDate(){return new Date(this.ms)} static fromDate(d){return new Timestamp(d.getTime())} valueOf(){return this.ms}}
export const serverTimestamp=()=>new Timestamp(Date.now());
export const collection=(db,name)=>({__c:name,__w:[],__o:null});
export const where=(f,op,v)=>({t:'w',f,op,v});
export const orderBy=(f,d='asc')=>({t:'o',f,d});
export const query=(c,...cs)=>({__c:c.__c,__w:cs.filter(x=>x.t==='w'),__o:cs.find(x=>x.t==='o')||null});
export const doc=(db,c,id)=>({__c:c,id});
const val=v=>v instanceof Timestamp?v.ms:(v&&v.__ts?v.__ts:(v&&v.toDate?v.toDate().getTime():v));
const match=(d,w)=>w.every(x=>{const a=val(d[x.f]),b=val(x.v);
 if(x.op==='==')return a===b; if(x.op==='>=')return a!==undefined&&a>=b; if(x.op==='<=')return a!==undefined&&a<=b;
 if(x.op==='>')return a!==undefined&&a>b; if(x.op==='<')return a!==undefined&&a<b; return true});
const run=q=>{let r=(S[q.__c]||[]).filter(d=>match(d.data,q.__w||[]));
 if(q.__o)r=[...r].sort((a,b)=>(val(a.data[q.__o.f])>val(b.data[q.__o.f])?1:-1)*(q.__o.d==='desc'?-1:1));
 return r.map(d=>({id:d.id,data:()=>JSON.parse(JSON.stringify(d.data),(k,v)=>v)}))};
const mk=docs=>({docs,empty:docs.length===0,size:docs.length,forEach:f=>docs.forEach(f)});
const fix=d=>{ // restaurar Timestamps guardados como {__ts}
 for(const k in d){ if(d[k]&&d[k].__ts)d[k]=new Timestamp(d[k].__ts) } return d};
export const getDocs=async q=>mk(run(q).map(x=>({id:x.id,data:()=>fix(x.data())})));
export const getDoc=async r=>{const d=(S[r.__c]||[]).find(x=>x.id===r.id);return{exists:()=>!!d,id:r.id,data:()=>d?fix(JSON.parse(JSON.stringify(d.data))):undefined}};
const ser=o=>JSON.parse(JSON.stringify(o,(k,v)=>v instanceof Timestamp?{__ts:v.ms}:v));
export const addDoc=async(c,data)=>{const id='n'+(_n++);(S[c.__c]=S[c.__c]||[]).push({id,data:ser(data)});save();notify(c.__c);return{id}};
export const updateDoc=async(r,data)=>{const d=S[r.__c].find(x=>x.id===r.id);Object.assign(d.data,ser(data));save();notify(r.__c)};
export const deleteDoc=async r=>{S[r.__c]=S[r.__c].filter(x=>x.id!==r.id);save();notify(r.__c)};
const subs=[];const notify=c=>subs.filter(s=>s.q.__c===c).forEach(s=>s.f(mk(run(s.q).map(x=>({id:x.id,data:()=>fix(x.data())})))));
export const onSnapshot=(q,f)=>{const s={q,f};subs.push(s);setTimeout(()=>f(mk(run(q).map(x=>({id:x.id,data:()=>fix(x.data())})))),0);return()=>{subs.splice(subs.indexOf(s),1)}};
export const getFirestore=()=>({});
'''
AUTH = r'''
const U=window.__USER__;
const auth={currentUser:U};
export const getAuth=()=>auth;
export const onAuthStateChanged=(a,cb)=>{setTimeout(()=>cb(U),0);return()=>{}};
export const signOut=async()=>{window.__SIGNED_OUT__=true};
export const signInWithEmailAndPassword=async()=>({user:U});
export const setPersistence=async()=>{};export const browserLocalPersistence={};
export const sendPasswordResetEmail=async()=>{};
'''
APP='export const initializeApp=()=>({});'
ANALYTICS='export const getAnalytics=()=>({});'
STORAGE='''export const getStorage=()=>({});export const ref=(s,p)=>({p});
export const uploadBytes=async()=>({});export const getDownloadURL=async r=>"https://example.test/"+encodeURIComponent(r.p);'''
MODS={'firebase-app.js':APP,'firebase-analytics.js':ANALYTICS,'firebase-auth.js':AUTH,'firebase-firestore.js':FIRESTORE,'firebase-storage.js':STORAGE}
import datetime as dt,json
def seed(rol='senior'):
    today=dt.date.today()
    d=lambda n:(today+dt.timedelta(days=n)).isoformat()
    ts=lambda n:{'__ts':int((dt.datetime.now()+dt.timedelta(days=n)).timestamp()*1000)}
    S={
     'users':[{'id':'u1','data':{'email':'daniel@estudio.test','rol_jerarquia':'senior','nombre_display':'Daniel'}},
              {'id':'u2','data':{'email':'asist@estudio.test','rol_jerarquia':'asistente','nombre_display':'Asistente 1'}},
              {'id':'u3','data':{'email':'mid@estudio.test','rol_jerarquia':'midsenior','nombre_display':'Laura'}}],
     'clients':[{'id':'c1','data':{'nombre_empresa':'Empresa Alfa S.A.','cuit':'30-12345678-9','estado':'activo','usuario_id':'cli@alfa.test'}},
                {'id':'c2','data':{'nombre_empresa':'Bodega Los Andes SRL','cuit':'30-98765432-1','estado':'activo','usuario_id':'cli@alfa.test'}},
                {'id':'c3','data':{'nombre_empresa':'Transporte Cuyo','cuit':'30-55555555-5','estado':'inactivo','usuario_id':'otro@x.test'}}],
     'tasks':[{'id':'t1','data':{'cliente_id':'c1','titulo':'Liquidación IVA','vencimiento':d(1),'responsable':'Impuestos','estado':'Pendiente de Procesar'}},
              {'id':'t2','data':{'cliente_id':'c1','titulo':'Balance trimestral','vencimiento':d(10),'responsable':'Asistente 1','estado':'En Proceso'}},
              {'id':'t3','data':{'cliente_id':'c2','titulo':'Sueldos octubre','vencimiento':d(3),'responsable':'Asistente 1','estado':'En Revisión'}},
              {'id':'t4','data':{'cliente_id':'c2','titulo':'Alta de empleado','vencimiento':d(-2),'responsable':'Sueldos','estado':'Proceso Completo/Finalizado'}},
              {'id':'t5','data':{'cliente_id':'c1','titulo':'Ganancias anticipo','vencimiento':d(0),'responsable':'Contador','estado':'Solicitar Información'}}],
     'documents':[{'id':'d1','data':{'cliente_id':'c1','categoria':'Impuestos','nombre_archivo':'factura_octubre.pdf','fecha_subida':today.strftime('%d/%m/%Y'),'estado':'Pendiente de Procesar','url_descarga':'https://example.test/f1?x=1'}},
                  {'id':'d2','data':{'cliente_id':'c1','categoria':'RRHH','nombre_archivo':'alta_empleado.pdf','fecha_subida':today.strftime('%d/%m/%Y'),'estado':'Pendiente de Procesar','tarea_id':'t3','url_descarga':'https://example.test/f2?x=1'}},
                  {'id':'d3','data':{'cliente_id':'c2','categoria':'Legal','nombre_archivo':'contrato_social.pdf','fecha_subida':'01/10/2026','estado':'En Revisión'}}],
     'entregas':[{'id':'e1','data':{'cliente_id':'c1','categoria':'VEP','nombre_archivo':'VEP_septiembre.pdf','fecha_envio':'10/10/2026','url_descarga':'https://example.test/v','enviado_por':'Contador','fecha_timestamp':ts(-5)}}],
     'mensajes':[{'id':'m1','data':{'texto':'Buen día equipo, recuerden el vencimiento de IVA.','autor_uid':'otro','nombre_display':'Laura','rol':'midsenior','fecha_timestamp':ts(-1)}}],
    }
    users={'cliente':('u9','cli@alfa.test','Cliente Alfa'),'senior':('u1','daniel@estudio.test','Daniel'),'asistente':('u2','asist@estudio.test','Asistente 1'),'midsenior':('u3','mid@estudio.test','Laura')}
    uid,email,name=users[rol]
    return S,{'uid':uid,'email':email,'displayName':name}
