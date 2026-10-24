import sys,json
sys.path.insert(0,'.')
from stubs import MODS,seed
from playwright.sync_api import sync_playwright
open('/tmp/f1.pdf','wb').write(b'%PDF-1.4 test'); open('/tmp/f2.pdf','wb').write(b'%PDF-1.4 vep')
R={}
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1280,'height':900})
    def route(r):
        u=r.request.url
        for k,v in MODS.items():
            if u.endswith('/'+k): return r.fulfill(status=200,content_type='text/javascript',body=v)
        if 'gstatic.com' in u or 'fonts.g' in u: return r.abort()
        r.continue_()
    ctx.route('**/*',route)
    def abrir(rol,page):
        S,U=seed(rol)
        # solo la primera vez: sembrar; después se conserva la base compartida
        ctx.clear_cookies()
        pg=ctx.new_page()
        pg.add_init_script(f"window.__SEED__={json.dumps(S)};window.__USER__={json.dumps(U)};")
        pg.goto(f'http://localhost:8801/{page}'); pg.wait_for_timeout(1200); pg.set_default_timeout(5000); return pg
    # 1) CLIENTE sube
    pg=abrir('cliente','portal-cliente.html')
    R['cliente_ve_2_empresas']=pg.eval_on_selector_all('#selector-empresas-cliente option','e=>e.length')==2
    pg.select_option('#selector-empresas-cliente',index=1)  # Bodega
    pg.select_option('#cliente-categoria','Impuestos'); pg.set_input_files('#cliente-archivo','/tmp/f1.pdf')
    pg.click('#form-cliente-subir .btn-primary'); pg.wait_for_timeout(600)
    R['cliente_exito']=pg.is_visible('#mensaje-exito')
    R['en_db']=pg.evaluate("()=>{const d=window.__DB__.documents.find(x=>x.data.nombre_archivo==='f1.pdf');return d&&[d.data.cliente_id,d.data.estado]}")
    R['cliente_ve_entrega_previa']='VEP_septiembre' in pg.inner_text('#lista-entregas') or 'Alfa' in pg.inner_text('body')
    dbjson=pg.evaluate("JSON.stringify(window.__DB__)")
    pg.close()
    # 2) ESTUDIO ve el documento y envía otro
    S,U=seed('senior'); S=json.loads(dbjson)
    pg=ctx.new_page()
    pg.add_init_script(f"window.__SEED__={json.dumps(S)};window.__USER__={json.dumps(U)};")
    pg.goto('http://localhost:8801/index.html'); pg.wait_for_timeout(1200); pg.set_default_timeout(5000)
    pg.fill('#hub-q','bode'); pg.wait_for_timeout(300); pg.click('#hub-q-res [data-act=buzon]'); pg.wait_for_timeout(600)
    R['estudio_ve_doc_cliente']='f1.pdf' in pg.inner_text('#vista-buzon')
    pg.select_option('#entrega-categoria','VEP'); pg.set_input_files('#entrega-file','/tmp/f2.pdf')
    pg.click('#form-enviar-cliente button[type=submit]'); pg.wait_for_timeout(700)
    R['entrega_en_db']=pg.evaluate("()=>{const d=window.__DB__.entregas.find(x=>x.data.nombre_archivo==='f2.pdf');return d&&[d.data.cliente_id,d.data.categoria,d.data.enviado_por]}")
    dbjson=pg.evaluate("JSON.stringify(window.__DB__)"); pg.close()
    # 3) CLIENTE ve lo que envió el estudio
    S,U=seed('cliente'); S=json.loads(dbjson)
    pg=ctx.new_page()
    pg.add_init_script(f"window.__SEED__={json.dumps(S)};window.__USER__={json.dumps(U)};")
    pg.goto('http://localhost:8801/portal-cliente.html'); pg.wait_for_timeout(1200); pg.set_default_timeout(5000)
    pg.select_option('#selector-empresas-cliente',index=1); pg.wait_for_timeout(700)
    t=pg.inner_text('#lista-entregas'); R['cliente_ve_entrega']='f2.pdf' in t
    R['cliente_link_descarga']=pg.eval_on_selector_all('#lista-entregas a','e=>e.map(x=>x.href).length')>0
    pg.screenshot(path='/tmp/dt/portal.png',full_page=True)
    b.close()
for k,v in R.items(): print(k,v)
