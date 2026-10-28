# Asistente de primer ingreso: nombre, logo, profesión y equipo; la profesión ajusta palabras y listas.
import sys, json, os, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stubs import MODS, seed
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); PORT = 8803
R = {}
def ok(n, c): R[n] = bool(c)
def sesion(rol, extra_seed, steps, w=1280, h=900):
    S, U = seed(rol)
    for k, v in (extra_seed or {}).items(): S[k] = v
    log = []
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={'width': w, 'height': h})
        ctx.add_init_script("if(!sessionStorage.getItem('__ini')){sessionStorage.setItem('__ini','1');try{localStorage.removeItem('__DBX__');localStorage.removeItem('domino_rubro')}catch(e){}}"
                            f"window.__SEED__={json.dumps(S)};window.__USER__={json.dumps(U)};")
        def route(r):
            u = r.request.url
            for k, v in MODS.items():
                if u.endswith('/' + k): return r.fulfill(status=200, content_type='text/javascript', body=v)
            if 'firestore.googleapis.com' in u: return r.fulfill(status=404, body='{}')
            if 'gstatic.com' in u or 'fonts.g' in u: return r.abort()
            r.continue_()
        ctx.route('**/*', route)
        pg = ctx.new_page(); pg.set_default_timeout(6000)
        pg.on('pageerror', lambda e: log.append('[PAGEERROR] ' + str(e)))
        pg.goto(f'http://localhost:{PORT}/index.html'); pg.wait_for_timeout(1500)
        steps(pg); b.close()
    return log
def t1(pg):
    ok('asistente_aparece', pg.is_visible('#es-fondo'))
    ok('perfiles_5', pg.eval_on_selector_all('input[name=es-rubro]', 'e=>e.length') == 5)
    pg.click('#es-ok'); ok('pide_nombre', 'nombre del estudio' in pg.inner_text('#es-err'))
    pg.fill('#es-nombre', 'Consultorio Aurora')
    pg.check('input[name=es-rubro][value=psicologo]')
    pg.click('button[data-k=midsenior][data-d="1"]'); pg.click('button[data-k=asistente][data-d="1"]'); pg.click('button[data-k=asistente][data-d="1"]')
    pg.click('#es-ok'); pg.wait_for_timeout(2500)   # guarda y recarga
    ok('no_reabre', not pg.is_visible('#es-fondo'))
    ok('rubro_aplicado', pg.evaluate('window.DOMINO_RUBRO') == 'psicologo')
    pg.click('#nav-hub') if pg.is_visible('#nav-hub') else None
    pg.wait_for_timeout(500)
    panel = pg.inner_text('#hub-estudio')
    ok('panel_nombre_y_profesion', 'Consultorio Aurora' in panel and 'Psicología' in panel)
    ok('panel_equipo', '1 Senior' in panel and '1 Mid Senior' in panel and '2 Asistente' in panel)
    ok('guarda_publico', pg.evaluate("(window.__DB__.config||[]).some(x=>x.id==='publico'&&x.data.rubro==='psicologo')"))
    ok('guarda_equipo', pg.evaluate("(window.__DB__.config||[]).find(x=>x.id==='negocio').data.equipo.asistente") == 2)
    ok('palabra_pacientes', 'Pacientes' in pg.inner_text('#nav-expedientes'))
    ok('areas_propias', 'Admisión' in pg.eval_on_selector_all('#task-responsable option', 'e=>e.map(o=>o.value).join("|")'))
    ok('cuit_pasa_a_dni', 'DNI' in pg.inner_text('#lbl-client-cuit'))
    ok('sin_validador_cuit', 'Validador de CUIT' not in pg.inner_text('body'))
    pg.screenshot(path='/tmp/t_estudio_psico.png')
    pg.click('#es-abrir'); pg.wait_for_timeout(300)
    ok('editar_muestra_actual', pg.input_value('#es-nombre') == 'Consultorio Aurora' and pg.is_checked('input[name=es-rubro][value=psicologo]'))
    pg.check('input[name=es-rubro][value=abogado]'); pg.click('#es-ok'); pg.wait_for_timeout(2500)
    ok('cambia_a_abogado', pg.evaluate('window.DOMINO_RUBRO') == 'abogado' and 'Audiencias y plazos' in pg.eval_on_selector_all('#task-responsable option', 'e=>e.map(o=>o.value).join("|")'))
    ok('abogado_vuelve_clientes', 'Clientes' in pg.inner_text('#nav-expedientes'))
def t2(pg):
    # Otro navegador: la profesión viene de la base. Se ajusta sola, una sola vez.
    ok('b_rubro_escribano', pg.evaluate('window.DOMINO_RUBRO') == 'escribano')
    ok('b_areas', 'Escrituras' in pg.eval_on_selector_all('#task-responsable option', 'e=>e.map(o=>o.value).join("|")'))
    ok('b_no_wizard', not pg.is_visible('#es-fondo'))
def t3(pg):
    # Asistente: ve el panel pero no puede editar; no se le ofrece el asistente.
    ok('c_sin_wizard', not pg.is_visible('#es-fondo'))
    ok('c_sin_boton', pg.locator('#es-abrir').count() == 0)
if __name__ == '__main__':
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        L = sesion('senior', {}, t1)
        neg = {'config': [{'id': 'negocio', 'data': {'nombre': 'Notaría Sur', 'rubro': 'escribano', 'equipo': {'senior': 1, 'midsenior': 0, 'asistente': 1}, 'logo': ''}}]}
        L += sesion('senior', neg, t2)
        L += sesion('asistente', neg, t3)
    finally: srv.terminate()
    for k, v in R.items(): print(('OK   ' if v else 'FAIL ') + k)
    print([l for l in L if 'PAGEERROR' in l])
