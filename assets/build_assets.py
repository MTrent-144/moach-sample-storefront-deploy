from pathlib import Path
import xml.etree.ElementTree as ET
A=Path('assets')
INK='#131D29'; CREAM='#F4EFDF'; CORAL='#EF5A49'; LIME='#DAEF66'
# Original geometric letter outlines; no fonts or external resources.
glyph={
'M':'0,100 0,0 20,0 40,37 60,0 80,0 80,100 58,100 58,37 40,65 22,37 22,100',
'O':'0,18 18,0 62,0 80,18 80,82 62,100 18,100 0,82|22,26 22,74 28,80 52,80 58,74 58,26 52,20 28,20',
'A':'0,100 26,0 54,0 80,100 57,100 51,75 29,75 23,100|35,55 45,55 40,30',
'C':'0,18 18,0 65,0 80,15 65,33 55,22 28,22 22,28 22,72 28,78 55,78 65,67 80,85 65,100 18,100 0,82',
'H':'0,0 23,0 23,38 57,38 57,0 80,0 80,100 57,100 57,61 23,61 23,100 0,100',
'S':'78,14 64,0 17,0 0,17 0,43 17,59 53,59 58,64 58,75 53,80 26,80 16,70 0,86 14,100 63,100 80,83 80,55 63,39 28,39 22,34 22,25 27,20 53,20 63,30',
'I':'0,0 60,0 60,20 41,20 41,80 60,80 60,100 0,100 0,80 19,80 19,20 0,20',
'D':'0,0 55,0 80,25 80,75 55,100 0,100|23,22 23,78 45,78 57,66 57,34 45,22',
'E':'0,0 75,0 75,21 23,21 23,39 65,39 65,60 23,60 23,79 75,79 75,100 0,100',
'L':'0,0 23,0 23,78 75,78 75,100 0,100',
'N':'0,100 0,0 22,0 57,59 57,0 80,0 80,100 58,100 23,41 23,100',
'B':'0,0 58,0 77,16 77,40 66,50 80,63 80,83 62,100 0,100|23,20 23,40 50,40 55,35 55,25 50,20|23,60 23,80 51,80 57,74 57,66 51,60',
'U':'0,0 23,0 23,72 30,80 50,80 57,72 57,0 80,0 80,82 62,100 18,100 0,82',
'T':'0,0 80,0 80,23 52,23 52,100 28,100 28,23 0,23',
'F':'0,0 75,0 75,23 23,23 23,43 65,43 65,65 23,65 23,100 0,100',
'R':'0,0 60,0 80,20 80,49 62,65 82,100 55,100 35,67 23,67 23,100 0,100|23,21 23,46 51,46 58,39 58,28 51,21',
'G':'0,18 18,0 64,0 80,16 64,32 55,22 28,22 22,28 22,72 28,78 58,78 58,62 42,62 42,42 80,42 80,84 64,100 18,100 0,82',
'Y':'0,0 25,0 40,33 55,0 80,0 52,58 52,100 28,100 28,58',
'V':'0,0 24,0 40,66 56,0 80,0 53,100 27,100',
}
def letters(s,x,y,w,color=INK):
    widths=[60 if c=='I' else 80 if c!=' ' else 36 for c in s]; total=sum(widths)+12*(len(s)-1); scale=w/total; out=[]; pos=0
    for c,cw in zip(s,widths):
        if c in glyph:
            d=' '.join('M'+' L'.join(p.split())+' Z' for p in glyph[c].split('|'))
            out.append(f'<path d="{d}" transform="translate({pos} 0)"/>')
        pos+=cw+12
    return f'<g fill="{color}" fill-rule="evenodd" transform="translate({x} {y}) scale({scale})">'+''.join(out)+'</g>'
def emblem(x,y,size,color=INK):
    # two separated ribbons make an M and open sideline chevrons
    return f'<g transform="translate({x} {y}) scale({size/100})" fill="{color}"><path d="M8 86V14H26L50 43 74 14H92V86H72V47L50 73 28 47V86Z"/><path d="M28 96H72V100H28Z"/></g>'
def script(x,y,w,color=INK):
    # bespoke flowing monoline script, round terminals; constructed as paths
    return f'''<g transform="translate({x} {y}) scale({w/600})" fill="none" stroke="{color}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"><path d="M12 134C26 112 35 63 47 34C54 17 64 22 64 41L57 110C73 78 94 35 108 30C122 25 113 64 108 91L102 118C127 80 142 43 154 44C169 44 147 106 144 126C140 150 161 143 177 122"/><path d="M179 116C181 87 214 78 221 96C232 123 190 150 181 130C171 108 205 86 225 96C234 103 246 99 254 91"/><path d="M283 95C270 78 245 96 242 119C239 144 263 142 281 110L289 90L276 124C270 145 291 139 307 121"/><path d="M343 96C333 78 311 95 306 116C300 143 327 145 354 117"/><path d="M355 132C377 93 398 51 400 35C403 17 387 28 379 48C369 76 359 111 355 132L377 102C391 83 408 87 401 105L392 127C388 144 412 139 435 116C456 96 476 93 492 100"/><path d="M153 170C259 142 396 146 505 153C532 154 552 145 571 132"/></g>'''
