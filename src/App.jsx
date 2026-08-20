import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, Phone, MapPin, Shield, Headphones, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BRAND = {
  name: 'Joker Sound',
  purpose: 'Uygun fiyat ve kalitenin tek yeri',
  cta: 'Bize ulaşın (Letgo)',
  letgo: 'https://www.letgo.com/profil/85810934',
  phone: '05412848474',
  phoneDisplay: '0541 284 84 74',
  location: 'Gaziantep, Karşıyaka'
}

export default function App(){
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const frameCount = 82
  const framePath = (i) => `${import.meta.env.BASE_URL}frames/bass_${String(i).padStart(3,'0')}.jpg`

  useEffect(()=>{
    const ctx = gsap.context(()=>{
      let images = []
      let loadedCount = 0
      const canvas = canvasRef.current
      const c2d = canvas.getContext('2d')

      function fitCanvas(){
        const ratio = window.devicePixelRatio || 1
        const w = containerRef.current.clientWidth
        const h = containerRef.current.clientHeight
        canvas.width = w * ratio
        canvas.height = h * ratio
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        c2d.setTransform(ratio,0,0,ratio,0,0)
      }

      fitCanvas()
      window.addEventListener('resize', fitCanvas)

      for(let i=0;i<frameCount;i++){
        const img = new Image()
        img.src = framePath(i)
        img.onload = ()=>{
          loadedCount++
          setProgress(Math.round((loadedCount / frameCount) * 100))
          if(loadedCount === frameCount){
            setLoaded(true)
          }
        }
        images.push(img)
      }

      function draw(index){
        const img = images[index]
        if(!img) return
        const cw = canvas.width / (window.devicePixelRatio || 1)
        const ch = canvas.height / (window.devicePixelRatio || 1)
        c2d.clearRect(0,0,cw,ch)
        const arImg = img.width / img.height
        const arCan = cw / ch
        let dw = cw, dh = ch
        if(arImg > arCan){
          dh = ch
          dw = ch * arImg
        } else {
          dw = cw
          dh = cw / arImg
        }
        c2d.drawImage(img, (cw - dw)/2, (ch - dh)/2, dw, dh)
      }

      // initial draw
      const initImg = new Image()
      initImg.src = framePath(0)
      initImg.onload = ()=> draw(0)

      // ScrollTrigger scrub to change frame
      const obj = {frame: 0}
      const scrub = gsap.to(obj, {
        frame: frameCount - 1,
        ease: 'none',
        onUpdate: ()=> draw(Math.round(obj.frame)),
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom+=200% top',
          scrub: 0.5,
        }
      })

      // navbar morph: toggle a class when leaving hero
      const navEl = document.querySelector('nav')
      const heroObserver = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(!navEl) return
          if(e.isIntersecting){
            navEl.classList.remove('scrolled')
          } else {
            navEl.classList.add('scrolled')
          }
        })
      },{root:null,threshold:0.01})
      if(containerRef.current) heroObserver.observe(containerRef.current)

      return ()=>{
        window.removeEventListener('resize', fitCanvas)
        scrub.kill()
        heroObserver.disconnect()
      }
    })
    return ()=> ctx.revert()
  },[])

  // Simple interactions for three feature cards
  useEffect(()=>{
    const ctx = gsap.context(()=>{
      const tl = gsap.timeline({defaults:{ease:'power2.inOut'}})
      tl.from('.feature-card',{y:30,opacity:0,stagger:0.15,duration:0.6})
      return ()=> tl.kill()
    })
    return ()=> ctx.revert()
  },[])

  // Magnetic button effect
  useEffect(()=>{
    const ctx = gsap.context(()=>{
      const btns = document.querySelectorAll('.magnetic-btn')
      btns.forEach(btn=>{
        const strength = 30
        const xTo = gsap.quickTo(btn, 'x', {duration: 0.3, ease: 'power3.out'})
        const yTo = gsap.quickTo(btn, 'y', {duration: 0.3, ease: 'power3.out'})

        btn.addEventListener('mousemove', (e)=>{
          const rect = btn.getBoundingClientRect()
          const relX = e.clientX - rect.left - rect.width/2
          const relY = e.clientY - rect.top - rect.height/2
          xTo(relX * (strength / rect.width))
          yTo(relY * (strength / rect.height))
        })

        btn.addEventListener('mouseleave', ()=>{
          xTo(0)
          yTo(0)
        })
      })
    })
    return ()=> ctx.revert()
  },[])

  // Smooth scroll for anchor links
  useEffect(()=>{
    const handleClick = (e)=>{
      const target = e.target.closest('a[href^="#"]')
      if(!target) return
      e.preventDefault()
      const id = target.getAttribute('href')
      const el = document.querySelector(id)
      if(el){
        el.scrollIntoView({behavior:'smooth'})
      }
    }
    document.addEventListener('click', handleClick)
    return ()=> document.removeEventListener('click', handleClick)
  },[])

  return (
    <div className="min-h-screen text-ghost bg-[#0A0A14]">
      <div className="noise" aria-hidden dangerouslySetInnerHTML={{__html:`<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.05'/></svg>`}} />

      {/* Loading Screen */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] bg-[#0A0A14] flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#7B61FF]/20 border-t-[#7B61FF] animate-spin" />
          <div className="text-center">
            <div className="font-bold text-2xl bg-gradient-to-r from-[#7B61FF] to-[#F0EFF4] bg-clip-text text-transparent">{BRAND.name}</div>
            <div className="text-sm opacity-60 mt-2">{BRAND.purpose}</div>
          </div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7B61FF] to-[#9B8FFF] transition-all duration-300" style={{width: `${progress}%`}} />
          </div>
          <div className="text-xs font-mono text-[#7B61FF]">{progress}%</div>
        </div>
      )}

      {/* Fixed Hero Canvas - Always Visible on Top */}
      <section ref={containerRef} className="fixed top-0 left-0 w-full h-[100dvh] z-20 overflow-hidden pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(10,10,20,0.3)]" />
        <div className="absolute left-8 bottom-16 max-w-lg text-left pointer-events-auto">
          <h1 className="text-6xl md:text-8xl font-black leading-tight" style={{fontFamily:'Sora, serif'}}>Sınırları<br/><span style={{fontFamily:'Playfair Display, serif',fontStyle:'italic',fontSize:'4rem',display:'block',background:'linear-gradient(135deg, #7B61FF 0%, #9B8FFF 100%)',backgroundClip:'text',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>aşan ses.</span></h1>
          <p className="mt-4 text-sm opacity-80">{BRAND.purpose}</p>
          <div className="mt-6 flex gap-3">
            <a className="magnetic-btn px-5 py-3 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#9B8FFF] text-white overflow-hidden font-semibold hover:shadow-lg hover:shadow-[#7B61FF]/50 transition-all" href={BRAND.letgo} target="_blank" rel="noreferrer">Bize Ulaşın</a>
            <a className="magnetic-btn px-5 py-3 rounded-full border border-[#7B61FF]/40 text-white font-semibold hover:bg-[#7B61FF]/10 transition-all" href={`tel:${BRAND.phone}`}>
              <Phone size={16} className="inline mr-2" />Ara
            </a>
          </div>
        </div>
      </section>

      {/* Navbar */}
      <nav className="fixed left-1/2 -translate-x-1/2 top-6 bg-gradient-to-r from-[rgba(123,97,255,0.15)] to-[rgba(15,10,25,0.2)] backdrop-blur-xl px-6 py-3 rounded-full border border-[#7B61FF]/40 flex items-center gap-6 z-50 shadow-lg shadow-[#7B61FF]/20 transition-all duration-300">
        <div className="font-bold bg-gradient-to-r from-[#7B61FF] to-[#F0EFF4] bg-clip-text text-transparent">{BRAND.name}</div>
        <div className="hidden md:flex gap-4 text-sm opacity-80">
          <a href="#features" className="hover:text-[#7B61FF] transition-colors">Ürünler</a>
          <a href="#protocol" className="hover:text-[#7B61FF] transition-colors">Protokol</a>
          <a href="#pricing" className="hover:text-[#7B61FF] transition-colors">Fiyatlar</a>
        </div>
        <a className="ml-4 magnetic-btn px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#9B8FFF] text-white rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-[#7B61FF]/50 transition-all" href={BRAND.letgo} target="_blank" rel="noreferrer">Bize Ulaşın <ArrowRight size={16} /></a>
      </nav>

      {/* Scrolling Content - Hero Always Visible Behind */}
      <main className="relative z-30">
        {/* Spacer for hero section */}
        <div className="h-[100dvh] pointer-events-none" />

        <section id="features" className="py-32 px-6 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#F0EFF4] bg-clip-text text-transparent">Neden {BRAND.name}?</h2>
              <p className="mt-4 text-sm opacity-60 max-w-xl mx-auto">Ses sistemleri konusunda uzman ekibimizle, ihtiyacınıza en uygun çözümü sunuyoruz.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card p-8 rounded-giant bg-[rgba(123,97,255,0.08)] backdrop-blur-md border border-[#7B61FF]/30 hover:border-[#9B8FFF] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-[#7B61FF]/20 flex items-center justify-center mb-4">
                  <Shield size={24} className="text-[#7B61FF]" />
                </div>
                <h3 className="font-semibold text-xl text-[#7B61FF]">Kaliteli Ekipman</h3>
                <p className="text-sm opacity-80 mt-2">Garantili, test edilmiş ve uzun ömürlü ses sistemleri.</p>
              </div>
              <div className="feature-card p-8 rounded-giant bg-[rgba(123,97,255,0.08)] backdrop-blur-md border border-[#7B61FF]/30 hover:border-[#9B8FFF] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-[#7B61FF]/20 flex items-center justify-center mb-4">
                  <Headphones size={24} className="text-[#7B61FF]" />
                </div>
                <h3 className="font-semibold text-xl text-[#7B61FF]">Canlı Destek</h3>
                <p className="text-sm opacity-80 mt-2">Profesyonel kurulum ve teknik destek — her alan için.</p>
                <div className="mt-6 space-y-2">
                  <div className="text-lg font-bold text-ghost">ADEM TÜRK</div>
                  <a href={`tel:${BRAND.phone}`} className="text-xl font-bold text-[#7B61FF] hover:text-white transition-colors block [text-shadow:0_0_15px_rgba(123,97,255,0.3)]">📞 {BRAND.phoneDisplay}</a>
                </div>
              </div>
              <div className="feature-card p-8 rounded-giant bg-[rgba(123,97,255,0.08)] backdrop-blur-md border border-[#7B61FF]/30 hover:border-[#9B8FFF] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-[#7B61FF]/20 flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-[#7B61FF]" />
                </div>
                <h3 className="font-semibold text-xl text-[#7B61FF]">Uygun Fiyat</h3>
                <p className="text-sm opacity-80 mt-2">Bütçenize uygun, en iyi fiyat garantisi.</p>
              </div>
            </div>
          </div>
        </section>

        <ProtocolStack brand={BRAND} />

        <section id="pricing" className="py-40 px-6 bg-gradient-to-b from-[#0D0B18] to-[#080612] relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(123, 97, 255, 0.1) 0%, transparent 50%)'}} />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="p-10 rounded-giant bg-gradient-to-br from-[#7B61FF] to-[#6A4DD9] text-white border border-[#9B8FFF] shadow-2xl shadow-[#7B61FF]/50 text-center">
              <div className="font-mono text-sm opacity-70 mb-2">İLETİŞİM</div>
              <div className="text-3xl font-bold mt-4">Bize Ulaşın</div>
              <p className="mt-4 opacity-80 text-sm max-w-md mx-auto">Fiyat bilgisi ve tüm sorularınız için bize Letgo'dan veya telefonla ulaşabilirsiniz.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a className="magnetic-btn px-6 py-3 rounded-full bg-white text-[#7B61FF] font-semibold hover:bg-[#F0EFF4] transition-all" href={BRAND.letgo} target="_blank" rel="noreferrer">Letgo'dan Bize Ulaşın</a>
                <a className="magnetic-btn px-6 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-all" href={`tel:${BRAND.phone}`}>
                  <Phone size={16} className="inline mr-2" />{BRAND.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gradient-to-t from-[#050308] via-[#0A0814] to-transparent rounded-t-[4rem] mt-40 p-16 border-t border-[#7B61FF]/20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div>
              <div className="font-bold text-2xl bg-gradient-to-r from-[#7B61FF] to-[#F0EFF4] bg-clip-text text-transparent">{BRAND.name}</div>
              <div className="text-sm opacity-60 mt-4">{BRAND.purpose}</div>
            </div>
            <div className="text-sm opacity-60 text-center pt-4 border-l border-r border-[#7B61FF]/20 flex items-center justify-center gap-2">
              <MapPin size={16} className="text-[#7B61FF]" /> {BRAND.location}
            </div>
            <div className="text-sm text-right">
              <div className="flex items-center gap-2 justify-end"><span className="w-3 h-3 bg-[#7B61FF] rounded-full animate-pulse"/> <span className="font-mono text-[#7B61FF]">Sistem Çalışıyor</span></div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}


function ProtocolStack({brand}){
  const ref = useRef(null)
  useEffect(()=>{
    const ctx = gsap.context(()=>{
      const sections = gsap.utils.toArray('.stack-card')
      sections.forEach((card,i)=>{
        const tl = gsap.timeline({
          scrollTrigger:{
            trigger: card,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: true,
            pinSpacing: true,
          }
        })
        tl.to(card, {scale:1, duration:0.6})
      })

      // stack undercards effect - more subtle
      gsap.to('.stack-card:not(:first-child)',{
        scrollTrigger:{
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          markers: false
        },
        scale: 0.95,
        filter: 'blur(10px)',
        opacity: 0.6,
        stagger: 0.2,
        y: 20
      })
    }, ref)
    return ()=> ctx.revert()
  },[])

  return (
    <section id="protocol" ref={ref} className="relative py-40">
      <div className="stack-card h-screen flex items-center justify-center text-center p-12 my-20">
        <div className="w-96 h-96 rounded-full bg-[rgba(123,97,255,0.15)] backdrop-blur-md border-2 border-[#7B61FF] shadow-2xl flex items-center justify-center" style={{boxShadow: '0 0 60px rgba(123, 97, 255, 0.4)'}}>
          <div className="text-center">
            <div className="font-mono text-sm opacity-60 mb-2">01</div>
            <h3 className="text-3xl font-bold text-[#7B61FF]">{brand.name}</h3>
            <p className="text-2xl font-bold mt-2">Seçimi</p>
            <p className="mt-4 opacity-80 text-sm max-w-xs mx-auto">{brand.purpose}</p>
          </div>
        </div>
      </div>

      <div className="stack-card h-screen flex items-center justify-center bg-gradient-to-br from-[rgba(123,97,255,0.12)] to-[rgba(8,6,18,0.8)] backdrop-blur-sm text-center p-12 my-20 border-t border-[#7B61FF]/30">
        <div>
          <div className="font-mono text-sm opacity-50 mb-4 text-[#7B61FF]">02</div>
          <h3 className="text-4xl font-bold mt-6 bg-gradient-to-r from-[#F0EFF4] to-[#7B61FF] bg-clip-text text-transparent">Müşteri Hizmeti</h3>
          <p className="mt-6 opacity-80 max-w-2xl mx-auto text-lg">Profesyonel kurulum ve teknik destek — her alan için.</p>
        </div>
      </div>

      <div className="stack-card h-screen flex items-center justify-center bg-gradient-to-br from-[#7B61FF]/15 to-[rgba(15,10,25,0.95)] backdrop-blur-md text-center p-12 my-20 border-t border-[#7B61FF]/40">
        <div>
          <div className="font-mono text-sm opacity-50 mb-4 text-[#7B61FF]">03</div>
          <h3 className="text-4xl font-bold mt-6 bg-gradient-to-r from-[#9B8FFF] to-[#F0EFF4] bg-clip-text text-transparent">Kalite Taahhüdü</h3>
          <p className="mt-6 opacity-90 max-w-2xl mx-auto text-lg">Garantili cihazlar ve uzun vadeli memnuniyet.</p>
        </div>
      </div>
    </section>
  )
}