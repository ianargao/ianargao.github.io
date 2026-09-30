const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$('.burger').onclick=()=>$('.links').classList.toggle('open');
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const up=$('.up');addEventListener('scroll',()=>up.style.display=scrollY>400?'block':'none');
up.onclick=()=>scrollTo({top:0});
const t=$('.type');if(t){const w=JSON.parse(t.dataset.w);let i=0,c=0,d=0;
(function k(){const s=w[i];t.firstChild.textContent=s.slice(0,c);
if(!d&&c++==s.length){d=1;return setTimeout(k,1600)}
if(d&&c--==0){d=0;i=(i+1)%w.length}setTimeout(k,d?35:70)})()}
const ph=$$('.hero .photo img');if(ph.length>1){let n=0;setInterval(()=>{ph[n].classList.remove('on');n=(n+1)%ph.length;ph[n].classList.add('on')},5000)}
const fb=$$('.filters .btn');fb.forEach(b=>b.onclick=()=>{fb.forEach(x=>x.classList.remove('on'));b.classList.add('on');
$$('.proj').forEach(p=>p.classList.toggle('hide',b.dataset.f!=='all'&&p.dataset.c!==b.dataset.f))});
const m=$('.modal');$$('.proj').forEach(p=>p.onclick=()=>{$('h3',m).textContent=$('h3',p).textContent;
$('.md',m).textContent=p.dataset.d;$('.mt',m).innerHTML=$('.tags',p).innerHTML;m.classList.add('open')});
if(m){m.onclick=e=>{if(e.target===m||e.target.closest('.x'))m.classList.remove('open')};
addEventListener('keydown',e=>e.key==='Escape'&&m.classList.remove('open'))}
const f=$('#cf');if(f)f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);
const u='https://mail.google.com/mail/?view=cm&fs=1&to=YOUR_EMAIL@gmail.com&su='+encodeURIComponent(d.get('subject'))+'&body='+encodeURIComponent(d.get('message')+'\n\nFrom: '+d.get('name')+' ('+d.get('email')+')');
open(u,'_blank')};

$$('.links a').forEach(a=>a.addEventListener('click',()=>$('.links').classList.remove('open')));
const sp=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.links a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('#home,#about,#projects,#features,#hobbies,#contact,#vlog').forEach(el=>sp.observe(el));
