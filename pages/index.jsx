import { useState, useRef } from "react";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming"
];

const SEED_CLUBS = [
  { id:1,  name:"Riverside Boat Club",             city:"Boston",            state:"Massachusetts", type:"Competitive",  founded:1908, website:"riversideboatclub.org" },
  { id:2,  name:"Craftsbury Sculling Center",       city:"Craftsbury Common", state:"Vermont",       type:"Recreational", founded:1977, website:"craftsbury.com" },
  { id:3,  name:"Philadelphia Girls' Rowing Club",  city:"Philadelphia",      state:"Pennsylvania",  type:"Competitive",  founded:1938, website:"pgrc.org" },
  { id:4,  name:"Lake Washington Rowing Club",      city:"Seattle",           state:"Washington",    type:"Competitive",  founded:1970, website:"lwrc.org" },
  { id:5,  name:"San Diego Rowing Club",            city:"San Diego",         state:"California",    type:"Recreational", founded:1963, website:"sdrc.org" },
  { id:6,  name:"Chicago Rowing Foundation",        city:"Chicago",           state:"Illinois",      type:"Youth",        founded:1992, website:"chicagorowing.org" },
  { id:7,  name:"Austin Rowing Club",               city:"Austin",            state:"Texas",         type:"Recreational", founded:1985, website:"austinrowing.org" },
  { id:8,  name:"Atlanta Rowing Club",              city:"Atlanta",           state:"Georgia",       type:"Competitive",  founded:1979, website:"atlantarowing.org" },
  { id:9,  name:"Denver Rowing",                    city:"Denver",            state:"Colorado",      type:"Recreational", founded:2001, website:"denvercrew.org" },
  { id:10, name:"New York Athletic Club Rowing",    city:"New York",          state:"New York",      type:"Competitive",  founded:1868, website:"nyac.org" },
  { id:11, name:"Capital Rowing Club",              city:"Washington",        state:"DC",            type:"Competitive",  founded:1980, website:"capitalrowing.org" },
  { id:12, name:"Narragansett Boat Club",           city:"Providence",        state:"Rhode Island",  type:"Competitive",  founded:1838, website:"narragansettboatclub.org" },
  { id:13, name:"Oakland Strokes",                  city:"Oakland",           state:"California",    type:"Youth",        founded:1998, website:"oaklandstrokes.org" },
  { id:14, name:"Minneapolis Rowing Club",          city:"Minneapolis",       state:"Minnesota",     type:"Masters",      founded:1975, website:"minneapolisrowing.org" },
  { id:15, name:"Miami Beach Rowing Club",          city:"Miami Beach",       state:"Florida",       type:"Recreational", founded:2005, website:"miamibeachrowing.org" },
  { id:16, name:"Portland Rowing Club",             city:"Portland",          state:"Oregon",        type:"Competitive",  founded:1968, website:"portlandrowing.org" },
];

// Approximate SVG x,y coords for each state on a 900x520 viewBox
const STATE_XY = {
  "Alabama":{x:615,y:345},"Alaska":{x:125,y:430},"Arizona":{x:195,y:315},
  "Arkansas":{x:555,y:320},"California":{x:115,y:265},"Colorado":{x:295,y:265},
  "Connecticut":{x:758,y:192},"Delaware":{x:744,y:228},"Florida":{x:655,y:405},
  "Georgia":{x:638,y:352},"Hawaii":{x:255,y:445},"Idaho":{x:218,y:185},
  "Illinois":{x:585,y:248},"Indiana":{x:612,y:248},"Iowa":{x:535,y:228},
  "Kansas":{x:450,y:275},"Kentucky":{x:625,y:282},"Louisiana":{x:558,y:375},
  "Maine":{x:788,y:155},"Maryland":{x:728,y:238},"Massachusetts":{x:772,y:188},
  "Michigan":{x:618,y:205},"Minnesota":{x:518,y:170},"Mississippi":{x:588,y:358},
  "Missouri":{x:542,y:272},"Montana":{x:275,y:158},"Nebraska":{x:435,y:245},
  "Nevada":{x:162,y:248},"New Hampshire":{x:772,y:172},"New Jersey":{x:746,y:218},
  "New Mexico":{x:288,y:328},"New York":{x:728,y:192},"North Carolina":{x:688,y:292},
  "North Dakota":{x:428,y:162},"Ohio":{x:648,y:245},"Oklahoma":{x:448,y:312},
  "Oregon":{x:142,y:198},"Pennsylvania":{x:702,y:215},"Rhode Island":{x:766,y:196},
  "South Carolina":{x:672,y:318},"South Dakota":{x:428,y:198},"Tennessee":{x:618,y:308},
  "Texas":{x:428,y:362},"Utah":{x:232,y:258},"Vermont":{x:760,y:172},
  "Virginia":{x:708,y:268},"Washington":{x:152,y:162},"West Virginia":{x:682,y:258},
  "Wisconsin":{x:568,y:195},"Wyoming":{x:298,y:212},"DC":{x:730,y:242},
};

