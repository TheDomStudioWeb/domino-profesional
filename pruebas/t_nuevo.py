from run import session
R={}
def ok(n,c): R[n]=bool(c)
def steps(pg,out):
    pg.set_default_timeout(5000)
    cards=pg.eval_on_selector_all('.res-card','e=>e.map(x=>x.innerText.replace(/\\n/g," "))'); R['cards']=cards
    pg.click('.res-card:has-text("Vencidas")'); pg.wait_for_timeout(600)
    ok('vencidas_a_tareas', pg.is_visible('#vista-kanban') and pg.is_visible('#filtro-banner-kanban'))
    ok('solo_vencidas', pg.eval_on_selector_all('#vista-kanban .kanban-card','e=>e.length')==1 and 'Retenciones' in pg.inner_text('#tablero-kanban'))
    pg.click('#filtro-banner-kanban button'); pg.wait_for_timeout(500); ok('ver_todas', pg.eval_on_selector_all('#vista-kanban .kanban-card','e=>e.length')>=5)
    ok('kanban_tiene_volver', pg.is_visible('#vista-kanban >> text=← Inicio')); pg.click('#vista-kanban >> text=← Inicio'); pg.wait_for_timeout(300); ok('vuelve_inicio', pg.is_visible('#vista-hub'))
    pg.click('.res-card:has-text("En proceso")'); pg.wait_for_timeout(400); ok('proceso_sin_filtro', pg.is_hidden('#filtro-banner-kanban') and pg.is_visible('#vista-kanban >> text=← Inicio'))
    pg.click('#vista-kanban >> text=← Inicio')
    pg.click('.res-card:has-text("Balances")'); pg.wait_for_timeout(400); pg.click('#vista-kanban >> text=← Inicio'); pg.wait_for_timeout(300)
    # modal desbordado
    pg.set_viewport_size({'width':390,'height':700})
    pg.click('.res-card:has-text("Documentos")'); pg.wait_for_timeout(1200)
    r=pg.evaluate("()=>{const c=document.querySelector('#modal-docs-pendientes .modal-content').getBoundingClientRect();const x=document.getElementById('close-modal-docs').getBoundingClientRect();return [c.top,c.bottom,innerHeight,x.top,x.bottom]}")
    ok('modal_cabe_en_pantalla', r[0]>=0 and r[1]<=r[2]+1); ok('x_visible', 0<=r[3] and r[4]<=r[2])
    pg.evaluate("document.querySelector('#modal-docs-pendientes .modal-content').scrollTo(0,99999)"); pg.wait_for_timeout(200)
    x=pg.evaluate("()=>{const b=document.getElementById('close-modal-docs').getBoundingClientRect();return [b.top,b.bottom,innerHeight]}"); ok('x_sigue_visible_al_bajar', x[0]>=-1 and x[1]<=x[2])
    pg.screenshot(path=out+'/t_modal_movil.png')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200); ok('esc_cierra', pg.is_hidden('#modal-docs-pendientes'))
    pg.click('.res-card:has-text("Documentos")'); pg.wait_for_timeout(900); pg.mouse.click(3,3); pg.wait_for_timeout(200); ok('clic_afuera_cierra', pg.is_hidden('#modal-docs-pendientes'))
    # atajos y scroll recordado
    pg.set_viewport_size({'width':1280,'height':800})
    ok('atajos_4', pg.eval_on_selector_all('.atajo','e=>e.length')==4)
    pg.click('.atajo:has-text("Herramientas")'); pg.wait_for_timeout(900); y=pg.evaluate('scrollY'); ok('atajo_baja', y>300)
    pg.click('.tile:has-text("Calendario")') if pg.is_visible('.tile:has-text("Calendario")') else pg.click('#nav-calendario'); pg.wait_for_timeout(400)
    pg.click('#nav-hub'); pg.wait_for_timeout(900); y2=pg.evaluate('scrollY'); ok('recuerda_posicion', abs(y2-y)<5); R['y']=(y,y2)
    pg.screenshot(path=out+'/t_atajos.png')
if __name__=='__main__':
    log=session('.',8801,steps=steps,w=1280,h=800)
    for k,v in R.items(): print(('OK   ' if v is True else 'FAIL ' if v is False else '     ')+k, '' if isinstance(v,bool) else v)
    print([l for l in log if 'PAGEERROR' in l])
