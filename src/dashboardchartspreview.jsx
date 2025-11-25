
import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  ReferenceLine,
  Brush,
} from "recharts";

/* sample data */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul"];
const timeData = months.map((m,i)=>({
  name:m,
  value: Math.round(200 + Math.sin(i/1.2)*60 + i*10),
  value2: Math.round(160 + Math.cos(i/1.1)*50 + i*8),
  actual: Math.round(150 + Math.random()*120),
  target: Math.round(200 + Math.random()*100),
  diff: Math.round(Math.random()*140 - 70),
}));
const pieData = [
  { category:'Engineering', count:400, cost:8000},
  { category:'Sales', count:300, cost:4500},
  { category:'Support', count:200, cost:2500},
  { category:'Ops', count:150, cost:1800},
];
const radarData = [
  { subject:'Speed', A:120, B:110},
  { subject:'Quality', A:98, B:130},
  { subject:'Accuracy', A:86, B:95},
  { subject:'UX', A:99, B:100},
  { subject:'Value', A:85, B:90},
];
const kpis = [
  { title:'Active Users', value:13420, change:4.2, series:[10,12,8,16,20,24,26]},
  { title:'Processed Tasks', value:482340, change:-2.4, series:[200,300,250,280,320,300,290]},
  { title:'SLA', value:98.2, change:0.6, series:[92,95,97,98,99,98,98.2]},
  { title:'Utilization', value:76, change:3.1, series:[60,62,65,70,72,74,76]},
];
const COLORS = ['#4F46E5','#06B6D4','#F97316','#10B981','#F43F5E'];

function Panel({title, children, style={}}){
  return (
    <div style={{background:'var(--panel)', borderRadius:10, padding:12, color:'var(--text)', boxSizing:'border-box', ...style}}>
      {title && <div style={{fontWeight:700, marginBottom:8}}>{title}</div>}
      <div style={{width:'100%', height:'calc(100% - 28px)'}}>{children}</div>
    </div>
  )
}

function MiniSpark({points=[], color='#4F46E5', height=36}){
  const d = points.map((y,i)=>({x:i,y}));
  return (
    <div style={{width:120, height}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={d}><Line dataKey="y" stroke={color} dot={false} strokeWidth={2} /></LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function GlobalTooltip({active, payload, label}){
  if(!active || !payload || payload.length===0) return null;
  return (
    <div style={{background:'#071226', color:'#fff', padding:8, borderRadius:6, fontSize:12}}>
      <div style={{color:'#94a3b8', marginBottom:6}}>{label}</div>
      {payload.map((p,i)=>(<div key={i} style={{display:'flex', justifyContent:'space-between'}}><div style={{color:p.color||'#fff'}}>{p.name||p.dataKey}</div><div style={{fontWeight:700}}>{p.value}</div></div>))}
    </div>
  )
}

/* Geo mock */
function GeoMapMock({onSelect}){
  const regions = [
    {id:'north', name:'North', color:'#60a5fa', path:'M10 10 L110 30 L90 90 L30 70 Z', metric:120},
    {id:'south', name:'South', color:'#34d399', path:'M130 120 L230 140 L210 200 L150 180 Z', metric:80},
    {id:'east', name:'East', color:'#f97316', path:'M250 20 L350 40 L330 100 L270 80 Z', metric:300},
  ];
  const [hover,setHover]=useState(null);
  const [sel,setSel]=useState(null);
  return (
    <div style={{display:'flex', gap:12}}>
      <svg viewBox="0 0 380 220" style={{width:'100%', height:280}}>
        {regions.map(r=>(
          <g key={r.id} onMouseEnter={()=>setHover(r)} onMouseLeave={()=>setHover(null)} onClick={()=>{setSel(r); onSelect&&onSelect(r)}} style={{cursor:'pointer'}}>
            <path d={r.path} fill={r.color} stroke="#001122" strokeWidth={2} opacity={sel && sel.id===r.id?1:0.9} />
            <text x={parseInt(r.path.split(' ')[1])||20} y={parseInt(r.path.split(' ')[2])||30} fill="#001" fontSize="11">{r.name}</text>
          </g>
        ))}
      </svg>
      <div style={{minWidth:200}}>
        <div style={{fontWeight:700, marginBottom:6}}>Region Info</div>
        {hover ? (<div><div>{hover.name}</div><div style={{color:'#94a3b8'}}>Metric: {hover.metric}</div></div>)
        : sel ? (<div><div>{sel.name} (selected)</div><div style={{color:'#94a3b8'}}>Metric: {sel.metric}</div></div>)
        : <div style={{color:'#94a3b8'}}>Hover or click a region</div>}
      </div>
    </div>
  )
}

/* Radial stack */
function RadialStack({layers=[{label:'A',value:72},{label:'B',value:46},{label:'C',value:85}], size=220, palette=COLORS}){
  const spacing=14; const center=size/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${center},${center})`}>
        {layers.map((l,i)=>{
          const r=(size/2)-i*(spacing+6);
          const end=(l.value/100)*360;
          const startAngle=-90; const endAngle=startAngle+end;
          const startRad=(Math.PI/180)*startAngle; const endRad=(Math.PI/180)*endAngle;
          const sx=r*Math.cos(startRad); const sy=r*Math.sin(startRad);
          const ex=r*Math.cos(endRad); const ey=r*Math.sin(endRad);
          const large=end>180?1:0;
          const d=`M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
          return (<g key={i}><path d={`M ${-r} 0 A ${r} ${r} 0 1 1 ${r} 0`} stroke="#0e1b2b" strokeWidth={10} fill="none" opacity={0.3} /><path d={d} stroke={palette[i%palette.length]} strokeWidth={10} fill="none" strokeLinecap="round" /><text x={r+8} y={-i*(spacing+2)} fontSize={10} fill="#cbd5e1">{l.label}</text></g>)
        })}
      </g>
    </svg>
  )
}

