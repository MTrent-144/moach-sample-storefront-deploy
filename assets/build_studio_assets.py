"""Second-generation studio and sports assets. Run from any directory with Python 3.
Reads original identity SVGs; never rewrites them. No third-party dependencies.
"""
from pathlib import Path
import xml.etree.ElementTree as ET
import re
import copy

A = Path(__file__).resolve().parent
INK='#131D29'; CREAM='#F4EFDF'; CORAL='#EF5A49'; LIME='#DAEF66'
COLORS={'ink':INK,'coral':CORAL,'cream':CREAM,'sand':'#D9CFB4','lime':LIME}
ET.register_namespace('', 'http://www.w3.org/2000/svg')
def mark(name,x,y,w,color):
    root=ET.parse(A/f'moach-{name}.svg').getroot()
    vw=float(root.attrib['viewBox'].split()[2])
    inner=''.join(ET.tostring(c,encoding='unicode') for c in root if c.tag.split('}')[-1]!='title')
    inner=re.sub(r'#[0-9A-Fa-f]{6}',color,inner)
    return f'<g transform="translate({x} {y}) scale({w/vw})">{inner}</g>'
def path(d,fill='none',stroke=None,width=2,extra=''):
    return f'<path d="{d}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"' if stroke else '')+f' {extra}/>'
def seam(d):
    return path(d,stroke='#000',width=5,extra='opacity=".12"')+path(d,stroke='#fff',width=1.4,extra='opacity=".28" stroke-dasharray="3 4"')
def defs(color):
    return f'''<linearGradient id="ground" x2="0.7" y2="1"><stop stop-color="#FAF8F2"/><stop offset="1" stop-color="#DEDACF"/></linearGradient>
    <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="0.65"><stop stop-color="{color}"/><stop offset="1" stop-color="{color}"/></linearGradient>
    <linearGradient id="light" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="#fff" stop-opacity=".25"/><stop offset=".28" stop-color="#fff" stop-opacity=".08"/><stop offset=".52" stop-color="#000" stop-opacity=".04"/><stop offset=".78" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>
    <linearGradient id="fold"><stop stop-color="#000" stop-opacity="0"/><stop offset=".4" stop-color="#000" stop-opacity=".23"/><stop offset=".56" stop-color="#fff" stop-opacity=".13"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="edge" x2=".1" y2="1"><stop stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
    <linearGradient id="vinyl" x2=".7" y2="1"><stop stop-color="#fff" stop-opacity=".35"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="220%"><feGaussianBlur stdDeviation="19"/></filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
    <pattern id="weave" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 1h6M1 0v6" stroke="#fff" stroke-opacity=".065" stroke-width=".65"/><path d="M0 4h6M4 0v6" stroke="#000" stroke-opacity=".045" stroke-width=".6"/></pattern>
    <pattern id="rib" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M1 0v7" stroke="#000" stroke-opacity=".18" stroke-width="2"/><path d="M3 0v7" stroke="#fff" stroke-opacity=".18"/></pattern>
    <pattern id="thread" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4L4 0" stroke="#000" stroke-opacity=".3" stroke-width=".8"/></pattern>'''
def surface(d):
    return ''.join(path(d,f'url(#{f})') for f in ['fabric','light','weave'])
def decoration(name,x,y,w,color,emb=False):
    m=mark(name,x,y,w,color)
    if emb:
        # Clip a fine diagonal thread pattern to the unchanged identity paths.
        return f'<g transform="translate(1 2)" opacity=".25">{mark(name,x,y,w,"#000000")}</g>'+m+f'<defs><clipPath id="embroidery">{m}</clipPath></defs><rect x="0" y="0" width="1200" height="1400" fill="url(#thread)" clip-path="url(#embroidery)"/>'
    ident=f'print-{x}-{y}'
    return m+f'<defs><clipPath id="{ident}">{m}</clipPath></defs><g clip-path="url(#{ident})"><rect width="1200" height="1400" fill="url(#weave)"/>'+path('M390 550Q430 740 403 969L430 969Q445 740 411 550Z','url(#fold)',extra='filter="url(#soft)" opacity=".35"')+'</g>'
