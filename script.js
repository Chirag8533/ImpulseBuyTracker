var items=JSON.parse(localStorage.getItem('impulse')||'[]');
var cur='all';
var emojis={Electronics:'🎧',Food:'🍕',Clothes:'👕',Gaming:'🎮',Books:'📚',Other:'🛍️'};

document.getElementById('iDate').valueAsDate=new Date();

function save(){
  localStorage.setItem('impulse',JSON.stringify(items));
}

function addItem(){
  var n=document.getElementById('iName').value.trim();
  var a=parseFloat(document.getElementById('iAmt').value);
  var c=document.getElementById('iCat').value;
  var m=document.getElementById('iMood').value;
  var d=document.getElementById('iDate').value;
  if(!n||!a||a<=0){
    alert('Enter name and a valid amount');
    return;
  }
  items.unshift({id:Date.now(),name:n,amount:a,cat:c,mood:m,date:d});
  document.getElementById('iName').value='';
  document.getElementById('iAmt').value='';
  document.getElementById('iMood').value='unsure';
  document.getElementById('iDate').valueAsDate=new Date();
  save();
  render();
  updateStats();
}

function del(id){
  items=items.filter(function(x){return x.id!==id;});
  save();
  render();
  updateStats();
}

function filter(f,el){
  cur=f;
  document.querySelectorAll('.ftab').forEach(function(t){t.classList.remove('active');});
  el.classList.add('active');
  render();
}

function render(){
  var list=document.getElementById('list');
  var data=cur==='all'?items:items.filter(function(x){return x.mood===cur;});
  if(!data.length){
    list.innerHTML='<div class="empty"><div class="big">🧾</div>No purchases logged yet.</div>';
    return;
  }
  list.innerHTML=data.map(function(x){
    var lb=x.mood==='regret'?'Regret':x.mood==='fine'?'Worth it':'Unsure';
    return '<div class="item">'+
      '<div class="icon">'+emojis[x.cat]+'</div>'+
      '<div class="info"><div class="iname">'+x.name+'</div><div class="imeta">'+x.cat+' &nbsp;•&nbsp; '+x.date+'</div></div>'+
      '<div class="iright">'+
        '<div class="iprice">₹'+x.amount.toLocaleString()+'</div>'+
        '<div class="badge '+x.mood+'">'+lb+'</div>'+
        '<button class="del" onclick="del('+x.id+')">✕</button>'+
      '</div>'+
    '</div>';
  }).join('');
}

function updateStats(){
  var total=items.reduce(function(s,x){return s+x.amount;},0);
  var reg=items.filter(function(x){return x.mood==='regret';}).length;
  var rate=items.length?Math.round((reg/items.length)*100):0;
  document.getElementById('sTotal').textContent='₹'+total.toLocaleString();
  document.getElementById('sRegret').textContent=rate+'%';
  document.getElementById('sCount').textContent=items.length;
}

render();
updateStats();