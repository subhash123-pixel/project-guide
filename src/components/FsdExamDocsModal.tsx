import React, { useState } from 'react';
import { X, Server, Layers, Database, Code, CheckCircle2, Play, Terminal } from 'lucide-react';

interface FsdExamDocsModalProps {
  onClose: () => void;
}

export const FsdExamDocsModal: React.FC<FsdExamDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'endpoints' | 'schema' | 'viva'>('architecture');
  const [apiTestResponse, setApiTestResponse] = useState<string | null>(null);
  const [apiTestLoading, setApiTestLoading] = useState(false);
  const [testedEndpoint, setTestedEndpoint] = useState<string>('');

  const runLiveApiTest = async (method: string, url: string, body?: any) => {
    setApiTestLoading(true);
    setTestedEndpoint(`${method} ${url}`);
    setApiTestResponse(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      setApiTestResponse(JSON.stringify({ status: `${res.status} ${res.statusText}`, data }, null, 2));
    } catch (err: any) {
      setApiTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setApiTestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-neutral-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 p-6 sm:p-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-black rounded-xl font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight">FSD External Examination Portal</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Full Stack Project
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Technical Architecture, RESTful API Specs & Examiner Verification Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-800 mb-6 shrink-0 overflow-x-auto">
          {[
            { id: 'architecture', label: '1. Architecture & Stack' },
            { id: 'endpoints', label: '2. REST API & Live Tester' },
            { id: 'schema', label: '3. Data Schema & Models' },
            { id: 'viva', label: '4. FSD Viva & Oral Q&A' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 space-y-6 text-xs text-neutral-300 pr-1">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Architecture Blueprint Card */}
              <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Full-Stack Multi-Tier Architecture</span>
                </h4>
                <p className="text-neutral-400 leading-relaxed">
                  This project demonstrates an industry-standard decoupled Client-Server architecture designed to satisfy all academic requirements for the Full Stack Development (FSD) external evaluation:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                      Frontend Layer (Client)
                    </div>
                    <ul className="space-y-1.5 text-neutral-300">
                      <li>• <strong>Framework:</strong> React 19 SPA with TypeScript</li>
                      <li>• <strong>Build Tool:</strong> Vite 8 bundler with HMR</li>
                      <li>• <strong>Styling:</strong> Tailwind CSS v4 design system</li>
                      <li>• <strong>Geospatial:</strong> Leaflet.js with OpenStreetMap layers</li>
                      <li>• <strong>Icons:</strong> Lucide React vector icons</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                      Backend Layer (Server)
                    </div>
                    <ul className="space-y-1.5 text-neutral-300">
                      <li>• <strong>Runtime:</strong> Node.js with tsx executor</li>
                      <li>• <strong>Server:</strong> Express.js 4.21 Application Server</li>
                      <li>• <strong>API Style:</strong> RESTful JSON over HTTP</li>
                      <li>• <strong>Middleware:</strong> JSON parser, CORS, Vite dev handler</li>
                      <li>• <strong>Persistence:</strong> In-memory normalized collections</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Flow Diagram Representation */}
              <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 space-y-3">
                <h4 className="text-sm font-bold text-white">Client-Server Request-Response Lifecycle</h4>
                <div className="p-4 rounded-xl bg-neutral-950 font-mono text-[11px] text-amber-300 leading-relaxed overflow-x-auto">
                  [User Browser / React 19 SPA]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── 1. Dispatches HTTP Fetch (GET / POST)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;▼<br />
                  [Express.js Server on Port 3000]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── 2. Middleware JSON Body Validation & Route Matching<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── 3. Business Logic Execution (Rating averages, Pricing algorithms)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── 4. Mutates Database State (Reviews, Bookings)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;▼<br />
                  [Structured JSON HTTP 200/201 Response]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;│<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;▼<br />
                  [React State Hook Update & DOM Re-render]
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700">
                <h4 className="text-sm font-bold text-white mb-2">Live API Endpoint Execution Console</h4>
                <p className="text-neutral-400 text-xs mb-3">
                  Click any endpoint button below to trigger live network requests to the running Express backend and inspect the raw response payload:
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => runLiveApiTest('GET', '/api/destinations')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>GET /api/destinations</span>
                  </button>

                  <button
                    onClick={() => runLiveApiTest('GET', '/api/destinations/dest-1')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>GET /api/destinations/dest-1</span>
                  </button>

                  <button
                    onClick={() => runLiveApiTest('GET', '/api/reviews/recent')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>GET /api/reviews/recent</span>
                  </button>

                  <button
                    onClick={() => runLiveApiTest('GET', '/api/bookings')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>GET /api/bookings</span>
                  </button>

                  <button
                    onClick={() => runLiveApiTest('POST', '/api/itinerary/plan', {
                      destinationId: 'dest-1',
                      days: 3,
                      travelStyle: 'Balanced',
                      pace: 'Moderate'
                    })}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>POST /api/itinerary/plan</span>
                  </button>
                </div>
              </div>

              {/* API Response Console */}
              {testedEndpoint && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{testedEndpoint}</span>
                    </span>
                    <span>{apiTestLoading ? 'Executing...' : 'Response Loaded'}</span>
                  </div>

                  <pre className="max-h-60 overflow-y-auto font-mono text-[11px] text-neutral-300 p-2 bg-neutral-900/60 rounded-lg border border-neutral-800">
                    {apiTestLoading ? 'Loading response from server...' : apiTestResponse}
                  </pre>
                </div>
              )}

              {/* Full Endpoints Table */}
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-neutral-800/80 text-neutral-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">HTTP Method</th>
                      <th className="p-3">Endpoint URL</th>
                      <th className="p-3">Function / Payload</th>
                      <th className="p-3">Response Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-400">GET</td>
                      <td className="p-3 font-mono text-neutral-200">/api/destinations</td>
                      <td className="p-3 text-neutral-400">Query filtering: ?category, ?search, ?maxBudget, ?sort</td>
                      <td className="p-3 font-mono text-neutral-300">200 OK</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-400">GET</td>
                      <td className="p-3 font-mono text-neutral-200">/api/destinations/:id</td>
                      <td className="p-3 text-neutral-400">Single destination + live aggregated review rating</td>
                      <td className="p-3 font-mono text-neutral-300">200 OK</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-cyan-400">POST</td>
                      <td className="p-3 font-mono text-neutral-200">/api/destinations/:id/reviews</td>
                      <td className="p-3 text-neutral-400">Creates new user review & triggers rating recalculation</td>
                      <td className="p-3 font-mono text-neutral-300">201 Created</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-cyan-400">POST</td>
                      <td className="p-3 font-mono text-neutral-200">/api/reviews/:id/helpful</td>
                      <td className="p-3 text-neutral-400">Increments upvote count for community review</td>
                      <td className="p-3 font-mono text-neutral-300">200 OK</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-cyan-400">POST</td>
                      <td className="p-3 font-mono text-neutral-200">/api/bookings</td>
                      <td className="p-3 text-neutral-400">Creates tour guide booking with pricing calculation</td>
                      <td className="p-3 font-mono text-neutral-300">201 Created</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-cyan-400">POST</td>
                      <td className="p-3 font-mono text-neutral-200">/api/itinerary/plan</td>
                      <td className="p-3 text-neutral-400">Dynamic algorithmic multi-day custom schedule builder</td>
                      <td className="p-3 font-mono text-neutral-300">200 OK</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Entity Relationship & Database Design</span>
                </h4>
                <p className="text-neutral-400 leading-relaxed mb-4">
                  The data schema is normalized into distinct entity collections:
                </p>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-amber-400 font-bold mb-1">Destination Entity:</div>
                    <div className="text-neutral-400">
                      id (PK), name, country, region, category, summary, fullDescription, coordinates {'{lat, lng}'}, image, gallery[], rating, reviewCount, entryFee, approxDailyBudget, currency, bestSeason, idealDays, highlights[], localCuisine[], travelTips[], itinerary[], weather
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-amber-400 font-bold mb-1">Review Entity:</div>
                    <div className="text-neutral-400">
                      id (PK), destinationId (FK references Destination.id), destinationName, authorName, authorLocation, rating (1-5), date, tripType, title, comment, helpfulCount, verifiedVisit
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-amber-400 font-bold mb-1">TourBooking Entity:</div>
                    <div className="text-neutral-400">
                      id (PK), destinationId (FK references Destination.id), destinationName, travelerName, travelerEmail, travelerPhone, tourDate, groupSize, preferredLanguage, travelStyle, totalCost, status, bookingRef, createdAt
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-1">
                Frequently Asked External Examination Viva Questions & Answers
              </h4>
              <p className="text-xs text-neutral-400 mb-4">
                Answers to prepare for your viva-voce with the university external examiner:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-1.5">
                  <div className="font-bold text-amber-400">
                    Q1: How do the frontend and backend communicate in this project?
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    The frontend (React 19) interacts with the backend (Express.js) via asynchronous HTTP requests using the browser Fetch API. When the user filters destinations, submits a review, or books a guide, payload data is transmitted as JSON over RESTful endpoints. The Express server executes validation and business logic, then returns standard HTTP status codes (200, 201, 400, 404) with structured JSON.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-1.5">
                  <div className="font-bold text-amber-400">
                    Q2: How is the interactive geospatial map implemented without external API quotas?
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    The map is powered by Leaflet.js with OpenStreetMap and Esri tile servers. Coordinates (latitude/longitude) stored in the database are projected onto the interactive viewport. Custom SVG `divIcon` pins represent categories with distinct hues. Clicking any pin binds popups and allows instantaneous synchronization between the map view and destination details.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-1.5">
                  <div className="font-bold text-amber-400">
                    Q3: How is state managed when a new review is submitted?
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    Dual-directional state updating is employed. When a user submits a review via `ReviewModal`, the server validates the input, inserts the review into the collection, recalculates the arithmetic mean for that destination, and responds with the new review and updated rating. React state hook triggers an instant re-render of both the destination card and review breakdown without requiring a full page refresh.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between shrink-0 text-neutral-400 text-xs">
          <span>Project Prepared for FSD External Practical Examination</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-900 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
