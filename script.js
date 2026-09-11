const monthly = {
  labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
  sales:[6.80,6.25,6.58,6.60,6.77,6.52,6.63,6.75]
};
const quarters = [
  {q:"Q1", sales:19.70},
  {q:"Q2", sales:19.90},
  {q:"Q3", sales:13.40}
];
const cities = [
  {name:"Bengaluru",sales:5.50},{name:"Lucknow",sales:3.10},
  {name:"Hyderabad",sales:3.00},{name:"Mumbai",sales:3.00},{name:"New Delhi",sales:2.80}
];

function setupCanvas(canvas, labels, values){
  const ctx=canvas.getContext("2d");
  function draw(){
    const dpr=window.devicePixelRatio||1, rect=canvas.getBoundingClientRect();
    canvas.width=rect.width*dpr; canvas.height=rect.height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const w=rect.width,h=rect.height,p={l:45,r:18,t:18,b:38};
    ctx.clearRect(0,0,w,h);
    const max=Math.ceil(Math.max(...values)*10)/10+0.1, min=Math.floor(Math.min(...values)*10)/10-0.1;
    const x=i=>p.l+(w-p.l-p.r)*(i/(values.length-1)), y=v=>p.t+(h-p.t-p.b)*(1-(v-min)/(max-min));
    ctx.font="12px Segoe UI, Arial"; ctx.textAlign="right";
    for(let k=0;k<6;k++){const v=min+(max-min)*k/5, yy=y(v);ctx.strokeStyle="#e9eef3";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();ctx.fillStyle="#8090a3";ctx.fillText("₹"+v.toFixed(1)+"M",p.l-8,yy+4);}
    ctx.textAlign="center"; labels.forEach((lab,i)=>{ctx.fillStyle="#8090a3";ctx.fillText(lab,x(i),h-12)});
    ctx.beginPath();values.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.lineTo(x(values.length-1),h-p.b);ctx.lineTo(x(0),h-p.b);ctx.closePath();ctx.fillStyle="rgba(255,122,24,.13)";ctx.fill();
    ctx.beginPath();values.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle="#ff7a18";ctx.lineWidth=3;ctx.stroke();
    values.forEach((v,i)=>{ctx.beginPath();ctx.arc(x(i),y(v),5,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#ff7a18";ctx.lineWidth=3;ctx.stroke()});
  }
  draw();window.addEventListener("resize",draw);
}
function renderBars(){
  const box=document.getElementById("quarterBars"); const max=Math.max(...quarters.map(x=>x.sales));
  box.innerHTML=quarters.map(x=>`<div class="bar-col"><strong>₹${x.sales.toFixed(1)}M</strong><div class="bar" style="height:${(x.sales/max)*82}%"></div><span>${x.q}</span></div>`).join("");
}
function renderCities(){
  const max=cities[0].sales;
  document.getElementById("cityList").innerHTML=cities.map(x=>`<div class="city-row"><span>${x.name}</span><div class="track"><i style="width:${x.sales/max*100}%"></i></div><strong>₹${x.sales.toFixed(1)}M</strong></div>`).join("");
  document.getElementById("geoCities").innerHTML=cities.map(x=>`<div class="geo-city"><h3>${x.name}</h3><strong>₹${x.sales.toFixed(1)}M</strong><p class="muted">Displayed top-market sales</p></div>`).join("");
}
function activate(section){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active-section"));
  document.getElementById(section).classList.add("active-section");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.section===section));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>activate(b.dataset.section)));
document.getElementById("resetFilters").addEventListener("click",()=>{
  document.getElementById("monthFilter").value="all";
  document.getElementById("foodFilter").value="all";
  document.getElementById("cityFilter").value="all";
});
renderBars();renderCities();
setupCanvas(document.getElementById("salesChart"),monthly.labels,monthly.sales);
setupCanvas(document.getElementById("trendChart"),monthly.labels,monthly.sales);
