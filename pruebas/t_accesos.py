from run import session
R={}
def ok(n,c): R[n]=bool(c)
def staff(pg,out):
    pg.set_default_timeout(5000)
    pg.click('#nav-expedientes'); pg.click('#btn-admin-cartera'); pg.wait_for_timeout(500)
    pg.click('#client-list .client-card:has-text("Empresa Alfa") [data-act=accesos]'); pg.wait_for_timeout(600)
    ok('abre_modal', pg.is_visible('#modal-accesos') and 'Empresa Alfa' in pg.inner_text('#titulo-accesos'))
    ok('muestra_titular', 'cli@alfa.test' in pg.inner_text('#lista-accesos') and 'Titular' in pg.inner_text('#lista-accesos'))
    ok('muestra_empleado', 'Empleado Uno' in pg.inner_text('#lista-accesos'))
    pg.fill('#acc-nombre','Pedro Ruiz'); pg.fill('#acc-email','Pedro@Alfa.test'); pg.click('#form-acceso button[type=submit]'); pg.wait_for_timeout(800)
    a=pg.evaluate("window.__DB__.accesos_portal.find(x=>x.id==='pedro@alfa.test__c1')")
    ok('guarda_id_correo_empresa', a and a['data']['cliente_id']=='c1' and a['data']['puede_subir'] is True and a['data']['puede_descargar'] is False and a['data']['activo'] is True)
    ok('crea_cuenta_y_mail', 'pedro@alfa.test' in pg.evaluate("window.__MAILS__||[]"))
    ok('aparece_en_lista', 'Pedro Ruiz' in pg.inner_text('#lista-accesos'))
    pg.fill('#acc-nombre','Otra vez'); pg.fill('#acc-email','pedro@alfa.test'); pg.click('#form-acceso button[type=submit]'); pg.wait_for_timeout(400)
    ok('rechaza_duplicado','ya figura' in pg.inner_text('#toast-dom'))
    pg.fill('#acc-nombre','Dueño'); pg.fill('#acc-email','cli@alfa.test'); pg.click('#form-acceso button[type=submit]'); pg.wait_for_timeout(400)
    ok('rechaza_titular','titular' in pg.inner_text('#toast-dom'))
    fila='#lista-accesos [data-aid="pedro@alfa.test__c1"]'
    pg.check(fila+' [data-perm=puede_descargar]'); pg.wait_for_timeout(400)
    ok('cambia_permiso', pg.evaluate("window.__DB__.accesos_portal.find(x=>x.id==='pedro@alfa.test__c1').data.puede_descargar")==True)
    pg.once('dialog',lambda d:d.accept())
    pg.click(fila+' [data-ac=baja]'); pg.wait_for_timeout(600)
    ok('baja', pg.evaluate("window.__DB__.accesos_portal.find(x=>x.id==='pedro@alfa.test__c1').data.activo")==False and 'dado de baja' in pg.inner_text('#lista-accesos'))
    pg.click(fila+' [data-ac=reactivar]'); pg.wait_for_timeout(600)
    ok('reactiva', pg.evaluate("window.__DB__.accesos_portal.find(x=>x.id==='pedro@alfa.test__c1').data.activo")==True)
    pg.screenshot(path=out+'/t_accesos.png',full_page=True)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300); ok('esc_cierra', not pg.is_visible('#modal-accesos'))
    # alta de cliente guarda el correo en minúsculas
def empleado(pg,out):
    pg.set_default_timeout(5000); pg.wait_for_timeout(600)
    ops=pg.eval_on_selector_all('#selector-empresas-cliente option','o=>o.map(x=>x.textContent)')
    ok('empleado_2_empresas_sin_la_de_baja', sorted(ops)==['Empresa Alfa S.A.','Transporte Cuyo'])
    ok('c1_puede_subir', pg.is_visible('.upload-card'))
    ok('c1_no_ve_entregas', not pg.is_visible('#bloque-entregas'))
    ok('c1_aviso', 'ver lo que entrega' in pg.inner_text('#aviso-permisos'))
    pg.screenshot(path=out+'/t_emp_c1.png',full_page=True)
    pg.select_option('#selector-empresas-cliente', label='Transporte Cuyo'); pg.wait_for_timeout(600)
    ok('c3_no_sube', not pg.is_visible('.upload-card'))
    ok('c3_ve_entregas', pg.is_visible('#bloque-entregas'))
    pg.screenshot(path=out+'/t_emp_c3.png',full_page=True)
def titular(pg,out):
    pg.set_default_timeout(5000); pg.wait_for_timeout(600)
    ok('titular_2_empresas', pg.eval_on_selector_all('#selector-empresas-cliente option','o=>o.length')==2)
    ok('titular_todo', pg.is_visible('.upload-card') and pg.is_visible('#bloque-entregas') and not pg.is_visible('#aviso-permisos'))
    ok('titular_ve_entrega', 'VEP_septiembre' in pg.inner_text('#lista-entregas'))
def sin(pg,out):
    pg.set_default_timeout(5000); pg.wait_for_timeout(600)
    ok('sin_empresa_mensaje','todavía no tiene una empresa' in pg.inner_text('#lista-entregas'))
if __name__=='__main__':
    import subprocess,time
    srv=subprocess.Popen(['python3','-m','http.server','8801'],cwd='/home/claude/domino-profesional',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        logs=[session('.',8801,rol='senior',steps=staff)]
        logs.append(session('.',8801,rol='empleado',steps=empleado,page='portal-cliente.html'))
        logs.append(session('.',8801,rol='cliente',steps=titular,page='portal-cliente.html'))
    finally: srv.terminate()
    for k,v in R.items(): print(('OK   ' if v else 'FAIL ')+k)
    for l in logs: print([x for x in l if 'PAGEERROR' in x or 'rror' in x][:4])
