(()=>{
 const buttons=[...document.querySelectorAll('[data-category]')],groups=[...document.querySelectorAll('.service-group')],keys=buttons.map(b=>b.dataset.category),select=document.querySelector('#service'),status=document.querySelector('#category-status');let active='sites';
 function activate(key,update=false,announce=true){
  if(!keys.includes(key))key='sites';if(update)history.replaceState({category:active},'',location.href);active=key;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===key)));
  groups.forEach(g=>g.hidden=g.id!=='service-'+key);select.selectedIndex=keys.indexOf(key);
  if(announce)status.textContent=buttons[keys.indexOf(key)].textContent+': показано три примера.';
  if(update&&location.hash!=='#service-'+key)history.pushState({category:key},'','#service-'+key);
 }
 function hash(){if(location.hash==='#paprika-case')return 'sites';return location.hash.replace('#service-','')}
 activate(hash(),false,false);
 buttons.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.category,true)));
 history.replaceState({category:active},'',location.href);addEventListener('popstate',event=>{if(location.hash==='#napisat')return;activate(event.state?.category||hash())});addEventListener('hashchange',()=>{if(location.hash.startsWith('#service-')||location.hash==='#paprika-case')activate(hash())});
 document.querySelectorAll('a[href="#napisat"]').forEach(a=>a.addEventListener('click',()=>{select.selectedIndex=keys.indexOf(active)}));
})();

