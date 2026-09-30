import React, { useEffect, useRef, useState } from 'react';

// Compact, keyboard-forward dashboard with inline editing and bulk actions.
export function CompactDashboard() {
  const [bids, setBids] = useState(() => sampleBids());
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      // '/' focus search
      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // 'a' open quick add
      if (e.key === 'a' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setQuickAddOpen(true);
      }
      // 'Escape' clears selection / exits editors
      if (e.key === 'Escape') {
        setSelected(new Set());
        setEditingId(null);
        setQuickAddOpen(false);
      }
      // 'e' edit first selected
      if (e.key === 'e' && selected.size === 1) {
        const [id] = selected;
        setEditingId(id);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  function toggleSelect(id) {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  }

  function updateBid(id, patch) {
    setBids((prev) => prev.map(b => b.id === id ? { ...b, ...patch } : b));
    // Dev hook: call API endpoint when available
    fetch(`/api/bids/${id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(patch) }).catch(()=>{});
  }

  function bulkAction(action) {
    const ids = Array.from(selected);
    if (!ids.length) return;
    if (action === 'delete') {
      setBids(prev => prev.filter(b => !selected.has(b.id)));
      setSelected(new Set());
      return;
    }
    // stub for other bulk actions
    fetch('/api/bids/bulk', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action, ids }) }).catch(()=>{});
  }

  function addQuick(item) {
    const next = { ...item, id: Date.now(), submissions: 0 };
    setBids(prev => [next, ...prev]);
    setQuickAddOpen(false);
    // stub create
    fetch('/api/bids', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(next) }).catch(()=>{});
  }

  const filtered = bids.filter(b => (b.title + b.location + b.specialty).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface p-4">
      {/* Compact header */}
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-bid-navy">Compact Bid Console</h1>
          <p className="text-xs text-fg-muted">Keyboard: '/' focus search • 'a' quick-add • 'e' edit selected • Esc cancel</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-3 text-fg-muted text-sm">🔍</span>
            <input
              ref={searchRef}
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Search bids, location, specialty..."
              className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm w-72"
            />
          </div>

          <button onClick={()=>setQuickAddOpen(true)} className="px-3 py-2 bg-bid-orange text-white rounded-md flex items-center gap-2">
            <span>➕</span> Quick Add
          </button>

        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="max-w-7xl mx-auto mt-3 p-3 bg-white border border-border rounded-md flex items-center justify-between compact-toolbar">
          <div className="flex items-center gap-3">
            <span className="text-sm text-fg-muted">{selected.size} selected</span>
            <button onClick={()=>bulkAction('export')} className="text-sm px-3 py-1 bg-surface rounded">Export</button>
            <button onClick={()=>bulkAction('assign')} className="text-sm px-3 py-1 bg-surface rounded">Assign</button>
            <button onClick={()=>bulkAction('delete')} className="text-sm px-3 py-1 bg-danger/10 text-danger rounded">Delete</button>
          </div>

          <div>
            <button onClick={()=>setSelected(new Set())} className="text-sm px-3 py-1 bg-surface rounded">Clear</button>
          </div>
        </div>
      )}

      {/* Table header (compact) */}
      <div className="max-w-7xl mx-auto mt-4 bg-white border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-2 items-center px-4 py-2 text-xs font-semibold text-fg-muted border-b border-border">
          <div className="col-span-1">Sel</div>
          <div className="col-span-4">Project</div>
          <div className="col-span-2">Budget</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-2">Submissions</div>
          <div className="col-span-1">Action</div>
        </div>

        {/* Rows */}
        <div>
          {filtered.map(bid => (
            <div key={bid.id} data-bid-id={bid.id} data-api-endpoint={`/api/bids/${bid.id}`} className="grid grid-cols-12 gap-2 items-center px-4 py-2 compact-row" tabIndex={0}>
              {/* select */}
              <div className="col-span-1">
                <input type="checkbox" checked={selected.has(bid.id)} onChange={() => toggleSelect(bid.id)} />
              </div>

              {/* title */}
              <div className="col-span-4">
                {editingId === bid.id ? (
                  <InlineEditor initialValue={bid.title} onSave={val => { updateBid(bid.id, { title: val }); setEditingId(null); }} onCancel={()=>setEditingId(null)} />
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-fg">{bid.title}</div>
                      <div className="text-xs text-fg-muted">{bid.location} • {bid.specialty}</div>
                    </div>
                    <div className="hidden md:block text-xs text-fg-muted">{bid.category ?? ''}</div>
                  </div>
                )}
              </div>

              {/* budget */}
              <div className="col-span-2 text-sm">
                {editingId === bid.id ? (
                  <InlineEditor initialValue={`$${bid.budget.min}-${bid.budget.max}`} onSave={val=>{ const [min,max] = parseBudget(val); updateBid(bid.id, { budget:{ min, max } }); setEditingId(null);}} onCancel={()=>setEditingId(null)} />
                ) : (
                  <div className="text-sm font-medium text-bid-navy">${(bid.budget.min/1000).toFixed(0)}k–${(bid.budget.max/1000).toFixed(0)}k</div>
                )}
              </div>

              {/* due */}
              <div className={`col-span-2 text-sm ${bid.daysLeft<=2 ? 'text-danger' : 'text-fg'}`}>
                {editingId === bid.id ? (
                  <InlineEditor initialValue={`${bid.daysLeft}`} onSave={val=>{ const days = Number(val)||0; updateBid(bid.id, { daysLeft: days }); setEditingId(null); }} onCancel={()=>setEditingId(null)} />
                ) : (
                  <div>{bid.daysLeft===0 ? 'Today' : `${bid.daysLeft}d`}</div>
                )}
              </div>

              {/* submissions */}
              <div className="col-span-2 text-sm text-fg">
                {bid.submissions} bids
              </div>

              {/* actions */}
              <div className="col-span-1 flex items-center gap-2 justify-end">
                <button title="Edit" onClick={() => setEditingId(bid.id)} className="p-1 rounded hover:bg-surface">
                  <span className="text-sm">✎</span>
                </button>
                <button title="Quick View" className="p-1 rounded hover:bg-surface">
                  <span className="text-sm">›</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length===0 && (<div className="p-6 text-center text-fg-muted">No matching bids</div>)}
        </div>
      </div>

      {/* Quick add inline modal */}
      {quickAddOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="w-full max-w-xl bg-white rounded-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-bid-navy">Quick Add Bid</h3>
              <button onClick={()=>setQuickAddOpen(false)} className="p-2 text-lg">✕</button>
            </div>
            <QuickAddForm onCancel={()=>setQuickAddOpen(false)} onSave={addQuick} />
          </div>
        </div>
      )}

    </div>
  );
}

function InlineEditor({ initialValue, onSave, onCancel }){
  const [val, setVal] = useState(initialValue || '');
  const ref = useRef(null);
  useEffect(()=>ref.current?.focus(), []);
  return (
    <div className="flex items-center gap-2">
      <input ref={ref} value={val} onChange={e=>setVal(e.target.value)} className="inline-input px-2 py-1 border rounded text-sm" />
      <button onClick={()=>onSave(val)} className="px-2 py-1 bg-success-light text-success rounded text-xs">Save</button>
      <button onClick={onCancel} className="px-2 py-1 bg-surface rounded text-xs">Cancel</button>
    </div>
  );
}

function QuickAddForm({ onSave, onCancel }){
  const [title, setTitle] = useState('New Quick Bid');
  const [location, setLocation] = useState('');
  const [min, setMin] = useState(25000);
  const [max, setMax] = useState(40000);
  const [days, setDays] = useState(7);

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSave({ title, location, budget:{min,max}, daysLeft: days, status:'active', specialty:'General' }); }} className="space-y-3 mt-4">
      <div className="grid grid-cols-2 gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} className="px-3 py-2 border rounded" />
        <input value={location} onChange={e=>setLocation(e.target.value)} className="px-3 py-2 border rounded" placeholder="Location" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input value={min} onChange={e=>setMin(Number(e.target.value))} className="px-3 py-2 border rounded" />
        <input value={max} onChange={e=>setMax(Number(e.target.value))} className="px-3 py-2 border rounded" />
        <input value={days} onChange={e=>setDays(Number(e.target.value))} className="px-3 py-2 border rounded" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-surface rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-bid-orange text-white rounded">Add</button>
      </div>
    </form>
  );
}

function parseBudget(str){
  const nums = (str||'').replace(/[^0-9\-]/g,'').split('-').map(n=>Number(n)||0);
  return [nums[0]||0, nums[1]||nums[0]||0];
}

function sampleBids(){
  return [
    { id: 101, title: 'Commercial HVAC Retrofit', location: 'Downtown Medical Center', budget:{min:85000,max:120000}, daysLeft:5, status:'active', submissions:12, specialty:'HVAC' },
    { id: 102, title: 'Roofing Repair & Replacement', location: 'Industrial Complex', budget:{min:45000,max:65000}, daysLeft:2, status:'active', submissions:8, specialty:'Roofing' },
    { id: 103, title: 'Plumbing System Overhaul', location: 'Office Tower', budget:{min:120000,max:180000}, daysLeft:12, status:'active', submissions:5, specialty:'Plumbing' },
    { id: 104, title: 'Electrical Panel Upgrade', location: 'Retail Center', budget:{min:35000,max:55000}, daysLeft:0, status:'closed', submissions:18, specialty:'Electrical' },
    { id: 105, title: 'Concrete Foundation Repair', location: 'Warehouse', budget:{min:25000,max:40000}, daysLeft:8, status:'active', submissions:3, specialty:'Concrete' },
  ];
}