def garment(kind,color):
    contrast=CREAM if color in ['ink','coral'] else INK
    scriptcolor=CORAL if color=='cream' else contrast
    out='<ellipse cx="610" cy="1190" rx="370" ry="37" fill="#18212B" opacity=".16" filter="url(#shadow)"/>'
    if kind=='hat':
        crown='M267 823C272 634 318 418 491 368C547 349 647 345 704 367C865 420 919 598 927 802C791 866 432 878 267 823Z'
        brim='M282 797C460 753 740 758 916 797C979 834 1054 906 1014 954C956 1020 757 1054 560 1014C428 989 292 947 230 887C210 857 235 817 282 797Z'
        out='<ellipse cx="629" cy="1037" rx="410" ry="45" fill="#18212B" opacity=".23" filter="url(#shadow)"/>'+surface(crown)
        out+=path('M596 359C508 461 489 651 499 812L278 817C299 571 359 402 491 368Z','#000',extra='opacity=".08"')
        out+=surface(brim)+path(brim,'url(#edge)')
        out+=path('M288 800C458 768 748 769 914 801C776 861 441 867 288 800Z','#000',extra='opacity=".40"')
        for i in range(7):
            out+=seam(f'M{250+i*9} {856+i*12}C423 {975+i*4} 815 {1040-i*3} {1007-i*7} {921+i*3}')
        for d in ['M597 360C514 477 493 653 500 795','M597 360C703 466 747 651 749 796','M404 420C336 537 317 673 318 791','M792 421C863 536 880 668 881 788']:
            out+=seam(d)
        out+='<ellipse cx="596" cy="358" rx="23" ry="12" fill="url(#fabric)"/>'+path('M577 353Q596 342 614 354',stroke='#fff',extra='opacity=".25"')
        for x,y in [(416,485),(792,485)]:
            out+=f'<ellipse cx="{x}" cy="{y}" rx="9" ry="6" fill="#000" opacity=".45"/><ellipse cx="{x}" cy="{y}" rx="12" ry="9" fill="none" stroke="{COLORS[color]}" stroke-width="4"/>'
        return out+decoration('emblem',505,550,185,contrast,True)
    if kind=='sticker':
        d='M338 373Q295 373 295 422V982Q295 1032 345 1032H846Q899 1032 899 981V426Q899 373 846 373Z'
        out='<ellipse cx="610" cy="1050" rx="325" ry="29" fill="#18212B" opacity=".24" filter="url(#shadow)"/>'
        out+='<g transform="rotate(-7 600 700)">'+path(d,'#FFFEF8',stroke='#C7C2B7',width=2)
        out+=path('M350 395Q318 395 318 432V974Q318 1009 352 1009H833Q876 1009 876 970V433Q876 395 837 395Z',COLORS[color])
        out+=decoration('emblem',443,457,310,contrast)+decoration('primary-logo',376,823,447,contrast)
        out+=path(d,'url(#vinyl)')+path('M767 1009Q793 925 876 900L876 968Q876 1009 833 1009Z','#000',extra='opacity=".22"')
        out+=path('M767 1009Q786 918 876 900Q857 956 767 1009Z','#FFFEF7',stroke='#DBD6C9',width=1)
        return out+'</g>'
    if kind=='tank':
        d='M403 310L489 294C488 350 520 422 600 424C680 422 712 350 711 294L797 310C765 470 785 550 847 612L815 1114Q600 1155 385 1114L353 612C415 550 435 470 403 310Z'
        neck='M489 294C488 350 520 422 600 424C680 422 712 350 711 294'
        hems=['M403 310C435 470 415 550 353 612','M797 310C765 470 785 550 847 612','M389 1094Q600 1135 811 1094']
    elif kind=='crop':
        d='M465 342C425 352 386 360 347 385Q305 439 231 583L341 655 401 563Q409 717 388 931C495 952 705 952 812 931Q791 717 799 563L859 655 969 583Q895 439 853 385C814 360 775 352 735 342Q600 395 465 342Z'
        neck='M465 342Q600 474 735 342'
        hems=['M243 562L352 634','M957 562L848 634','M393 910Q600 936 807 910','M347 385Q409 428 401 563','M853 385Q791 428 799 563']
    else:
        d='M461 325C419 343 368 359 333 399Q296 488 198 1009L327 1043Q365 884 403 680L387 1125Q600 1161 813 1125L797 680Q835 884 873 1043L1002 1009Q904 488 867 399C832 359 781 343 739 325Q600 385 461 325Z'
        neck='M461 325Q600 467 739 325'
        hems=['M333 399Q410 459 403 680','M867 399Q790 459 797 680','M398 1076Q600 1102 802 1076']
        if kind=='hoodie':
            out+=surface('M454 365C396 302 409 221 471 189Q600 131 729 189C791 221 804 302 746 365L682 436H518Z')
            out+=path('M477 340C456 272 474 223 600 211C726 223 744 272 723 340L660 414H540Z','#000',extra='opacity=".48"')
            out+=seam('M454 356C427 267 451 199 600 177C749 199 773 267 746 356')
    out+=f'<defs><clipPath id="body">{path(d,"#fff")}</clipPath></defs>'+surface(d)
    # Broad tapered folds, clipped to the silhouette; no cartoon contour strokes.
    folds=['M392 549C432 672 408 915 448 1075C387 930 390 717 374 615Z','M800 556C756 756 807 912 752 1101C811 989 787 754 830 603Z','M445 1080Q579 1029 775 1099Q593 1068 445 1119Z','M349 407Q388 446 416 522Q369 465 326 447Z','M844 405Q805 458 788 531Q839 461 876 444Z']
    out+='<g clip-path="url(#body)"><g filter="url(#soft)">'
    for f in folds: out+=path(f,'url(#fold)')
    out+='</g>'
    for x,y,flip in [(408,680,1),(789,746,-1),(415,962,1),(780,1010,-1)]:
        out+=path(f'M{x} {y}q{45*flip} 8 {75*flip} 38q{-47*flip} -20 {-74*flip} -23Z','url(#fold)',extra='filter="url(#soft)" opacity=".65"')
    out+='</g>'
    out+=path(neck,stroke=COLORS[color],width=22)+path(neck,stroke='#000',width=22,extra='opacity=".13"')+path(neck,stroke='url(#rib)',width=18)+seam(neck)
    for h in hems: out+=seam(h)
    if kind in ['hoodie','crewneck']:
        for h in ['M390 1079Q600 1108 810 1079L813 1125Q600 1161 387 1125Z','M205 971L337 1004 327 1043 198 1009Z','M863 1004L995 971 1002 1009 873 1043Z']:
            out+=surface(h)+path(h,'url(#edge)')+path(h,'url(#rib)')
        out+=seam('M399 1090Q600 1117 801 1090')
    if kind=='crop':
        out+=decoration('script-mark',386,538,450,scriptcolor)
    else:
        out+=decoration('primary-logo',414,552,372,contrast)
        out+=decoration('emblem',555,679,90,CORAL if color=='ink' and kind=='tank' else contrast,kind=='crewneck')
    if kind=='hoodie':
        p='M489 828Q600 849 711 828L762 991Q600 1021 438 991Z'
        out+=path(p,COLORS[color])+path(p,'url(#light)')+path(p,'url(#weave)')+seam('M489 828Q600 849 711 828M489 828L459 927M711 828L741 927M448 986Q600 1011 752 986')
        out+=path('M536 407Q535 490 518 577M664 407Q668 493 685 572',stroke='#000',width=9,extra='opacity=".25"')
        out+=path('M534 407Q530 490 515 575M662 407Q665 493 682 570',stroke=contrast,width=5)
        out+=path('M514 563L512 580M681 558L684 575',stroke=INK,width=7)
        out+=seam('M487 353Q600 426 713 353')
    return out
