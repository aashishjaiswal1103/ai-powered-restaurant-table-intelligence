import React, { useState } from 'react';
import { Camera, CheckCircle2, Clock, AlertTriangle, Utensils, Users, RefreshCw } from 'lucide-react';

interface TablePreview {
  id: string;
  name: string;
  state: 'FREE' | 'GUEST_ARRIVED' | 'ORDERED' | 'GUEST_DINING' | 'GUEST_LEFT';
  guests: number;
  elapsedMinutes: number;
}

const mockTables: TablePreview[] = [
  { id: 'T01', name: 'Table 1 (Window)', state: 'GUEST_DINING', guests: 3, elapsedMinutes: 24 },
  { id: 'T02', name: 'Table 2 (Center)', state: 'ORDERED', guests: 2, elapsedMinutes: 12 },
  { id: 'T03', name: 'Table 3 (Aisle)', state: 'GUEST_LEFT', guests: 0, elapsedMinutes: 6 },
  { id: 'T04', name: 'Table 4 (Booth)', state: 'FREE', guests: 0, elapsedMinutes: 0 },
];

export default function App() {
  const [selectedTableId, setSelectedTableId] = useState<string>('T03');

  const selectedTable = mockTables.find((t) => t.id === selectedTableId) || mockTables[0];

  return (
    <div className="flex flex-col min-h-screen bg-cream_bg text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-emerald_deep text-cream_bg px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Utensils className="h-6 w-6 text-cream_bg" />
          <h1 className="text-xl font-bold tracking-tight">Restaurant Intelligence & Operations Console</h1>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <span className="flex items-center space-x-1 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CV Ingestion: Active</span>
          </span>
          <span className="flex items-center space-x-1 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>RushDB: Connected</span>
          </span>
        </div>
      </header>

      {/* Main Layout: Split Screen */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Live Camera View (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col bg-white rounded-xl shadow-sm border border-stone-300 overflow-hidden">
          <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-stone-700 font-semibold text-sm">
              <Camera className="h-4 w-4" />
              <span>Camera Feed (CAM_01 - Dining Floor)</span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald_deep font-medium px-2 py-0.5 rounded">
              5 FPS Tracked
            </span>
          </div>

          <div className="relative flex-1 min-h-[380px] bg-stone-900 flex items-center justify-center overflow-hidden">
            <div className="text-stone-400 text-center p-6">
              <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Camera Stream Canvas</p>
              <p className="text-xs text-stone-500 mt-1">YOLO BBoxes + ByteTrack ID + Polygon Zones Active</p>
            </div>

            {/* Simulated Table Polygon Highlights */}
            <div
              onClick={() => setSelectedTableId('T01')}
              className={`absolute top-12 left-12 w-36 h-28 border-2 rounded cursor-pointer transition-all ${
                selectedTableId === 'T01'
                  ? 'border-emerald-400 bg-emerald-500/20 shadow-lg ring-2 ring-emerald-300'
                  : 'border-emerald_deep/80 bg-emerald_deep/10 hover:bg-emerald_deep/20'
              } p-2 flex flex-col justify-between`}
            >
              <span className="text-[10px] font-bold text-white bg-emerald_deep px-1.5 py-0.5 rounded w-max">
                T01 (Dining)
              </span>
              <span className="text-[10px] text-white">3 Guests • 24m</span>
            </div>

            <div
              onClick={() => setSelectedTableId('T03')}
              className={`absolute bottom-12 right-16 w-36 h-28 border-2 rounded cursor-pointer transition-all ${
                selectedTableId === 'T03'
                  ? 'border-bordo bg-bordo/25 shadow-lg ring-2 ring-red-400'
                  : 'border-bordo/80 bg-bordo/15 hover:bg-bordo/25'
              } p-2 flex flex-col justify-between animate-pulse`}
            >
              <span className="text-[10px] font-bold text-white bg-bordo px-1.5 py-0.5 rounded w-max">
                T03 (Clean Needed)
              </span>
              <span className="text-[10px] text-white">Empty • 6m</span>
            </div>
          </div>
        </section>

        {/* Right Side: Table Status Overview (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col bg-white rounded-xl shadow-sm border border-stone-300 overflow-hidden">
          <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <span className="text-stone-700 font-semibold text-sm">Table Status</span>
            <span className="text-xs text-stone-500">4 Tables Active</span>
          </div>

          <div className="divide-y divide-stone-200 overflow-y-auto flex-1">
            {mockTables.map((table) => {
              const isSelected = table.id === selectedTableId;
              const isNeedsCleaning = table.state === 'GUEST_LEFT';

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-50/80 border-l-4 border-emerald_deep'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-stone-800">{table.name}</span>
                      {isNeedsCleaning && (
                        <span className="bg-bordo text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3 mr-0.5" /> Clean Req
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1">
                      <span className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {table.guests > 0 ? `${table.guests} seated` : 'Empty'}
                      </span>
                      {table.elapsedMinutes > 0 && (
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {table.elapsedMinutes}m elapsed
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        table.state === 'FREE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : table.state === 'GUEST_LEFT'
                          ? 'bg-red-100 text-bordo font-bold'
                          : 'bg-emerald-900 text-cream_bg'
                      }`}
                    >
                      {table.state}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Panel: Selected Table Operational Detail */}
        <section className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-stone-300 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200 gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-stone-900">{selectedTable.name} Details</h2>
                <span className="bg-stone-200 text-stone-700 text-xs px-2 py-0.5 rounded font-mono">
                  Cycle: CYC_20261116_003
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">Active lifecycle timeline & manager operational actions</p>
            </div>

            {selectedTable.state === 'GUEST_LEFT' && (
              <button className="bg-bordo hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center space-x-2 transition-all">
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm Cleaned (Set to FREE)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
            <div>
              <h3 className="font-semibold text-stone-700 mb-2">Cycle Timeline</h3>
              <ul className="space-y-2 border-l-2 border-stone-200 pl-3">
                <li className="relative">
                  <div className="font-medium text-stone-800">11:15:30 — Guest Arrival Estimated</div>
                  <div className="text-stone-400 text-[11px]">Source: Camera (Confidence 0.88)</div>
                </li>
                <li className="relative">
                  <div className="font-medium text-stone-800">11:22:15 — Order #ORD_5501 Submitted</div>
                  <div className="text-stone-400 text-[11px]">Source: QR Self-Order ($40.70)</div>
                </li>
                <li className="relative">
                  <div className="font-medium text-stone-800">11:42:00 — Guest Departure Estimated</div>
                  <div className="text-stone-400 text-[11px]">Source: Camera (Empty window 30s)</div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-stone-700 mb-2">Cycle Orders</h3>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="flex justify-between font-medium text-stone-800 mb-1">
                  <span>Order #ORD_5501</span>
                  <span>$40.70</span>
                </div>
                <div className="text-stone-500 text-[11px]">2x Truffle Pasta ($37.00)</div>
                <div className="text-stone-400 text-[10px] mt-1">Status: SUBMITTED (Snapshot verified)</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-stone-700 mb-2">Operational Metrics</h3>
              <div className="space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Dining Dwell Time:</span>
                  <span className="font-semibold">26m 30s</span>
                </div>
                <div className="flex justify-between">
                  <span>Waiting for Cleaning:</span>
                  <span className="font-semibold text-bordo">6m 12s</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cycle Time:</span>
                  <span className="font-semibold">32m 42s</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