/* Widgets */
function LineSimple({dots=true, smooth=true, multi=false, threshold=null}){
  return (
    <Panel title="Line — Simple / Variants" style={{height:420}}>
      <div style={{width:'100%', height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData} margin={{top:8, right:24, bottom:8}}>
            <CartesianGrid stroke="#183045" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#9fb1c8" />
            <YAxis stroke="#9fb1c8" />
            <ReTooltip content={<GlobalTooltip />} />
            <Legend />
            <Line type={smooth?"monotone":"linear"} dataKey="value" stroke={COLORS[0]} dot={dots?{r:3}:false} strokeWidth={2} name="Series A" />
            {multi && <Line type={smooth?"monotone":"linear"} dataKey="value2" stroke={COLORS[1]} dot={dots?{r:3}:false} strokeWidth={2} name="Series B" />}
            {threshold !== null && <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 4" label={{value:`Threshold ${threshold}`, fill:'#ef4444'}} />}
            <Brush dataKey="name" height={20} stroke="#274155" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function PieSimple({withLabels=true}){
  const data = pieData.map(d=>({...d, value:d.count}));
  return (
    <Panel title="Pie — Simple / Labels / Donut / Dynamic Key" style={{height:420}}>
      <div style={{width:'100%', height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ReTooltip content={<GlobalTooltip />} />
            <Legend />
            <Pie data={data} dataKey="value" nameKey="category" innerRadius={0} outerRadius={100} label={withLabels}>
              {data.map((entry,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function PieDonut({keyName='count'}){
  const data = pieData.map(d=>({...d, value:d[keyName]||d.count}));
  return (
    <Panel title="Pie — Donut / Data Key" style={{height:420}}>
      <div style={{width:'100%', height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ReTooltip content={<GlobalTooltip />} />
            <Legend />
            <Pie data={data} dataKey="value" nameKey="category" innerRadius={60} outerRadius={100} label>
              {data.map((entry,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function PieSpeedometer({value=72}){
  return (
    <Panel title="Pie — Speedometer / Gauge" style={{height:240}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:200}}>
        <ResponsiveContainer width={260} height={180}>
          <RadialBarChart innerRadius="50%" outerRadius="95%" data={[{name:'KPI', value}]} startAngle={180} endAngle={0}>
            <RadialBar dataKey="value" cornerRadius={10} fill={COLORS[1]} />
            <ReTooltip content={<GlobalTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function AreaSimple({stacked=false, smooth=true}){
  return (
    <Panel title="Area — Simple / Stacked / Linear" style={{height:420}}>
      <div style={{height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeData}>
            <CartesianGrid stroke="#183045" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#9fb1c8" />
            <YAxis stroke="#9fb1c8" />
            <ReTooltip content={<GlobalTooltip />} />
            <Area type={smooth?"monotone":"linear"} dataKey="value" stackId={stacked?'a':undefined} stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.16} />
            {stacked && <Area type={smooth?"monotone":"linear"} dataKey="value2" stackId="a" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.16} />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function BarSimple({orientation='vertical', multiple=false, barInBar=false, stacked=false, posneg=false}){
  const isHorizontal = orientation === 'horizontal';
  const data = posneg ? timeData.map(d=>({...d, value: d.value-240})) : timeData;
  return (
    <Panel title="Bar — Vertical/Horizontal / Multiple / Bar-in-Bar / Stacked / Pos/Neg" style={{height:420}}>
      <div style={{height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout={isHorizontal ? 'vertical' : 'horizontal'}>
            <CartesianGrid stroke="#183045" strokeDasharray="3 3" />
            <XAxis type={isHorizontal ? 'number' : 'category'} dataKey={isHorizontal?undefined:'name'} stroke="#9fb1c8" />
            <YAxis type={isHorizontal ? 'category' : 'number'} dataKey={isHorizontal?'name':undefined} stroke="#9fb1c8" />
            <ReTooltip content={<GlobalTooltip />} />
            <Legend />
            {!barInBar && <Bar dataKey="value" fill={COLORS[0]} stackId={stacked?'grp':undefined} />}
            {multiple && !barInBar && <Bar dataKey="value2" fill={COLORS[1]} stackId={stacked?'grp':undefined} />}
            {barInBar && (<><Bar dataKey="target" fill={COLORS[1]} barSize={30} /><Bar dataKey="actual" fill={COLORS[0]} barSize={12} /></>)}
            {posneg && <ReferenceLine y={0} stroke="#94a3b8" />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function RadarSimple({lines=true, dots=true}){
  return (
    <Panel title="Radar — Lines & Dots" style={{height:420}}>
      <div style={{height:360}}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            {lines && <Radar name="A" dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.12} />}
            {dots && <Radar name="B" dataKey="B" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.08} />}
            <Legend />
            <ReTooltip content={<GlobalTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

function TrendingWidget({short=[2,4,6,3,5]}){
  const delta = short[short.length-1]-short[0];
  const dir = delta>0?'up': delta<0?'down':'neutral';
  return (
    <Panel title="Trending — Simple" style={{height:200}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div><div style={{fontSize:22, fontWeight:800}}>{short[short.length-1]}</div><div style={{color:'#94a3b8'}}>Short term</div></div>
        <div style={{textAlign:'right'}}><div style={{color: dir==='up'? '#10B981': dir==='down'?'#EF4444':'#94a3b8'}}>{dir==='up'?'▲': dir==='down'?'▼':'—'} {Math.abs(delta)}</div><MiniSpark points={short} color={COLORS[0]} /></div>
      </div>
    </Panel>
  )
}

function KPIGrid(){
  return (
    <Panel title="Cards / KPIs" style={{height:320}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10}}>
        {kpis.map((k,i)=>(
          <div key={k.title} style={{background:'#071126', padding:12, borderRadius:8}}>
            <div style={{fontSize:12, color:'#94a3b8'}}>{k.title}</div>
            <div style={{fontSize:20, fontWeight:800}}>{k.value}</div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
              <div style={{color: k.change>=0? '#10B981':'#EF4444'}}>{k.change}%</div>
              <MiniSpark points={k.series} color={COLORS[i%COLORS.length]} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function TooltipDemo(){
  return (
    <Panel title="Tooltip — Global / Contextual" style={{height:320}}>
      <div style={{display:'flex', gap:12}}>
        <div style={{flex:1}}>
          <div style={{marginBottom:6, color:'#9fb1c8'}}>Global tooltip on Line</div>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid stroke="#183045" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9fb1c8" />
                <YAxis stroke="#9fb1c8" />
                <ReTooltip content={<GlobalTooltip />} />
                <Line type="monotone" dataKey="value" stroke={COLORS[0]} dot={{r:3}} />
                <Line type="monotone" dataKey="value2" stroke={COLORS[1]} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{width:260}}>
          <div style={{marginBottom:6, color:'#9fb1c8'}}>Contextual tooltip</div>
          <div style={{background:'#071226', padding:10, borderRadius:8}}>
            <div style={{color:'#cbd5e1'}}>Hovering elements shows a custom styled tooltip.</div>
            <div style={{marginTop:8, color:'#94a3b8'}}>This box showcases the same design language for tooltips.</div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* Radical variants */
function RadicalText(){ const layers=[{label:'Score', value:88}]; return (<Panel title="Radical — Text Variant" style={{height:240}}><div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:12}}><RadialStack layers={layers} size={160} /><div><div style={{fontSize:22,fontWeight:800}}>88%</div><div style={{color:'#94a3b8'}}>Score</div></div></div></Panel>) }
function RadicalShape(){ const layers=[{label:'A',value:62},{label:'B',value:44}]; return (<Panel title="Radical — Shape Variant" style={{height:260}}><div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:12}}><RadialStack layers={layers} size={200} /><div style={{color:'#cbd5e1'}}>{layers.map((l,i)=><div key={l.label}>{l.label}: <strong style={{color:COLORS[i]}}>{l.value}%</strong></div>)}</div></div></Panel>) }
function RadicalStacked(){ const layers=[{label:'Reliability',value:82},{label:'Throughput',value:64},{label:'Accuracy',value:48}]; return (<Panel title="Radical — Stacked" style={{height:320}}><div style={{display:'flex', alignItems:'center', gap:24}}><RadialStack layers={layers} size={260} /><div>{layers.map((l,idx)=>(<div key={l.label} style={{color:'#cbd5e1', marginBottom:6}}>{l.label}: <strong style={{color:COLORS[idx]}}>{l.value}%</strong></div>))}</div></div></Panel>) }

/* NAV */
const NAV = [
  { title: "Line Chart", key: "line", variants: [
    { id: "line-simple", label: "Simple" },
    { id: "line-linear", label: "Linear" },
    { id: "line-multiple", label: "Multiple" },
    { id: "line-dots", label: "With Dots" },
  ]},
  { title: "Pie Chart", key: "pie", variants: [
    { id: "pie-simple", label: "Simple" },
    { id: "pie-labels", label: "With Labels" },
    { id: "pie-donut", label: "Donut" },
    { id: "pie-datakey", label: "Changing Data Key" },
    { id: "pie-speedometer", label: "Speedometer" },
  ]},
  { title: "Area Chart", key: "area", variants: [
    { id: "area-simple", label: "Simple" },
    { id: "area-stacked", label: "Stacked" },
    { id: "area-linear", label: "Linear" },
  ]},
  { title: "Bar Chart", key: "bar", variants: [
    { id: "bar-vertical", label: "Vertical Simple" },
    { id: "bar-horizontal", label: "Horizontal" },
    { id: "bar-multiple", label: "Multiple" },
    { id: "bar-inbar", label: "Bar in Bar" },
    { id: "bar-stacked", label: "Stacked" },
    { id: "bar-posneg", label: "Positive / Negative" },
  ]},
  { title: "Radar Chart", key: "radar", variants: [
    { id: "radar-simple", label: "Simple" },
    { id: "radar-lines", label: "Lines" },
    { id: "radar-dots", label: "Dots" },
  ]},
  { title: "Trending", key: "trending", variants: [
    { id: "trending-simple", label: "Simple" },
  ]},
  { title: "Cards", key: "cards", variants: [
    { id: "card-numbers", label: "Numbers" },
    { id: "card-stats", label: "Stats" },
    { id: "card-percentage", label: "Percentage" },
    { id: "card-status", label: "Status" },
  ]},
  { title: "Geographic Map", key: "geo", variants: [
    { id: "map-basic", label: "Map" },
  ]},
  { title: "Tooltip", key: "tooltip", variants: [
    { id: "tooltip-global", label: "Global Tooltip" },
  ]},
  { title: "Radical", key: "radical", variants: [
    { id: "radical-text", label: "Text" },
    { id: "radical-shape", label: "Shape" },
    { id: "radical-stacked", label: "Stacked" },
  ]},
];

export default function DashboardChartsPreview(){
  const first = NAV[0].variants[0].id;
  const [selected, setSelected] = useState(first);
  const [open, setOpen] = useState(NAV.reduce((acc,g)=>{acc[g.key]=true; return acc;}, {}));

  const preview = useMemo(()=>{
    switch(selected){
      case "line-simple": return <LineSimple dots={true} smooth={true} multi={false} />;
      case "line-linear": return <LineSimple dots={false} smooth={false} multi={false} />;
      case "line-multiple": return <LineSimple dots={true} smooth={true} multi={true} />;
      case "line-dots": return <LineSimple dots={true} smooth={true} multi={false} />;

      case "pie-simple": return <PieSimple withLabels={false} />;
      case "pie-labels": return <PieSimple withLabels={true} />;
      case "pie-donut": return <PieDonut keyName="count" />;
      case "pie-datakey": return <PieDonut keyName="cost" />;
      case "pie-speedometer": return <PieSpeedometer value={68} />;

      case "area-simple": return <AreaSimple stacked={false} smooth={true} />;
      case "area-stacked": return <AreaSimple stacked={true} smooth={true} />;
      case "area-linear": return <AreaSimple stacked={false} smooth={false} />;

      case "bar-vertical": return <BarSimple orientation="vertical" multiple={false} />;
      case "bar-horizontal": return <BarSimple orientation="horizontal" multiple={false} />;
      case "bar-multiple": return <BarSimple orientation="vertical" multiple={true} />;
      case "bar-inbar": return <BarSimple orientation="vertical" barInBar={true} />;
      case "bar-stacked": return <BarSimple orientation="vertical" stacked={true} />;
      case "bar-posneg": return <BarSimple orientation="vertical" posneg={true} />;

      case "radar-simple": return <RadarSimple lines={true} dots={true} />;
      case "radar-lines": return <RadarSimple lines={true} dots={false} />;
      case "radar-dots": return <RadarSimple lines={false} dots={true} />;

      case "trending-simple": return <TrendingWidget />;

      case "card-numbers": return <KPIGrid />;
      case "card-stats": return <KPIGrid />;
      case "card-percentage": return <KPIGrid />;
      case "card-status": return <KPIGrid />;

      case "map-basic": return <Panel title='Geo Map (mock)' style={{height:360}}><GeoMapMock /></Panel>;

      case "tooltip-global": return <TooltipDemo />;

      case "radical-text": return <RadicalText />;
      case "radical-shape": return <RadicalShape />;
      case "radical-stacked": return <RadicalStacked />;

      default: return <div style={{color:'var(--text)'}}>Not implemented</div>
    }
  }, [selected]);

  return (
    <div style={{display:'flex', height:'100%', width:'100%'}}>
      <nav style={{width:320, borderRight:'1px solid rgba(255,255,255,0.03)', padding:14, overflowY:'auto'}}>
        <div style={{fontSize:18, fontWeight:900, marginBottom:12}}>Charts</div>
        {NAV.map(group=>(
          <div key={group.key} style={{marginBottom:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}} onClick={()=>setOpen(o=>({...o, [group.key]: !o[group.key]}))}>
              <div style={{fontWeight:700}}>{group.title}</div>
              <div style={{color:'var(--muted)'}}>{open[group.key] ? '▾' : '▸'}</div>
            </div>
            {open[group.key] && (
              <div style={{marginLeft:8, marginTop:8, display:'flex', flexDirection:'column', gap:6}}>
                {group.variants.map(v=>(
                  <button key={v.id} onClick={()=>setSelected(v.id)} style={{textAlign:'left', padding:'8px 10px', borderRadius:6, background: selected===v.id ? 'linear-gradient(90deg,#0f1724,#102034)' : 'transparent', color: selected===v.id ? 'var(--text)' : 'var(--muted)', border:'none', cursor:'pointer'}}>{v.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <main style={{flex:1, padding:18, overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <div style={{fontSize:20, fontWeight:800}}>{NAV.find(n=>n.variants.some(v=>v.id===selected))?.title || 'Charts'} — {NAV.flatMap(n=>n.variants).find(v=>v.id===selected)?.label}</div>
          <div style={{color:'var(--muted)'}}>Live preview</div>
        </div>
        <div style={{minHeight:360}}>{preview}</div>
      </main>

      <aside style={{width:360, borderLeft:'1px solid rgba(255,255,255,0.03)', padding:16, overflowY:'auto'}}>
        <div style={{fontWeight:800, marginBottom:8}}>Inspector</div>
        <div style={{color:'var(--muted)', marginBottom:12}}>Use the left navigation to pick a chart variant. Inspector shows contextual info.</div>
        <div style={{background:'#071126', padding:12, borderRadius:8}}>
          <div style={{fontWeight:700, marginBottom:6}}>Variant</div>
          <div style={{color:'#cbd5e1', marginBottom:6}}>{selected}</div>
          <div style={{fontSize:13, color:'var(--muted)'}}>This inspector is a placeholder — add controls (toggles, sliders, keys) that update the preview immediately.</div>
        </div>
      </aside>
    </div>
  )
}
