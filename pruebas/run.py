import sys,json,subprocess,time,os
sys.path.insert(0,'/home/claude/domino-test')
from stubs import MODS,seed
from playwright.sync_api import sync_playwright
def session(root,port,rol='senior',w=1280,h=900,steps=None,out='/tmp/dt',page='index.html'):
    os.makedirs(out,exist_ok=True)
    S,U=seed(rol)
    log=[]
    with sync_playwright() as p:
        b=p.chromium.launch(); ctx=b.new_context(viewport={'width':w,'height':h})
        ctx.add_init_script(f"window.__SEED__={json.dumps(S)};window.__USER__={json.dumps(U)};try{{localStorage.removeItem('__DBX__')}}catch(e){{}}")
        def route(r):
            u=r.request.url
            for k,v in MODS.items():
                if u.endswith('/'+k): return r.fulfill(status=200,content_type='text/javascript',body=v)
            if 'gstatic.com' in u: return r.abort()
            if 'fonts.g' in u: return r.abort()
            r.continue_()
        ctx.route('**/*',route)
        pg=ctx.new_page()
        pg.on('console',lambda m:log.append(f'[{m.type}] {m.text}') if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e:log.append(f'[PAGEERROR] {e}'))
        pg.goto(f'http://localhost:{port}/{page}'); pg.wait_for_timeout(1200)
        if steps: steps(pg,out)
        b.close()
    return log