const TYPE = {
  Competitive:  { dot:"#4fc3f7", bg:"rgba(79,195,247,0.12)",  tx:"#4fc3f7" },
  Recreational: { dot:"#69f0ae", bg:"rgba(105,240,174,0.12)", tx:"#69f0ae" },
  Youth:        { dot:"#ffb74d", bg:"rgba(255,183,77,0.12)",  tx:"#ffb74d" },
  Masters:      { dot:"#ce93d8", bg:"rgba(206,147,216,0.12)", tx:"#ce93d8" },
};

/* ─── Map ─────────────────────────────────────────────────────────────── */
function MapPanel({ clubs, selected, onSelect }) {
  const [tip, setTip] = useState(null);
  const byState = {};
  clubs.forEach(c => { (byState[c.state] = byState[c.state]||[]).push(c); });

  return (
    <div style={{ position:"relative", borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)", background:"#060e1c" }}>
      <svg viewBox="0 0 900 520" style={{ width:"100%", display:"block" }}>
        <defs>
          <pattern id="grid" width="45" height="45" patternUnits="userSpaceOnUse">
            <path d="M45 0L0 0 0 45" fill="none" stroke="rgba(79,195,247,0.04)" strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="900" height="520" fill="#060e1c"/>
        <rect width="900" height="520" fill="url(#grid)"/>

        {/* simplified US land shape */}
        <polygon
          points="155,128 810,128 832,142 840,162 822,174 798,168 788,178 800,194 788,204 782,222 798,244 776,262 788,282 758,292 748,312 738,332 718,342 708,362 688,382 666,402 648,422 618,432 578,432 538,422 498,432 458,432 416,422 376,416 336,412 296,392 256,402 216,392 182,372 158,342 138,302 128,262 132,222 144,192 138,162 155,128"
          fill="rgba(8,20,42,0.9)" stroke="rgba(79,195,247,0.18)" strokeWidth="1.5"
        />

        {/* Club pins */}
        {Object.entries(byState).map(([state, sc]) => {
          const xy = STATE_XY[state]; if (!xy) return null;
          const isSel = selected && sc.some(c => c.id===selected.id);
          const col = TYPE[sc[0].type]?.dot || "#4fc3f7";
          const n = sc.length;
          return (
            <g key={state} style={{cursor:"pointer"}}
              onClick={() => onSelect(sc[0])}
              onMouseEnter={() => setTip({...xy, sc, state})}
              onMouseLeave={() => setTip(null)}>
              {isSel && <circle cx={xy.x} cy={xy.y} r={20} fill={col} opacity={0.12}/>}
              <circle cx={xy.x} cy={xy.y} r={n>1?9:6} fill={col} opacity={0.92}/>
              {n>1 && <text x={xy.x} y={xy.y+3.5} textAnchor="middle" fill="#050d1a" fontSize="7.5" fontWeight="bold">{n}</text>}
< truncated lines 98-319 >
            <div style={{display:"flex",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:3,gap:2}}>
              {[["map","🗺  Map"],["list","☰  List"]].map(([id,label])=>(
                <button key={id} onClick={()=>setTab(id)} style={{background:tab===id?"rgba(79,195,247,0.14)":"none",border:tab===id?"1px solid rgba(79,195,247,0.28)":"1px solid transparent",borderRadius:7,color:tab===id?"#4fc3f7":"#3a5a78",padding:"5px 14px",cursor:"pointer",fontSize:"0.78rem",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}>{label}</button>
              ))}
            </div>
            <button onClick={()=>setShowModal(true)} style={{background:"rgba(79,195,247,0.9)",color:"#050d1a",border:"none",borderRadius:8,padding:"7px 16px",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.02em"}}>
              + Submit Club
            </button>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:1240,margin:"0 auto",padding:"22px 24px 60px"}}>

        {/* ── SEARCH BAR ── */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,animation:"fadeUp 0.4s ease both"}}>
          <div style={{flex:"1 1 280px",display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(79,195,247,0.14)",borderRadius:10,padding:"8px 13px"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2e4e68" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aiSearch()}
              placeholder="Search club name, city, or state…"
              style={{flex:1,background:"transparent",border:"none",color:"#e0eaf4",fontSize:"0.87rem",fontFamily:"'DM Sans',sans-serif"}}/>
            {(query||aiMsg) && <button onClick={reset} style={{background:"none",border:"none",color:"#2e4e68",cursor:"pointer",fontSize:"1rem",padding:"0 2px"}}>✕</button>}
          </div>
          <select value={stateF} onChange={e=>setStateF(e.target.value)} style={{flex:"0 1 165px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,color:stateF==="All States"?"#3a5a78":"#e0eaf4",padding:"8px 12px",fontSize:"0.84rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            <option>All States</option>{US_STATES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{flex:"0 1 150px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,color:typeF==="All Types"?"#3a5a78":"#e0eaf4",padding:"8px 12px",fontSize:"0.84rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            <option>All Types</option>{["Competitive","Recreational","Youth","Masters"].map(t=><option key={t}>{t}</option>)}
          </select>
          <button onClick={aiSearch} disabled={loading} style={{flex:"0 0 auto",background:loading?"rgba(79,195,247,0.12)":"rgba(79,195,247,0.9)",color:loading?"#4fc3f7":"#050d1a",border:"none",borderRadius:10,padding:"8px 20px",fontSize:"0.84rem",fontWeight:700,cursor:loading?"wait":"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
            {loading ? <><span style={{display:"inline-block",width:12,height:12,border:"2px solid #4fc3f7",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Searching</> : "AI Search"}
          </button>
        </div>

        {/* ── STATUS ── */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"#4fc3f7"}}>{filtered.length}</span>
            <span style={{color:"#3a5a78",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.09em"}}>clubs</span>
            {aiMsg && <span style={{color:"#4fc3f7",fontSize:"0.75rem",background:"rgba(79,195,247,0.08)",border:"1px solid rgba(79,195,247,0.18)",padding:"3px 10px",borderRadius:20}}>{aiMsg}</span>}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {Object.entries(TYPE).map(([t,c])=>(
              <button key={t} onClick={()=>setTypeF(typeF===t?"All Types":t)} style={{display:"flex",alignItems:"center",gap:4,background:typeF===t?c.bg:"none",border:`1px solid ${typeF===t?c.dot:"transparent"}`,borderRadius:20,padding:"2px 9px",cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:c.dot}}/>
                <span style={{color:typeF===t?c.tx:"#3a5a78",fontSize:"0.7rem"}}>{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── MAP VIEW ── */}
        {tab==="map" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14,alignItems:"start"}}>
            <MapPanel clubs={filtered} selected={selected} onSelect={setSelected}/>
            <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:530,overflowY:"auto",paddingRight:2}}>
              {selected && (
                <div style={{background:"rgba(79,195,247,0.07)",border:"1px solid rgba(79,195,247,0.28)",borderRadius:11,padding:"14px 16px",marginBottom:2}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"#4fc3f7",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.12em"}}>Selected Club</span>
                    <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"#3a5a78",cursor:"pointer",fontSize:"0.9rem"}}>✕</button>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",color:"#f0f4f8",margin:"0 0 5px",fontWeight:700}}>{selected.name}</p>
                  <p style={{color:"#6a8aaa",fontSize:"0.8rem",margin:"0 0 5px"}}>{selected.city}, {selected.state}{selected.founded?` · Est. ${selected.founded}`:""}</p>
                  <span style={{padding:"2px 8px",borderRadius:20,fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",background:TYPE[selected.type]?.bg,color:TYPE[selected.type]?.tx}}>{selected.type}</span>
                  {selected.website && <div style={{marginTop:8}}><a href={`https://${selected.website}`} target="_blank" rel="noreferrer" style={{color:"#4fc3f7",fontSize:"0.78rem"}}>{selected.website} ↗</a></div>}
                </div>
              )}
              <p style={{color:"#2a4a68",fontSize:"0.7rem",margin:"2px 0 4px",textTransform:"uppercase",letterSpacing:"0.1em"}}>All Clubs</p>
              {filtered.length===0 ? <p style={{color:"#3a5a78",fontSize:"0.82rem",textAlign:"center",padding:"20px 0"}}>No clubs match filters.</p>
                : filtered.map((c,i)=><ClubCard key={c.id} club={c} selected={selected?.id===c.id} onClick={()=>setSelected(c)} index={i}/>)}
            </div>
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {tab==="list" && (
          filtered.length===0
            ? <div style={{textAlign:"center",padding:"50px 0",color:"#3a5a78"}}><p>No clubs found. <button onClick={reset} style={{background:"none",border:"none",color:"#4fc3f7",cursor:"pointer",fontFamily:"inherit"}}>Reset filters</button></p></div>
            : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:11}}>
                {filtered.map((c,i)=><ClubCard key={c.id} club={c} selected={selected?.id===c.id} onClick={()=>setSelected(c)} index={i}/>)}
              </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{marginTop:44,paddingTop:22,borderTop:"1px solid rgba(255,255,255,0.048)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <p style={{color:"#1e3a58",fontSize:"0.72rem",margin:0}}>Data sourced from USRowing national registry · AI-enhanced search powered by Claude</p>
          <button onClick={()=>setShowModal(true)} style={{background:"none",border:"1px solid rgba(79,195,247,0.18)",borderRadius:8,color:"#4fc3f7",padding:"6px 14px",cursor:"pointer",fontSize:"0.76rem",fontFamily:"'DM Sans',sans-serif"}}>
            + Submit Your Club
          </button>
        </div>
      </div>

      {showModal && <SubmitModal onClose={()=>setShowModal(false)} onSubmit={handleSubmit}/>}
    </div>
  );
}