def document(title,body,definitions='',w=1200,h=1400,desc=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{desc or title}</desc><defs>{definitions}</defs>{body}</svg>'
def write(name,content):
    p=A/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content,encoding='utf-8')
def studio(kind,color):
    return document(f'MOACH {color} {kind} studio product mockup','<path d="M0 0H1200V1400H0Z" fill="url(#ground)"/>'+garment(kind,color),defs(COLORS[color]),desc=f'Front view of {color} {kind}, original applied MOACH artwork, fabric construction and soft upper-left studio light. Vector merchandise concept.')
for kind in ['hat','tank','crop','hoodie','crewneck','sticker']:
    for color in (['coral','cream','ink','lime'] if kind=='sticker' else ['ink','coral','cream','sand']):
        write(f'products/product-{kind}-{color}.svg',studio(kind,color))
    default={'crop':'cream','crewneck':'coral','sticker':'coral'}.get(kind,'ink')
    write(f'product-{kind}.svg',studio(kind,default))
# Each nested SVG has its own definition scope, and all IDs are namespaced.
hero='<path d="M0 0H1800V1000H0Z" fill="#E9E4D7"/>'
for i,(kind,color,x,y,w,h,angle) in enumerate([('crewneck','coral',-30,-90,940,1097,-9),('crop','cream',800,-65,940,1097,9),('hat','ink',635,330,640,747,-8),('sticker','coral',1405,628,300,350,12)]):
    content=studio(kind,color)
    root=ET.fromstring(content)
    for el in root.iter():
        for k,v in list(el.attrib.items()):
            if k=='id': el.set(k,f'h{i}-{v}')
            elif k in ['aria-labelledby','aria-describedby']: el.set(k,' '.join(f'h{i}-{s}' for s in v.split()))
            else: el.set(k,re.sub(r'url\(#([^)]+)\)',lambda m:f'url(#h{i}-{m[1]})',v))
    root.set('x',str(x));root.set('y',str(y));root.set('width',str(w));root.set('height',str(h))
    # Remove backgrounds for a shared studio sweep.
    for el in list(root):
        if el.tag.endswith('path') and el.attrib.get('d')=='M0 0H1200V1400H0Z':root.remove(el)
    hero+=f'<g transform="rotate({angle} {x+w/2} {y+h/2})">'+ET.tostring(root,encoding='unicode')+'</g>'
