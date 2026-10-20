const DATA_URL = 'data/project.json';
let projectData = null;
let chartInstance = null;
const statusLabels = {'pendiente':'Pendiente','en curso':'En curso','por verificar':'Por verificar','propuesto':'Propuesto','completado':'Completado'};
const statusClass = s => ({'pendiente':'pending','en curso':'inprogress','por verificar':'verify','propuesto':'proposed','completado':'done'}[s] || 'proposed');
const statusLabel = s => statusLabels[s] || s;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderStats(data) {
  const tasks = data.tasks || [];
  const stats = [
    {label:'Resultados de aprendizaje',value:(data.results||[]).length,detail:'Estructura de seguimiento'},
    {label:'Tutorías proyectadas',value:(data.tutorials||[]).length,detail:'Pendientes de concertación'},
    {label:'Tareas en registro',value:tasks.length,detail:'Sin convertir en porcentaje'},
    {label:'Por verificar',value:tasks.filter(t=>t.status==='por verificar').length,detail:'Requieren revisar evidencias'}
  ];
  document.getElementById('statsGrid').innerHTML = stats.map(s=>`<article class="stat-card"><span class="stat-label">${esc(s.label)}</span><strong class="stat-value">${esc(s.value)}</strong><span class="stat-detail">${esc(s.detail)}</span></article>`).join('');
}
function renderResults(data) {
  document.getElementById('resultsGrid').innerHTML = (data.results||[]).map(r=>`<article class="result-card"><div class="result-head"><span class="result-number">0${esc(r.id)}</span><span class="status-badge ${statusClass(r.status)}">${esc(statusLabel(r.status))}</span></div><h3>${esc(r.short || r.title)}</h3><p>${esc(r.description)}</p><h4>Evidencias a revisar</h4><ul class="evidence-list">${(r.evidence||[]).map(e=>`<li>${esc(e)}</li>`).join('')}</ul></article>`).join('');
}
function renderTutorials(data) {
  document.getElementById('tutorialList').innerHTML = (data.tutorials||[]).map(t=>`<article class="timeline-item"><span class="timeline-dot"></span><h3>${esc(t.number)}. ${esc(t.title)}</h3><p>${esc(t.focus)}</p><div class="timeline-deliverable"><strong>Producto previsto:</strong> ${esc(t.doctoral_deliverable)}</div><p style="margin-top:6px"><span class="status-badge ${statusClass(t.status)}">${esc(statusLabel(t.status))}</span></p></article>`).join('');
}
function renderTasks(data, filter='all') {
  const tasks = (data.tasks||[]).filter(t=>filter==='all'||t.status===filter);
  document.getElementById('taskList').innerHTML = tasks.map(t=>`<article class="task-item"><div><h3>${esc(t.title)}</h3><span class="task-meta">${esc(t.id)} · ${esc(t.category)}</span></div><span class="status-badge ${statusClass(t.status)}">${esc(statusLabel(t.status))}</span><p>${esc(t.detail)}</p></article>`).join('') || '<p class="small-note">No hay tareas para este filtro.</p>';
}
function renderChart(data) {
  const canvas=document.getElementById('statusChart');
  if(!canvas||typeof Chart==='undefined'){canvas?.insertAdjacentHTML('afterend','<p class="small-note">La gráfica requiere conexión a internet para cargar Chart.js.</p>');return;}
  const statuses=['pendiente','en curso','por verificar','propuesto','completado'];
  const values=statuses.map(s=>(data.tasks||[]).filter(t=>t.status===s).length);
  if(chartInstance) chartInstance.destroy();
  chartInstance=new Chart(canvas,{type:'bar',data:{labels:statuses.map(statusLabel),datasets:[{label:'Tareas registradas',data:values,backgroundColor:['#f1dfb8','#dceee3','#e9e2f5','#e3e8ec','#cce7d5'],borderRadius:7,maxBarThickness:48}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.raw} tarea(s)`}}},scales:{x:{beginAtZero:true,ticks:{precision:0},grid:{color:'#edf1ee'}},y:{grid:{display:false}}}}});
}
function exportData() {
  const blob=new Blob([JSON.stringify(projectData,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='project-status.json';a.click();URL.revokeObjectURL(url);
}
async function init() {
  try {
    const response=await fetch(DATA_URL);
    if(!response.ok) throw new Error('No se pudo cargar data/project.json');
    projectData=await response.json();
    renderStats(projectData);renderResults(projectData);renderTutorials(projectData);renderTasks(projectData);renderChart(projectData);
    document.getElementById('taskFilter').addEventListener('change',e=>renderTasks(projectData,e.target.value));
    document.getElementById('exportBtn').addEventListener('click',exportData);
    const updated=document.getElementById('lastUpdated');
    if(updated) updated.textContent=`Versión de datos: ${projectData.project?.updated || 'sin fecha'}`;
  } catch(error) {
    document.getElementById('statsGrid').innerHTML='<p class="small-note">No se pudo cargar el archivo de datos. Abre el sitio mediante un servidor local o una publicación web configurada; no directamente como file://.</p>';
    console.error(error);
  }
}
document.addEventListener('DOMContentLoaded',init);
