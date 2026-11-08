"""Generate the original Foley for the Airbnb case study.

Six designed sounds — cereal pour, cardboard crease, air-mattress pump, box
set-down, editorial whoosh and the brand signature — are synthesised locally so
no sample library is required. Run with numpy available:

    python3 scripts/generate-airbnb-foley.py
"""
import numpy as np, subprocess, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/audio/episodes/airbnb/sfx"
OUT.mkdir(parents=True, exist_ok=True)
SR=48000
rng=np.random.default_rng(7)

def env_adsr(n, a, d, s_level, r):
    e=np.ones(n)*s_level
    ai=min(n,int(a*SR)); di=min(n-ai,int(d*SR)); ri=min(n-ai-di,int(r*SR))
    if ai>0: e[:ai]=np.linspace(0,1,ai)
    if di>0: e[ai:ai+di]=np.linspace(1,s_level,di)
    if ri>0: e[n-ri:]=np.linspace(s_level,0,ri)
    return e

def bp(x, lo, hi):
    # simple biquad bandpass via FFT
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR)
    mask=1/(1+np.exp(-(f-lo)/ (lo*0.15+1))) * 1/(1+np.exp((f-hi)/(hi*0.15+1)))
    return np.fft.irfft(X*mask, len(x))

def hp(x, cut):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR)
    m=1/(1+np.exp(-(f-cut)/(cut*0.18+1)))
    return np.fft.irfft(X*m,len(x))

def lp(x, cut):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR)
    m=1/(1+np.exp((f-cut)/(cut*0.18+1)))
    return np.fft.irfft(X*m,len(x))

def norm(x, peak=0.9):
    m=np.max(np.abs(x))+1e-9
    return x/m*peak

def write(name, x):
    import wave
    x=norm(x)
    Path('/tmp/foley').mkdir(exist_ok=True)
    pcm=(np.clip(x,-1,1)*32767).astype(np.int16)
    import wave
    with wave.open(f"/tmp/foley/{name}.wav","wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",f"/tmp/foley/{name}.wav","-ar","48000","-ac","2","-c:a","libmp3lame","-b:a","160k",str(OUT / f"{name}.mp3")],check=True)
    print(name, round(len(x)/SR,2))

# 1. CEREAL POUR — granular crisp clusters falling into a bowl
dur=2.8; n=int(dur*SR); x=np.zeros(n)
# bag rustle bed
rustle=bp(rng.standard_normal(n),700,6500)
rustle*= (0.12+0.5*np.exp(-((np.linspace(0,1,n)-0.25)**2)/0.02))
x+=rustle*0.18
# pour density envelope: dense at 0.15-0.55, thinning tail
t=np.linspace(0,1,n)
dens=np.exp(-((t-0.34)**2)/0.014)
for i in range(2600):
    pos=int((0.02+0.92*rng.random()**0.75)*n)
    if rng.random() > 0.25+0.95*dens[min(pos,n-1)]: continue
    ln=int(SR*(0.0018+rng.random()*0.006))
    if pos+ln>=n: continue
    f=1800+rng.random()*4200
    tt=np.arange(ln)/SR
    click=np.sin(2*np.pi*f*tt)*np.exp(-tt*(300+rng.random()*400))
    click+=0.5*rng.standard_normal(ln)*np.exp(-tt*900)
    x[pos:pos+ln]+= click*(0.05+rng.random()*0.22)
# bowl taps
for pos_s,amp in [(0.62,0.5),(1.05,0.28),(1.7,0.18)]:
    pos=int(pos_s*SR); ln=int(0.12*SR); tt=np.arange(ln)/SR
    tap=(np.sin(2*np.pi*420*tt)+0.6*np.sin(2*np.pi*870*tt))*np.exp(-tt*38)
    x[pos:pos+ln]+=tap*amp
write("cereal-pour", x*env_adsr(n,0.05,0.1,1,0.5))

# 2. CARDBOARD FOLD — crease, flap snap, soft settle
dur=1.6; n=int(dur*SR); x=np.zeros(n)
t=np.arange(n)/SR
# paper crease: filtered noise with rising resonance
crease=bp(rng.standard_normal(n),900,7000)
cenv=np.exp(-((t-0.28)**2)/0.006)+0.7*np.exp(-((t-0.62)**2)/0.01)
x+=crease*0.35*cenv
# low flex tone
x+=0.18*np.sin(2*np.pi*(95+18*np.sin(2*np.pi*3.2*t))*t)*np.exp(-((t-0.3)**2)/0.05)
# flap snap at 0.86
pos=int(0.86*SR); ln=int(0.18*SR); tt=np.arange(ln)/SR
snap=(rng.standard_normal(ln)*0.8+np.sin(2*np.pi*220*tt))*np.exp(-tt*70)
x[pos:pos+ln]+=snap*0.55
# settle tap
pos=int(1.22*SR); ln=int(0.25*SR); tt=np.arange(ln)/SR
x[pos:pos+ln]+=np.sin(2*np.pi*120*tt)*np.exp(-tt*24)*0.5
write("cardboard-fold", x*env_adsr(n,0.004,0.05,1,0.35))

# 3. AIR PUMP / MATTRESS INFLATION — motor hum + airy rush
dur=3.6; n=int(dur*SR); t=np.arange(n)/SR
hum=(np.sin(2*np.pi*88*t)+0.55*np.sin(2*np.pi*176*t)+0.25*np.sin(2*np.pi*264*t))
hum*= (1+0.12*np.sin(2*np.pi*11*t))
air=bp(rng.standard_normal(n),500,9000)*0.5
amp=env_adsr(n,1.1,0.4,0.9,0.9)
x=(hum*0.32+air*0.42)*amp
# little motor flutter
x*= (1+0.05*rng.standard_normal(n).cumsum()/np.sqrt(n))
write("air-inflate", x)

# 4. BOX SET DOWN — soft cardboard thud on wood
dur=0.9; n=int(dur*SR); t=np.arange(n)/SR
thud=np.sin(2*np.pi*(70*np.exp(-t*8)+55)*t)*np.exp(-t*16)
paper=bp(rng.standard_normal(n),800,6000)*np.exp(-t*40)
x=thud*0.85+paper*0.18
write("box-set", x*env_adsr(n,0.002,0.05,1,0.2))

# 5. WHOOSH-IN (soft editorial transition) - airy sweep
dur=1.1; n=int(dur*SR); t=np.arange(n)/SR
noise=rng.standard_normal(n)
sweep=bp(noise,300,5000)*np.exp(-((t-0.45)**2)/0.05)
sweep+=lp(noise,250)*np.exp(-((t-0.5)**2)/0.08)*0.6
write("soft-whoosh", sweep)

# 6. BRAND STING — warm low note with shimmer
dur=3.2; n=int(dur*SR); t=np.arange(n)/SR
base=(np.sin(2*np.pi*110*t)+0.45*np.sin(2*np.pi*165*t)+0.22*np.sin(2*np.pi*220*t))*np.exp(-t*1.5)
shim=(np.sin(2*np.pi*1320*t)+0.6*np.sin(2*np.pi*1760*t))*np.exp(-t*3.2)*0.12
x=base*0.5+shim*0.5
write("brand-sting", x*env_adsr(n,0.02,0.2,1,1.4))
