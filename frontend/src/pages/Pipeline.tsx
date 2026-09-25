import type { ComponentType } from 'react';
import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Database,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Zap,
  Info,
  Activity,
  Layers,
  Search,
} from 'lucide-react';

import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';

import { getCollectionRuns, getPipelineRuns } from '../api/api';
import type { CollectionRun, PipelineRun } from '../api/types';

const WINDOWS = [1, 7, 15, 21, 30, 45];

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString('en-IN');
}

export default function Pipeline() {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [collections, setCollections] = useState<CollectionRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        getPipelineRuns(20),
        getCollectionRuns(5000),
      ]);
      setRuns(p);
      setCollections(c);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load pipeline data',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const run = runs[0];
  const latestTimestamp = run?.started_at;
  const batch = latestTimestamp
    ? collections.filter((x) => x.pipeline_run_id === run.pipeline_run_id)
    : [];

  const windows = WINDOWS.map((days) => {
    const xs = batch.filter((x) => x.advance_days === days);
    return {
      days,
      rows: xs,
      count: xs.reduce((s, x) => s + x.valid_records, 0),
      status:
        xs.every((x) => x.status === 'success') && xs.length
          ? 'completed'
          : xs.length
            ? 'failed'
            : 'pending',
    };
  });

  const isPartialRun = run ? run.routes_requested < 40 : false;
  const completedWindows = windows.filter(w => w.status === 'completed').length;

  return (
    <div className="page-shell pipeline-page">
      <style>{`
        .pipeline-page .pipeline-eyebrow {
          background: #EEF3F7 !important;
          border-color: #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .pipeline-page .pipeline-eyebrow svg {
          color: #1976D2 !important;
        }

        .pipeline-page .pipeline-intro-panel,
        .pipeline-page .latest-run-card,
        .pipeline-page .data-flow-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .pipeline-page .pipeline-intro-copy,
        .pipeline-page .latest-run-copy,
        .pipeline-page .run-meta,
        .pipeline-page .data-flow-copy {
          color: #667685 !important;
        }

        .pipeline-page .latest-run-card .run-primary,
        .pipeline-page .run-metric-value,
        .pipeline-page .run-metric-label,
        .pipeline-page .run-metric-supporting {
          color: #17212B !important;
        }

        .pipeline-page .latest-run-card .section-label,
        .pipeline-page .data-flow-card .section-label {
          color: #17212B !important;
        }

        .pipeline-page .pipeline-run-status {
          background: #EEF3F7 !important;
          border-color: #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .pipeline-page .run-metric-label,
        .pipeline-page .run-metric-supporting {
          color: #667685 !important;
        }

        .pipeline-page .run-metric-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .pipeline-page .run-count-muted {
          color: #667685 !important;
        }

        .pipeline-page .data-flow-step {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          color: #17212B !important;
        }

        .pipeline-page .data-flow-step-icon {
          background: #EEF3F7 !important;
          border: 1px solid #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .pipeline-page .data-flow-step-label {
          color: #17212B !important;
        }

        .pipeline-page .data-flow-step-success {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
          color: #2E7D32 !important;
        }

        .pipeline-page .data-flow-step-success .data-flow-step-icon {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
          color: #2E7D32 !important;
        }

        .pipeline-page .data-flow-step-success .data-flow-step-label {
          color: #2E7D32 !important;
        }

        .pipeline-page .data-flow-arrow {
          color: #A8BAC8 !important;
        }

        .pipeline-page .lead-time-section {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .pipeline-page .lead-time-description {
          color: #667685 !important;
        }

        .pipeline-page .lead-time-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .pipeline-page .lead-time-card.lead-time-cpi {
          background: #F5F9FC !important;
          border-color: #AFC7D8 !important;
        }

        .pipeline-page .lead-time-label {
          color: #1976D2 !important;
        }

        .pipeline-page .lead-time-value {
          color: #17212B !important;
        }

        .pipeline-page .lead-time-valid {
          color: #667685 !important;
        }

        .pipeline-page .cpi-window-badge {
          background: #EAF2F7 !important;
          border: 1px solid #D7E0E8 !important;
          color: #1976D2 !important;
        }

        .pipeline-page .lead-time-status span[style*="78, 128, 102"] {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
          color: #2E7D32 !important;
        }

        .pipeline-page .run-meaning-card,
        .pipeline-page .collection-evidence-card,
        .pipeline-page .transparency-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .pipeline-page .run-meaning-card .section-label,
        .pipeline-page .collection-evidence-card .section-label,
        .pipeline-page .collection-evidence-card .card-title,
        .pipeline-page .transparency-card .transparency-heading {
          color: #17212B !important;
        }

        .pipeline-page .run-meaning-card .run-meaning-icon,
        .pipeline-page .transparency-card .transparency-icon {
          color: #1976D2 !important;
        }

        .pipeline-page .run-meaning-copy,
        .pipeline-page .collection-evidence-copy,
        .pipeline-page .transparency-copy {
          color: #667685 !important;
        }

        .pipeline-page .records-shown-badge {
          background: #EEF3F7 !important;
          border-color: #D9E1E7 !important;
          color: #667685 !important;
        }

        .pipeline-page .evidence-table {
          border-color: #D9E1E7 !important;
        }

        .pipeline-page .evidence-table thead {
          background: #F1F4F6 !important;
        }

        .pipeline-page .evidence-table tr {
          border-color: #E1E7EC !important;
        }

        .pipeline-page .evidence-table tbody tr:hover {
          background: #F5F8FA !important;
        }

        .pipeline-page .evidence-primary {
          color: #17212B !important;
        }

        .pipeline-page .evidence-secondary {
          color: #667685 !important;
        }

        .pipeline-page .evidence-status span[style*="78, 128, 102"] {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
          color: #2E7D32 !important;
        }
      `}</style>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="pipeline-eyebrow inline-flex items-center gap-2 rounded-full border border-[#D9E1E7] bg-[#EEF3F7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1976D2] shadow-sm">
            <Zap size={12} className="text-[#1976D2]" />
            COLLECTION ENGINE
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#17212B] sm:text-3xl">
            Collection Pipeline
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667685]">
            How Airlens collects and prepares real airfare observations for index calculation.
          </p>
        </div>
        <button className="button-secondary shrink-0" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="pipeline-intro-panel mb-6 rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm">
        <p className="pipeline-intro-copy text-sm leading-6 text-[#667685]">
          Airlens automatically collects airfare observations across predefined routes and advance-purchase windows. Each collection passes through validation, cleaning and database storage before eligible observations reach the index engine.
        </p>
      </div>

      {error && (
        <div className="alert-error mb-6">
          <XCircle size={15} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-[#74727A]">
          Loading collection history…
        </div>
      ) : !run ? (
        <Card>
          <div className="py-10 text-center text-sm text-[#74727A]">
            No persisted pipeline runs are available.
          </div>
        </Card>
      ) : (
        <>
          {/* Latest Collection Run */}
          <Card className="latest-run-card mb-6 overflow-hidden border-[#D9E1E7] shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-1/3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF3F7] text-[#1976D2]">
                    <Activity size={16} />
                  </div>
                  <div className="section-label">LATEST COLLECTION RUN</div>
                </div>

                <div className="mt-4">
                  <div className="pipeline-run-status inline-flex items-center gap-1.5 rounded-full border border-[#D9E1E7] bg-[#EEF3F7] px-3 py-1 text-xs font-bold text-[#1976D2]">
                    {isPartialRun ? 'PARTIAL / SINGLE-ROUTE RUN' : 'FULL BASKET RUN'}
                  </div>
                </div>

                  <div className="mt-4 text-xs font-bold uppercase tracking-wide text-[#1976D2]">
                  Airlens route basket: 40 directional routes
                </div>

                <p className="latest-run-copy mt-3 max-w-sm text-sm leading-6 text-[#667685]">
                  Latest run processed <strong className="run-primary font-semibold text-[#17212B]">{run.routes_requested}</strong> of the configured 40 routes. This run collected <strong className="run-primary font-semibold text-[#17212B]">{formatNumber(run.observations_collected)}</strong> observations across six lead-time windows.
                </p>
              </div>

              <div className="lg:w-2/3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="run-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center">
                  <div className="run-metric-value text-2xl font-bold text-[#17212B]">
                    {run.routes_succeeded} <span className="run-count-muted text-sm text-[#667685]">/ 40</span>
                  </div>
                  <div className="run-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                    Routes<br />Processed
                  </div>
                </div>

                <div className="run-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center shadow-sm">
                  <div className="run-metric-value text-2xl font-bold text-[#17212B]">
                    {formatNumber(run.observations_collected)}
                  </div>
                  <div className="run-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                    Observations<br />Collected
                  </div>
                </div>

                <div className="run-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center">
                  <div className="run-metric-value text-2xl font-bold text-[#17212B]">
                    {completedWindows} <span className="run-count-muted text-sm text-[#667685]">/ 6</span>
                  </div>
                  <div className="run-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                    Lead-Time<br />Windows
                  </div>
                </div>

                <div className="run-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center">
                  <div className={`run-metric-value text-2xl font-bold ${run.routes_failed > 0 ? 'text-[#DC2626]' : 'text-[#17212B]'}`}>
                    {run.routes_failed}
                  </div>
                  <div className="run-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                    Failed<br />Routes
                  </div>
                </div>
              </div>
            </div>
            <div className="run-meta mt-6 flex gap-4 border-t border-[#D9E1E7] pt-4 text-xs text-[#667685]">
               <span>Started: <strong className="text-[#17212B]">{new Date(run.started_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>
               {run.ended_at && <span>Ended: <strong className="text-[#17212B]">{new Date(run.ended_at).toLocaleString('en-IN', { timeStyle: 'short' })}</strong></span>}
            </div>
          </Card>

          {/* Data Flow Pipeline */}
          <Card className="data-flow-card mb-6 border-[#D9E1E7] shadow-sm">
            <div className="section-label">THE Airlens DATA FLOW</div>
            <p className="data-flow-copy mt-2 text-xs leading-5 text-[#667685]">
              Each stage transforms or checks the data before it is allowed to contribute to the final index.
            </p>

            <div className="mt-8 flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-3">
              {[
                ['Collection', Zap],
                ['Validation', ShieldCheck],
                ['Cleaning', Search],
                ['Database', Database],
                ['Index Engine', Layers],
                ['Airlens', CheckCircle2],
              ].map(([name, Icon], i, arr) => (
                <React.Fragment key={name as string}>
                  <div className={`data-flow-step relative min-w-0 w-full flex-1 rounded-xl border p-4 text-center shadow-sm transition-shadow hover:shadow-md lg:w-auto ${name === 'Airlens' ? 'data-flow-step-success' : ''}`}>
                    <div className={`data-flow-step-icon mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${name === 'Airlens' ? 'data-flow-step-success-icon' : ''}`}>
                      {React.createElement(Icon as React.ComponentType<{ size: number }>, { size: 18 })}
                    </div>
                    <div className="data-flow-step-label text-[11px] font-bold uppercase tracking-wide">
                      {name as string}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="data-flow-arrow hidden shrink-0 items-center justify-center px-1 text-[#A8BAC8] lg:flex">
                      <ArrowRight size={24} />
                    </div>
                  )}
                  {i < arr.length - 1 && (
                    <div className="data-flow-arrow flex shrink-0 items-center justify-center py-2 text-[#A8BAC8] lg:hidden">
                      <ArrowDown size={24} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>

          {/* Synchronized Lead-Time Windows */}
          <Card className="lead-time-section mb-6 border-[#D9E1E7] shadow-sm">
            <div className="section-label">SYNCHRONIZED LEAD-TIME WINDOWS</div>
            <p className="lead-time-description mt-2 text-xs leading-5 text-[#667685]">
              Airlens observes the same route at multiple advance-purchase points to capture how airfare changes as the travel date approaches.
            </p>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-4">
              {windows.map((w) => {
                const isCPI = w.days === 21;
                return (
                  <div
                    key={w.days}
                    className={`lead-time-card relative rounded-xl border p-4 text-center shadow-sm transition-transform hover:-translate-y-0.5 ${
                      isCPI
                        ? 'lead-time-cpi border-[#AFC7D8] bg-[#F5F9FC]'
                        : 'border-[#D9E1E7] bg-white'
                    }`}
                  >
                    {isCPI && (
                      <div className="cpi-window-badge absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#EAF2F7] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1976D2] shadow-sm">
                        CPI-aligned window
                      </div>
                    )}
                    <div className="lead-time-label font-mono text-sm font-bold text-[#1976D2]">
                      T+{w.days}
                    </div>
                    <div className="lead-time-value mt-3 text-2xl font-bold text-[#17212B]">
                      {formatNumber(w.count)}
                    </div>
                    <div className="lead-time-valid mt-1 mb-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                      valid
                    </div>
                    <div className="lead-time-status flex justify-center">
                      <StatusBadge
                        status={
                          w.status === 'completed'
                            ? 'completed'
                            : w.status === 'failed'
                              ? 'failed'
                              : w.status === 'running'
                                ? 'running'
                                : 'pending'
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* What does one run mean & Evidence Table */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <Card className="run-meaning-card lg:col-span-1 border-[#D9E1E7] bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <Info size={16} className="run-meaning-icon text-[#1976D2]" />
                <div className="section-label">WHAT DOES ONE RUN MEAN?</div>
              </div>
              <p className="run-meaning-copy mt-4 text-xs leading-6 text-[#667685]">
                One collection cycle queries the configured airfare source for each selected route and advance-purchase window.
                <br /><br />
                The returned fares are validated and cleaned, then stored as individual observations.
                <br /><br />
                The index engine later uses only observations that satisfy the eligibility rules.
              </p>
            </Card>

            <Card className="collection-evidence-card lg:col-span-3 overflow-hidden border-[#D9E1E7] shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="section-label">COLLECTION RUN EVIDENCE</div>
                  <h2 className="card-title mt-1">Raw collection evidence</h2>
                  <p className="collection-evidence-copy mt-2 text-xs leading-5 text-[#667685]">
                    These are actual collection-run records returned by the backend. They show the route, travel date, lead-time window and quality outcome before index aggregation.
                  </p>
                </div>
                <div className="records-shown-badge rounded-lg border border-[#D9E1E7] bg-[#EEF3F7] px-3 py-2 text-[10px] font-medium text-[#667685]">
                  {batch.length} records shown
                </div>
              </div>

              <div className="evidence-table mt-6 overflow-x-auto rounded-lg border border-[#D9E1E7]">
                <table className="w-full min-w-[800px] text-left">
                  <thead className="bg-[#F1F4F6]">
                    <tr className="border-b border-[#D9E1E7]">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Run ID</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Source</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Route</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Window</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Valid</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Rejected</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.slice(0, 100).map((x) => (
                      <tr key={x.id} className="border-b border-[#E1E7EC] transition-colors last:border-0 hover:bg-[#F5F8FA]">
                        <td className="evidence-secondary px-4 py-3 font-mono text-[10px] text-[#667685]">
                          {x.pipeline_run_id?.slice(0, 8) || '—'}
                        </td>
                        <td className="evidence-primary px-4 py-3 text-xs text-[#17212B]">{x.source}</td>
                        <td className="evidence-primary px-4 py-3 font-mono text-xs font-semibold text-[#17212B]">
                          {x.origin} → {x.destination}
                        </td>
                        <td className="evidence-secondary px-4 py-3 font-mono text-xs text-[#667685]">
                          T+{x.advance_days}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-[#2E7D32]">
                          {x.valid_records}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#D97706]">
                          {x.rejected_records + x.duplicate_records + x.outliers_flagged}
                        </td>
                        <td className="evidence-status px-4 py-3">
                          <StatusBadge
                            status={x.status === 'success' ? 'completed' : 'failed'}
                          />
                        </td>
                      </tr>
                    ))}
                    {batch.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#667685]">
                          No collection records found for this run.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Transparency Disclaimer */}
          <Card className="transparency-card bg-white border-[#D9E1E7] shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="transparency-icon text-[#1976D2]" />
              <div className="transparency-heading text-[11px] font-bold uppercase tracking-wide text-[#17212B]">
                Transparency by design
              </div>
            </div>
            <p className="transparency-copy mt-2 text-xs leading-6 text-[#667685]">
              Airlens records the collection run and individual observations separately, allowing every published index value to be traced back to its underlying collection data.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