write('hero-collage.svg',document('MOACH studio collection: coral crewneck, cream crop, ink cap and coral decal',hero,w=1800,h=1000))

def circle(x,y,r=16,color=CORAL,extra=''):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" {extra}/>'
def route(d,dashed=False):
    return path(d,stroke=LIME,width=3,extra='marker-end="url(#arrow)"'+(' stroke-dasharray="7 7"' if dashed else ''))
def sport(name,title,body,description):
    base='<rect width="900" height="620" rx="24" fill="#131D29"/>'
    base+=path('M32 54H140M32 54V32H54',stroke=LIME,width=4)
    base+=body
    base+='<rect x="768" y="480" width="73" height="82" rx="5" fill="#F4EFDF"/>'+mark('emblem',775,487,60,INK)
    write('sports/'+name+'.svg',document(title,base,'<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M1 1L9 5 1 9" fill="none" stroke="#DAEF66" stroke-width="2"/></marker>',900,620,description))
lines=lambda d: path(d,stroke=CREAM,width=2.5)
# Five coral offensive circles; five cream defensive Xs. No other player symbols.
b=lines('M95 90H735V550H95Z')+path('M95 320H735',stroke=CREAM,width=2,extra='stroke-dasharray="9 7"')
for y in [140,220,420,500]:b+=path(f'M95 {y}H115M715 {y}H735',stroke=CREAM,width=2)
for x,y in [(170,350),(310,350),(440,350),(570,350),(440,440)]: b+=circle(x,y,16,extra='data-role="offense"')
for x,y in [(170,270),(310,270),(440,270),(570,270),(620,160)]: b+=path(f'M{x-11} {y-11}l22 22M{x+11} {y-11}l-22 22',stroke=CREAM,width=4,extra='data-role="defense"')
b+=route('M170 328V182L252 139')+route('M310 328V205H390')+route('M570 328V236L670 191')+route('M440 419Q499 408 511 360V300',True)
b+=path('M429 347Q440 335 451 347Q440 359 429 347Z',LIME)
sport('football-5v5','Youth football: five-on-five passing formation',b,'Exactly five offensive coral circles and five defensive cream Xs. Dashed horizontal line is the line of scrimmage; chartreuse arrows show passing routes. Boundaries are sidelines; MOACH sideline marker at right.')
b=lines('M115 90H735V550H115ZM330 90V280H520V90M330 280Q425 374 520 280M200 90V175Q425 536 650 175V90')
b+=lines('M382 116H468M425 116V135')+'<circle cx="425" cy="149" r="15" fill="none" stroke="#F4EFDF" stroke-width="3"/>'
for x,y in [(425,465),(227,320),(620,320),(350,236),(536,179)]:b+=circle(x,y,16,extra='data-role="player"')
b+=circle(445,449,7,LIME)+route('M405 452L249 334',True)+route('M238 296Q259 210 321 192')+route('M607 300Q574 248 559 215')+route('M374 236H464',True)+lines('M521 206l34 17')
sport('basketball','Youth basketball: five-player half-court passing and cuts',b,'Five coral players on a half-court with basket, key, free throw and three-point arcs. Dashed chartreuse arrows are passes; solid arrows are cuts. Cream bar near the right lane is a screen. MOACH marker on right sideline.')
b=lines('M425 526L150 251M425 526L700 251')+path('M425 526L179 280Q425 -50 671 280Z',CREAM,extra='opacity=".05"')
b+=lines('M425 491L267 333 425 175 583 333Z')
for x,y in [(425,491),(267,333),(425,175),(583,333)]:b+=path(f'M{x} {y-9}l9 9-9 9-9-9Z',CREAM)
b+=circle(425,333,33,INK,extra='stroke="#F4EFDF" stroke-width="2"')+lines('M415 333H435M388 526H462M200 440L237 477M613 477L650 440')
for x,y in [(425,348),(563,308),(281,305),(425,201),(252,176),(593,176),(425,106)]:b+=circle(x,y,12,extra='data-role="fielder"')
b+=circle(556,357,12,LIME,extra='data-role="runner"')+route('M568 370Q613 335 585 294L453 184')+circle(464,280,5,LIME)
b+=lines('M665 471H732V510H665Z')
sport('baseball','Youth baseball: rounding first toward second',b,'Readable diamond with home at bottom, first at right, second at top and third at left. Coral markers are fielders, chartreuse runner rounds first toward second; small chartreuse dot is the ball. MOACH marker beside coaching box and dugout on right.')
b=lines('M145 105H715V525H145ZM145 315H715')
b+=path('M145 245H715M145 385H715',stroke=CREAM,width=2,extra='stroke-dasharray="7 6"')
b+=path('M132 315H728',stroke=CREAM,width=7)+lines('M132 295V335M728 295V335')
for x in range(150,715,20):b+=path(f'M{x} 307v16',stroke=INK,width=1)
for x,y in [(235,362),(425,362),(625,362),(235,466),(425,466),(625,466)]:b+=circle(x,y,16,extra='data-role="player"')
b+=route('M235 443L289 402')+route('M625 443L564 402')+route('M425 442V400')+route('M555 148Q488 189 434 281',True)
b+=circle(555,148,11,LIME)+lines('M547 142Q557 146 559 158M548 152Q555 147 563 146')
sport('volleyball','Youth volleyball: six-player serve receive',b,'Six coral players occupy two rows on the receiving half. Court center net and attack lines in cream. Chartreuse ball and dashed serve trajectory approach the receivers; solid arrows show receive adjustments. MOACH marker outside right sideline.')

if __name__=='__main__':
    files=list(A.rglob('*.svg'))
    for p in files:ET.parse(p)
    print(f'Generated 24 variants, 6 legacy defaults, hero and 4 sports diagrams; XML parsed {len(files)} SVGs.')
