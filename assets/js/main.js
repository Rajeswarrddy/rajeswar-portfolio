/* Rajeswar Reddy Pondugula — portfolio scripts */
(function(){
  'use strict';

  /* ---------- navigation ---------- */
  var nav=document.getElementById('nav'),menuBtn=document.getElementById('menu-btn');
  function closeMenu(){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu');}
  menuBtn.addEventListener('click',function(){var o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o));menuBtn.setAttribute('aria-label',o?'Close menu':'Open menu');});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});

  var ids=['about','experience','projects','skills','lab','education','contact'];
  var links=[].slice.call(nav.querySelectorAll('a'));
  function spy(){
    var cur=0,y=window.scrollY+130;
    ids.forEach(function(id,i){var el=document.getElementById(id);if(el&&el.getBoundingClientRect().top+window.scrollY<=y)cur=i;});
    links.forEach(function(l,i){if(i===cur)l.setAttribute('aria-current','true');else l.removeAttribute('aria-current');});
  }
  window.addEventListener('scroll',spy,{passive:true});window.addEventListener('resize',spy);spy();

  /* ---------- reveal on scroll ---------- */
  var targets=document.querySelectorAll('.sec,.contact');
  targets.forEach(function(el){el.classList.add('reveal');});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.04,rootMargin:'0px 0px -30px 0px'});
    targets.forEach(function(el){io.observe(el);});
  }else targets.forEach(function(el){el.classList.add('in');});

  /* ---------- pipeline lab (simulation) ---------- */
  var flow=document.getElementById('flow');
  if(!flow)return;
  var GROUPS=[{id:'validate',name:'Validate'},{id:'dev',name:'Dev'},{id:'test',name:'Test'},{id:'prod',name:'Prod'}];
  var STEPS=[
    {id:'fmt',g:'validate',label:'terraform fmt',type:'check'},
    {id:'validate',g:'validate',label:'terraform validate',type:'check'},
    {id:'tflint',g:'validate',label:'TFLint',type:'check'},
    {id:'checkov',g:'validate',label:'Checkov security scan',type:'check'},
    {id:'plan',g:'validate',label:'Save plan as artifact',type:'plan'},
    {id:'dev',g:'dev',label:'Apply saved plan to dev',type:'apply',env:'dev'},
    {id:'gate-test',g:'test',label:'Manual approval gate',type:'gate',env:'test'},
    {id:'test',g:'test',label:'Apply the same plan to test',type:'apply',env:'test'},
    {id:'gate-prod',g:'prod',label:'Manual approval gate',type:'gate',env:'prod'},
    {id:'prod',g:'prod',label:'Apply the same plan to prod',type:'apply',env:'prod'}
  ];
  var FAIL={
    fmt:'terraform fmt -check found 1 file that is not formatted (modules/network/main.tf)',
    validate:'terraform validate: reference to an undeclared variable "subnet_prefix"',
    tflint:'TFLint: invalid VM size in the node pool configuration',
    checkov:'Checkov: 1 failed check, storage account allows public network access'
  };
  var ICON={pending:'',running:'…',passed:'✓',failed:'✕',rejected:'✕',waiting:'‖',skipped:'–'};
  var DELAY=520;
  var st={status:{},idx:0,running:false,done:false,timer:null,log:[],applied:[],scenario:'clean',autoplay:true};

  function $(id){return document.getElementById(id);}
  function reset(){
    if(st.timer)clearTimeout(st.timer);
    st.status={};STEPS.forEach(function(s){st.status[s.id]='pending';});
    st.idx=0;st.running=false;st.done=false;st.log=[];st.applied=[];
    st.scenario=document.querySelector('input[name=scen]:checked').value;
    $('run').disabled=false;$('run').textContent='Run pipeline';
    $('result').className='result';$('result').textContent='Choose a scenario and run the pipeline.';
    draw();
  }
  function line(txt,cls){st.log.push({t:txt,c:cls||''});}
  function draw(){
    flow.textContent='';
    GROUPS.forEach(function(g){
      var col=document.createElement('div');col.className='col';
      var h=document.createElement('h4');h.textContent=g.name;col.appendChild(h);
      var ol=document.createElement('ol');
      STEPS.filter(function(s){return s.g===g.id;}).forEach(function(s){
        var li=document.createElement('li');var status=st.status[s.id];li.className='stp '+status;
        var ic=document.createElement('span');ic.className='ico';ic.setAttribute('aria-hidden','true');ic.textContent=ICON[status];
        var body=document.createElement('div');
        var lab=document.createElement('span');lab.textContent=s.label;
        var sr=document.createElement('span');sr.style.cssText='position:absolute;left:-9999px';sr.textContent=' — '+status;
        body.appendChild(lab);body.appendChild(sr);
        if(status==='waiting'){
          var gb=document.createElement('div');gb.className='gbtn';
          var ok=document.createElement('button');ok.type='button';ok.className='ok';ok.textContent='Approve';ok.addEventListener('click',function(){decide(true);});
          var no=document.createElement('button');no.type='button';no.className='no';no.textContent='Reject';no.addEventListener('click',function(){decide(false);});
          gb.appendChild(ok);gb.appendChild(no);body.appendChild(gb);
        }
        li.appendChild(ic);li.appendChild(body);ol.appendChild(li);
      });
      col.appendChild(ol);flow.appendChild(col);
    });
    var t=$('term');t.textContent='';
    st.log.forEach(function(l){var s=document.createElement('span');s.className=l.c;s.textContent=l.t+'\n';t.appendChild(s);});
    t.scrollTop=t.scrollHeight;
  }
  function skipRest(from){for(var i=from;i<STEPS.length;i++){if(st.status[STEPS[i].id]==='pending')st.status[STEPS[i].id]='skipped';}}
  function finish(){
    st.running=false;st.done=true;$('run').disabled=false;$('run').textContent='Run again';
    var r=$('result'),ap=st.applied;
    if(ap.length===3){r.className='result good';r.textContent='Success: the same saved plan reached dev, test and prod.';}
    else{r.className='result bad';
      var failed=STEPS.filter(function(s){return st.status[s.id]==='failed'||st.status[s.id]==='rejected';})[0];
      var where=failed?(failed.type==='gate'?'Rejected at the '+failed.env+' approval gate':'Stopped at "'+failed.label+'"'):'Stopped';
      r.textContent=where+'. '+(ap.length?'Applied to: '+ap.join(', ')+'.':'Nothing was applied to any environment.');}
    draw();
  }
  function step(){
    if(st.done)return;
    var s=STEPS[st.idx];
    if(!s){finish();return;}
    if(s.type==='gate'){
      st.status[s.id]='waiting';line('⏸ Waiting for approval to promote to '+s.env,'wait');draw();
      $('result').className='result';$('result').textContent='Approval needed for '+s.env+'. Choose Approve or Reject.';
      return; // continues when decide() is called
    }
    var fail=FAIL[s.id]&&st.scenario===s.id;
    if(fail){
      st.status[s.id]='failed';line('✕ '+FAIL[s.id],'bad');line('Pipeline stopped. Remaining stages skipped.','dim');
      skipRest(st.idx+1);finish();return;
    }
    st.status[s.id]='passed';
    if(s.type==='check')line('✓ '+s.label+' passed','okk');
    else if(s.type==='plan')line('✓ Terraform plan saved as a pipeline artifact','okk');
    else{st.applied.push(s.env);line('✓ Applied the saved plan to '+s.env,'okk');}
    st.idx++;draw();
    if(st.autoplay)st.timer=setTimeout(step,DELAY);
  }
  function decide(ok){
    var s=STEPS[st.idx];if(!s||s.type!=='gate'||st.status[s.id]!=='waiting')return;
    if(ok){st.status[s.id]='passed';line('✓ '+s.env+' approved by reviewer','okk');st.idx++;draw();
      $('result').className='result';$('result').textContent='Running…';
      if(st.autoplay)st.timer=setTimeout(step,DELAY);}
    else{st.status[s.id]='rejected';line('✕ '+s.env+' rejected by reviewer. Pipeline stopped.','bad');skipRest(st.idx+1);finish();}
  }
  function run(){
    if(st.running&&!st.done)return;
    if(st.done)reset();
    st.running=true;$('run').disabled=true;$('run').textContent='Running…';
    line('$ pipeline started · scenario: '+document.querySelector('input[name=scen]:checked').nextElementSibling.textContent,'dim');
    $('result').className='result';$('result').textContent='Running…';draw();
    st.timer=setTimeout(step,300);
  }
  $('run').addEventListener('click',run);
  $('reset').addEventListener('click',reset);
  document.querySelectorAll('input[name=scen]').forEach(function(i){i.addEventListener('change',reset);});
  // handle for automated checks
  window.__pipeline={st:st,STEPS:STEPS,step:step,decide:decide,reset:reset,
    start:function(){st.autoplay=false;if(st.done)reset();st.running=true;line('$ start','dim');},};
  reset();
})();
