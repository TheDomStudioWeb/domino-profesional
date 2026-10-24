from run import session
R={}
def ok(n,c): R[n]=bool(c)
def steps(pg,out):
    pg.set_default_timeout(5000)
    pg.click('#nav-hub'); pg.click('.tile:has-text("Quiénes tienen acceso")'); pg.wait_for_timeout(500)
    ok('3_personas', pg.eval_on_selector_all('#lista-equipo .eq-fila','e=>e.length')==3)
    ok('mi_nivel_bloqueado', pg.is_disabled('.eq-fila:has-text("Daniel") select'))
    pg.fill('#persona-nombre','Marta Gómez'); pg.fill('#persona-email','Marta@Estudio.test'); pg.select_option('#persona-nivel','midsenior'); pg.click('#form-alta-persona button[type=submit]'); pg.wait_for_timeout(700)
    ok('agrega_4', pg.eval_on_selector_all('#lista-equipo .eq-fila','e=>e.length')==4)
    u=pg.evaluate("window.__DB__.users.find(x=>x.data.email==='marta@estudio.test')"); ok('guardada_minuscula', u and u['data']['rol_jerarquia']=='midsenior' and u['data']['activo'] is True)
    ok('crea_cuenta_y_mail', pg.evaluate("window.__CREADOS__")==['marta@estudio.test'] and pg.evaluate("window.__MAILS__")==['marta@estudio.test'])
    ok('aviso', 'Marta' in pg.inner_text('#toast-dom'))
    pg.fill('#persona-nombre','Otra'); pg.fill('#persona-email','marta@estudio.test'); pg.click('#form-alta-persona button[type=submit]'); pg.wait_for_timeout(300); ok('rechaza_duplicado','ya está cargado' in pg.inner_text('#toast-dom'))
    pg.select_option('.eq-fila:has-text("Marta") select','asistente'); pg.wait_for_timeout(300)
    ok('cambia_nivel', pg.evaluate("window.__DB__.users.find(x=>x.data.email==='marta@estudio.test').data.rol_jerarquia")=='asistente')
    pg.click('.eq-fila:has-text("Marta") [data-eq=baja]'); pg.wait_for_timeout(500)
    ok('baja', pg.evaluate("window.__DB__.users.find(x=>x.data.email==='marta@estudio.test').data.activo")==False and pg.is_visible('.eq-fila:has-text("Marta") .eq-tag'))
    pg.click('.eq-fila:has-text("Asistente 1") [data-eq=acceso]'); pg.wait_for_timeout(500)
    ok('reenvia_a_existente', pg.evaluate("window.__MAILS__")[-1]=='asist@estudio.test' and 'ya tenía acceso' in pg.inner_text('#toast-dom'))
    pg.screenshot(path=out+'/t_equipo.png',full_page=True)
    # clientes: enviar acceso
    pg.click('#nav-expedientes'); pg.click('#btn-admin-cartera'); pg.wait_for_timeout(500)
    pg.click('#client-list .client-card >> nth=0 >> [data-act=acceso]'); pg.wait_for_timeout(500); ok('cliente_acceso','cli@alfa.test' in pg.inner_text('#toast-dom'))
if __name__=='__main__':
    log=session('.',8801,steps=steps)
    for k,v in R.items(): print(('OK   ' if v is True else 'FAIL ' if v is False else '     ')+k)
    print([l for l in log if 'PAGEERROR' in l])