def svg(name,title,body,w=1200,h=1400,defs=''):
    A.joinpath(name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title"><title id="title">{title}</title><defs>{defs}</defs>{body}</svg>',encoding='utf-8')
svg('moach-emblem.svg','MOACH folded M sideline emblem',emblem(10,0,100),120,110)
svg('moach-primary-logo.svg','MOACH primary wordmark and folded M emblem',emblem(0,0,100)+letters('MOACH',135,8,470),620,110)
svg('moach-script-mark.svg','MOACH flowing alternate script mark',script(0,0,600),600,200)
defs=f'''<linearGradient id="bg" x2="1" y2="1"><stop stop-color="#F4F0E6"/><stop offset="1" stop-color="#E2DED3"/></linearGradient><linearGradient id="navy" x2="1" y2=".8"><stop stop-color="#354352"/><stop offset=".45" stop-color="{INK}"/><stop offset="1" stop-color="#233142"/></linearGradient><linearGradient id="coral" x2=".8" y2="1"><stop stop-color="#FF8270"/><stop offset=".55" stop-color="{CORAL}"/><stop offset="1" stop-color="#C44038"/></linearGradient><linearGradient id="cream" x2="1" y2="1"><stop stop-color="#FFFCED"/><stop offset=".55" stop-color="#E9E2CD"/><stop offset="1" stop-color="#CBC4B0"/></linearGradient><filter id="shadow" x="-40%" y="-40%" width="180%" height="190%"><feGaussianBlur stdDeviation="24"/></filter><pattern id="knit" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M1 1L4 4 7 1M1 5L4 8 7 5" fill="none" stroke="#FFFFFF" stroke-opacity=".055" stroke-width="1"/></pattern>'''
def bg(accent=CORAL):
    return f'<path fill="url(#bg)" d="M0 0H1200V1400H0Z"/><circle cx="1050" cy="190" r="260" fill="{CREAM}"/><path d="M70 1080V1270H260" fill="none" stroke="{accent}" stroke-width="5"/><path d="M1050 85H1130V165" fill="none" stroke="{INK}" stroke-opacity=".2" stroke-width="3"/>'
def seam(d,color=CREAM,opacity='.3',width=3):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-opacity="{opacity}" stroke-width="{width}" stroke-linecap="round"/>'
def garment(kind):
    if kind=='hat':
        b='<ellipse cx="619" cy="1030" rx="370" ry="57" fill="#17202B" opacity=".22" filter="url(#shadow)"/>'
        b+='<path d="M289 804C299 545 377 369 603 358C815 347 916 546 911 811C779 867 427 877 289 804Z" fill="url(#navy)"/>'
        b+='<path d="M294 791C458 750 742 742 910 800C1002 876 994 952 916 974C737 1030 400 1002 243 912C195 884 219 831 294 791Z" fill="url(#navy)"/>'
        b+='<path d="M311 792C457 762 750 757 893 802C760 833 460 848 311 792Z" fill="#0E1721"/>'
        b+=seam('M603 365C521 489 504 653 508 782M603 365C695 489 724 650 718 784M306 790C312 611 356 482 449 414')
        for off in range(5): b+=seam(f'M{266+off*17} {878+off*12}C443 {965+off*5} 798 {993+off*2} {944-off*6} {900+off*8}',CREAM,'.17',2)
        b+='<ellipse cx="602" cy="361" rx="25" ry="13" fill="#34404C"/>'+emblem(519,548,175,CREAM)
        b+='<path d="M290 804C299 545 377 369 603 358C815 347 916 546 911 811Z" fill="url(#knit)"/>'
        return b
    if kind=='sticker':
        return '<ellipse cx="612" cy="1020" rx="330" ry="48" fill="#17202B" opacity=".2" filter="url(#shadow)"/>'+f'<g transform="rotate(-9 600 700)"><rect x="292" y="377" width="616" height="651" rx="82" fill="#fffdf5" stroke="#D7D1C4" stroke-width="3"/><rect x="316" y="401" width="568" height="603" rx="62" fill="{CORAL}"/>'+emblem(438,468,320,CREAM)+letters('MOACH',383,829,434,CREAM)+'<path d="M754 1004L884 874V942Q884 1004 822 1004Z" fill="#D9D2BE"/><path d="M754 1004Q780 910 884 874L822 1004Z" fill="#FFFDF6"/></g>'
    if kind=='tank':
        d='M392 330L487 300Q600 365 713 300L808 330C778 473 804 568 865 619L826 1095Q600 1133 374 1095L335 619C396 568 422 473 392 330Z'; fill='navy'
        neck='M487 300C484 490 716 490 713 300'; folds=['M400 647Q437 752 412 990','M802 641Q762 792 792 1033','M455 1069Q598 1050 745 1072']
        mark=letters('MOACH',433,596,334,CREAM)+emblem(557,729,86,CORAL)
    elif kind=='crop':
        d='M442 350L326 385 197 598 330 677 393 587 380 944Q600 979 820 944L807 587 870 677 1003 598 874 385 758 350Q600 424 442 350Z'; fill='cream';neck='M442 350Q600 495 758 350'; folds=['M394 588L421 852','M804 592L777 859','M403 921Q600 943 798 920'];mark=script(416,536,430,CORAL)
    else:
        hood=kind=='hoodie'; fill='navy' if hood else 'coral'
        d='M440 335L334 374 190 855 310 908 402 640 377 1080Q600 1132 823 1080L798 640 890 908 1010 855 866 374 760 335Q600 413 440 335Z'
        neck='M440 335Q600 468 760 335';folds=['M387 669Q427 780 405 986','M812 665Q768 811 796 998','M267 823L337 610','M932 823L865 610']
        mark=letters('MOACH',441,545,318,CREAM)+emblem(556,674,88,CREAM)
    b='<ellipse cx="600" cy="1150" rx="358" ry="42" fill="#17202B" opacity=".18" filter="url(#shadow)"/>'
    if kind=='hoodie': b+='<path d="M437 352C365 201 446 188 600 185C754 188 835 201 763 352L684 447H516Z" fill="url(#navy)"/>'+seam('M455 330C449 236 493 226 600 226C707 226 751 236 745 330')
    b+=f'<path d="{d}" fill="url(#{fill})"/><path d="{d}" fill="url(#knit)"/>'
    b+=seam(neck,INK if fill=='cream' else CREAM,'.24',13)+seam(neck,CREAM,'.3',3)
    for f in folds: b+=seam(f,INK,'.12',12)+seam(f,CREAM,'.17',3)
    b+=mark
    if kind in ['hoodie','crewneck']:
        b+=f'<path d="M379 1037Q600 1084 821 1037L823 1080Q600 1132 377 1080Z" fill="url(#{fill})" stroke="{INK}" stroke-opacity=".16" stroke-width="3"/>'
        b+=seam('M204 821L324 870M876 870L996 821',CREAM,'.25',5)
        for x in range(394,813,12): b+=seam(f'M{x} 1063v29',CREAM,'.13',2)
    if kind=='hoodie':
        b+='<path d="M477 830L436 977Q600 1008 764 977L723 830Q600 857 477 830Z" fill="#243241"/>'+seam('M477 830L436 977Q600 1008 764 977L723 830',CREAM,'.25',3)
        b+=seam('M530 388L516 554M670 388L684 554',CREAM,'.7',6)
    if kind=='tank': b+=seam('M392 330C422 473 396 568 335 619M808 330C778 473 804 568 865 619',CREAM,'.25',10)
    return b
for k in ['hat','tank','crop','hoodie','crewneck','sticker']:
    svg('product-'+k+'.svg','MOACH '+k+' — original apparel concept on warm editorial background',bg(LIME if k in ['hat','hoodie'] else CORAL)+garment(k),defs=defs)
# Hero reuses actual garment vector art for an internally consistent collection.
hero=f'<path fill="{CREAM}" d="M0 0H1800V1000H0Z"/><path fill="#E5DFD0" d="M1050 0H1800V1000H700Z"/><circle cx="1510" cy="190" r="320" fill="{CORAL}"/><path d="M55 790H1745M55 825H1745" stroke="{INK}" opacity=".12" stroke-width="3"/>'
hero+='<g transform="translate(25 -110) rotate(-12 500 600) scale(.76)">'+garment('crewneck')+'</g>'
hero+='<g transform="translate(860 -70) rotate(12 500 600) scale(.71)">'+garment('crop')+'</g>'
hero+='<g transform="translate(620 340) rotate(-7 400 500) scale(.53)">'+garment('hat')+'</g>'
hero+='<g transform="translate(1390 665) rotate(12) scale(.22)">'+garment('sticker')+'</g>'
hero+=f'<rect x="70" y="70" width="110" height="8" fill="{LIME}"/>'+letters('BUILT FOR GAME DAY',74,91,530,INK)
svg('hero-collage.svg','MOACH game-day editorial collage with coral crewneck, cream crop, navy cap and sticker',hero,1800,1000,defs)
pattern=f'<path fill="{CREAM}" d="M0 0H320V320H0Z"/><g fill="none" stroke="{INK}" stroke-opacity=".07" stroke-width="2"><path d="M-40 80H120V-40M200 360V200H360M0 240H80V320M240 0V80H320"/><path d="M32 112H64M48 96V128M256 208H288M272 192V224"/></g>'+emblem(137,137,46,'#DCD9CD')
svg('pattern-sideline.svg','Subtle tileable MOACH sideline linework pattern',pattern,320,320)
for p in A.glob('*.svg'): ET.parse(p)
print('XML verification passed:',len(list(A.glob('*.svg'))),'SVGs')
