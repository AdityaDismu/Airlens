import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FileCheck2,
  Info,
  ShieldCheck,
  XCircle,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

import {
  getAirfares,
  getQuality,
  getQualityEvents,
} from '../api/api';

import type {
  AirfareObservation,
  QualitySummary,
} from '../api/types';

function formatNumber(value: number | null | undefined) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value)
  ) {
    return '—';
  }

  return value.toLocaleString('en-IN');
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'valid':
      return 'border-[#C5DDCC] bg-[#EEF5F0] text-[#4E8066]';

    case 'flagged':
      return 'border-[#E1CFAB] bg-[#F7F2E7] text-[#95672D]';

    default:
      return 'border-[#CDC5BB] bg-[#F6F2EC] text-[#5F5A63]';
  }
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

export default function DataQuality() {
  const [quality, setQuality] =
    useState<QualitySummary | null>(null);

  const [fares, setFares] =
    useState<AirfareObservation[]>([]);

  const [events, setEvents] =
    useState<Record<string, unknown>[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getQuality(),
      getAirfares({ limit: 500 }),
      getQualityEvents(100),
    ])
      .then(([qualityData, fareData, eventData]) => {
        setQuality(qualityData);
        setFares(fareData);
        setEvents(eventData);
      })
      .catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to load data quality information',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const fareComponentRate = quality
    ? (quality.fare_component_complete /
        Math.max(quality.observations_total, 1)) *
      100
    : null;

  const validCount = quality?.observations_valid ?? 0;
  const flaggedCount = quality?.observations_flagged ?? 0;
  const totalCount = quality?.observations_total ?? 0;
  const completeComponents = quality?.fare_component_complete ?? 0;

  const latestFare = fares[0];

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const fare of fares) {
      const status = fare.quality_status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    }

    return counts;
  }, [fares]);

  return (
    <div className="page-shell data-quality-page">
      <style>{`
        .data-quality-page > .mb-7 > div:first-child > span {
          background: #EEF3F7 !important;
          border: 1px solid #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .data-quality-page > .mb-7 > div:first-child > span > span {
          background: #1976D2 !important;
        }

        .data-quality-status-card,
        .data-quality-eligibility-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .data-quality-status-card .quality-status-icon,
        .data-quality-eligibility-card .eligibility-icon {
          background: #EEF3F7 !important;
          color: #1976D2 !important;
        }

        .data-quality-status-card .quality-status-value,
        .data-quality-status-card .quality-status-copy,
        .data-quality-status-card .quality-metric-value,
        .data-quality-status-card .fare-detail-heading,
        .data-quality-eligibility-card .eligibility-heading,
        .data-quality-eligibility-card .policy-value {
          color: #17212B !important;
        }

        .data-quality-status-card .quality-status-supporting,
        .data-quality-status-card .quality-metric-label,
        .data-quality-status-card .quality-metric-supporting,
        .data-quality-status-card .fare-detail-copy,
        .data-quality-eligibility-card .eligibility-copy,
        .data-quality-eligibility-card .policy-copy {
          color: #667685 !important;
        }

        .data-quality-status-card .quality-metric-card,
        .data-quality-eligibility-card .policy-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .data-quality-status-card .fare-detail-panel {
          background: #F1F4F6 !important;
          border-color: #D9E1E7 !important;
        }

        .data-quality-eligibility-card .policy-label {
          color: #1976D2 !important;
        }

        .data-quality-eligibility-card .policy-label.warning {
          color: #D97706 !important;
        }

        .data-quality-pipeline-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .data-quality-pipeline-card .pipeline-step-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .data-quality-pipeline-card .pipeline-step-number {
          background: #EEF3F7 !important;
          border: 1px solid #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .data-quality-pipeline-card .pipeline-step-title {
          color: #17212B !important;
        }

        .data-quality-pipeline-card .pipeline-step-copy {
          color: #667685 !important;
        }

        .data-quality-pipeline-card .pipeline-arrow {
          color: #A8BAC8 !important;
        }

        .data-quality-pipeline-card .pipeline-result {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
          color: #2E7D32 !important;
        }

        .data-quality-records-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .data-quality-records-card .records-count-badge,
        .data-quality-records-card .records-provenance {
          background: #EEF3F7 !important;
          border-color: #D9E1E7 !important;
          color: #667685 !important;
        }

        .data-quality-records-card .records-provenance strong {
          color: #17212B !important;
        }

        .data-quality-records-card .records-scroll {
          scrollbar-color: #B8C7D2 #F1F4F6;
          scrollbar-width: thin;
        }

        .data-quality-records-card .records-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .data-quality-records-card .records-scroll::-webkit-scrollbar-track {
          background: #F1F4F6;
        }

        .data-quality-records-card .records-scroll::-webkit-scrollbar-thumb {
          background: #B8C7D2;
          border-radius: 999px;
        }

        .data-quality-records-card [class*="border-[#C5DDCC]"] {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
          color: #2E7D32 !important;
        }

        .data-quality-records-card [class*="border-[#E1CFAB]"] {
          background: #FFF6E8 !important;
          border-color: #E8D2A8 !important;
          color: #D97706 !important;
        }

        .data-quality-events-card,
        .data-quality-integrity-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          box-shadow: 0 12px 30px rgba(23, 33, 43, 0.055) !important;
        }

        .data-quality-events-card .events-table {
          border-color: #D9E1E7 !important;
        }

        .data-quality-events-card .events-table thead {
          background: #F1F4F6 !important;
        }

        .data-quality-events-card .events-table tr {
          border-color: #E1E7EC !important;
        }

        .data-quality-events-card .events-table tbody tr:hover {
          background: #F5F8FA !important;
        }

        .data-quality-events-card .quality-events-empty {
          background: #EEF7F2 !important;
          border-color: #C9E2D4 !important;
        }

        .data-quality-events-card .quality-events-empty svg {
          color: #2E7D32 !important;
        }

        .data-quality-events-card .quality-events-empty .empty-heading {
          color: #17212B !important;
        }

        .data-quality-events-card .quality-events-empty .empty-copy,
        .data-quality-integrity-card .integrity-copy {
          color: #667685 !important;
        }

        .data-quality-events-card .event-primary,
        .data-quality-integrity-card .integrity-heading {
          color: #17212B !important;
        }

        .data-quality-events-card .event-secondary {
          color: #667685 !important;
        }

        .data-quality-integrity-card .integrity-icon {
          color: #1976D2 !important;
        }
      `}</style>
      <PageHeader
        tag="DATA QUALITY"
        title="Data Quality & Validation"
        subtitle="Quality-control evidence for the airfare observations entering the APIx calculation pipeline."
      />

      {error ? (
        <div className="alert-error">
          <Info size={15} />
          {error}
        </div>
      ) : loading ? (
        <div className="py-16 text-center text-sm text-[#74727A]">
          Loading quality data…
        </div>
      ) : (
        <>
          {/* Quality status & Metrics (Combined for visual impact) */}
          <Card className="data-quality-status-card mb-6 overflow-hidden border-[#D9E1E7] shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="lg:w-1/3">
                <div className="flex items-center gap-2">
                  <div className="quality-status-icon flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF3F7] text-[#1976D2]">
                    <ShieldCheck size={16} />
                  </div>

                  <div className="section-label">
                    QUALITY CONTROL STATUS
                  </div>
                </div>

                <h2 className="quality-status-value mt-5 text-4xl font-bold tracking-tight text-[#17212B]">
                  {quality
                    ? `${(quality.valid_rate * 100).toFixed(1)}%`
                    : '—'}
                </h2>
                <div className="quality-status-supporting mt-1 text-xs font-bold uppercase tracking-wide text-[#2E7D32]">
                  Valid Observation Rate
                </div>

                <p className="quality-status-copy mt-4 max-w-sm text-sm leading-6 text-[#667685]">
                  <strong className="font-semibold text-[#17212B]">
                    {quality
                      ? `${(quality.valid_rate * 100).toFixed(1)}%`
                      : '—'}{' '}
                    of collected observations passed quality checks
                  </strong>
                  <br />
                  <span className="mt-2 block">
                    {formatNumber(validCount)} of{' '}
                    {formatNumber(totalCount)} observations are currently
                    eligible for index calculation.
                  </span>
                </p>
              </div>

              <div className="lg:w-2/3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="quality-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center">
                    <div className="quality-metric-value text-2xl font-bold text-[#17212B]">
                      {formatNumber(totalCount)}
                    </div>
                    <div className="quality-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                      Total collected
                      <br />
                      observations
                    </div>
                  </div>

                  <div className="quality-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center shadow-sm">
                    <div className="quality-metric-value text-2xl font-bold text-[#17212B]">
                      {formatNumber(validCount)}
                    </div>
                    <div className="quality-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                      Index eligible
                      <br />
                      observations
                    </div>
                  </div>

                  <div className="quality-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center">
                    <div className="quality-metric-value text-2xl font-bold text-[#17212B]">
                      {formatNumber(flaggedCount)}
                    </div>
                    <div className="quality-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                      Flagged
                      <br />
                      for review
                    </div>
                  </div>

                  <div className="quality-metric-card rounded-xl border border-[#D9E1E7] bg-white p-4 text-center">
                    <div className="quality-metric-value text-2xl font-bold text-[#17212B]">
                      {formatNumber(completeComponents)}
                    </div>
                    <div className="quality-metric-label mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#667685]">
                      Complete fare
                      <br />
                      components
                    </div>
                  </div>
                </div>

                <div className="fare-detail-panel mt-4 rounded-xl border border-[#D9E1E7] bg-[#F1F4F6] p-4">
                  <div className="fare-detail-heading flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#17212B]">
                    <FileCheck2 size={14} className="text-[#1976D2]" />
                    Fare component detail —{' '}
                    {fareComponentRate === null
                      ? '—'
                      : `${fareComponentRate.toFixed(1)}%`}
                  </div>
                  <p className="fare-detail-copy mt-2 text-xs leading-5 text-[#667685]">
                    The current Google Flights source provides total
                    consumer fare, but does not expose a complete breakdown
                    of base fare, taxes and fees. APIx therefore uses the
                    observed total fare rather than reconstructing
                    unavailable components.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* National eligibility */}
          <Card className="data-quality-eligibility-card mt-4 border-[#D9E1E7] shadow-sm">
            <div className="flex items-start gap-3">
              <div className="eligibility-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3F7] text-[#1976D2]">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <div className="section-label">
                  NATIONAL APIx ELIGIBILITY
                </div>

                <h2 className="eligibility-heading mt-1 text-base font-semibold text-[#17212B]">
                  Quality control feeds the index engine
                </h2>

                <p className="eligibility-copy mt-2 max-w-3xl text-xs leading-6 text-[#667685]">
                  Database-wide quality counts describe the complete stored
                  dataset. The National APIx calculation uses only
                  observations that pass the implemented eligibility rules
                  for the covered route basket and lead-time windows.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="policy-card rounded-xl border border-[#D9E1E7] bg-white p-5">
                <div className="policy-label text-[10px] font-bold uppercase tracking-wide text-[#1976D2]">
                  Quality Gate
                </div>
                <p className="policy-value mt-3 text-sm font-semibold leading-tight text-[#17212B]">
                  Only validated observations enter index calculation.
                </p>
              </div>

              <div className="policy-card rounded-xl border border-[#D9E1E7] bg-white p-5">
                <div className="policy-label warning text-[10px] font-bold uppercase tracking-wide text-[#D97706]">
                  Outlier Policy
                </div>
                <div className="policy-value mt-3 text-sm font-semibold text-[#17212B]">
                  Flag, don't delete.
                </div>
                <p className="policy-copy mt-1 text-xs leading-5 text-[#667685]">
                  Questionable observations remain available for audit.
                </p>
              </div>

              <div className="policy-card rounded-xl border border-[#D9E1E7] bg-white p-5">
                <div className="policy-label text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                  Missing Data
                </div>
                <div className="policy-value mt-3 text-sm font-semibold text-[#17212B]">
                  Don't invent.
                </div>
                <p className="policy-copy mt-1 text-xs leading-5 text-[#667685]">
                  Insufficient route coverage remains uncovered.
                </p>
              </div>
            </div>
          </Card>

          {/* Validation pipeline - Transformed to Horizontal Flow */}
          <Card className="data-quality-pipeline-card mt-4 overflow-visible border-[#D9E1E7] shadow-sm">
            <div className="section-label text-center sm:text-left">
              VALIDATION PIPELINE
            </div>
            <h2 className="card-title mt-1 text-center sm:text-left">
              Observation quality gates
            </h2>

            <div className="mt-8 flex flex-col items-center lg:flex-row lg:items-start lg:justify-between gap-3">
              {[
                [
                  '01',
                  'Route & date',
                  'Origin, destination, travel date and advance window are checked.',
                ],
                [
                  '02',
                  'Fare validity',
                  'Positive INR fare and required fare fields are validated.',
                ],
                [
                  '03',
                  'Instrument scope',
                  'Economy, adult, one-way and non-stop MVP conditions are enforced.',
                ],
                [
                  '04',
                  'Statistical QC',
                  'Outlier observations are flagged without deleting the source record.',
                ],
              ].map(([number, title, text], idx) => (
                <React.Fragment key={number}>
                  <div className="pipeline-step-card relative min-w-0 w-full flex-1 rounded-xl border border-[#D9E1E7] bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md lg:w-auto">
                    <div className="pipeline-step-number mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3F7] text-sm font-bold text-[#1976D2]">
                      {number}
                    </div>
                    <div className="pipeline-step-title mt-4 text-sm font-bold uppercase tracking-wide text-[#17212B]">
                      {title}
                    </div>
                    <p className="pipeline-step-copy mt-2 text-xs leading-5 text-[#667685]">
                      {text}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div className="pipeline-arrow mt-10 hidden shrink-0 items-center justify-center px-1 text-[#A8BAC8] lg:flex">
                      <ArrowRight size={24} />
                    </div>
                  )}
                  {idx < 3 && (
                    <div className="pipeline-arrow flex shrink-0 items-center justify-center py-2 text-[#A8BAC8] lg:hidden">
                      <ArrowDown size={24} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="pipeline-arrow mb-3 text-[#A8BAC8]">
                <ArrowDown size={24} />
              </div>
              <div className="pipeline-result rounded-full border border-[#C9E2D4] bg-[#EEF7F2] px-8 py-3 text-sm font-bold text-[#2E7D32] shadow-sm">
                Quality-controlled observations
              </div>
            </div>
          </Card>

          {/* Current source sample */}
          <Card className="data-quality-records-card mt-4 border-[#D9E1E7] shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="section-label">
                  LATEST OBSERVATION SAMPLE
                </div>

                <h2 className="card-title mt-1">
                  Stored airfare records
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#667685]">
                  This is live evidence from the stored observation layer.
                  <br />
                  Each row represents an individual airfare collected from
                  the configured source before index aggregation.
                </p>
              </div>

              <div className="records-count-badge rounded-lg border border-[#D9E1E7] bg-[#EEF3F7] px-4 py-2 text-xs font-medium text-[#667685]">
                {fares.length} records loaded
              </div>
            </div>

            {fares.length > 0 ? (
              <div className="records-scroll mt-6 max-h-[520px] overflow-x-auto overflow-y-auto rounded-lg border border-[#D9E1E7]">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="sticky top-0 z-10 bg-[#F1F4F6]">
                    <tr className="border-b border-[#D9E1E7]">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Route
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Travel date
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Lead time
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Airline
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Fare
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Quality
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {fares.slice(0, 30).map((fare) => (
                      <tr
                        key={fare.observation_id}
                        className="border-b border-[#E1E7EC] transition-colors last:border-0 hover:bg-[#F5F8FA]"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-[#17212B]">
                            {fare.origin} → {fare.destination}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-xs text-[#667685]">
                          {fare.travel_date}
                        </td>

                        <td className="px-4 py-3 text-xs text-[#667685]">
                          T+{fare.advance_days}
                        </td>

                        <td className="px-4 py-3 text-xs text-[#17212B]">
                          {fare.airline}
                        </td>

                        <td className="px-4 py-3 text-xs font-semibold text-[#17212B]">
                          ₹
                          {fare.total_fare.toLocaleString('en-IN')}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            title={
                              fare.quality_status.toLowerCase() ===
                              'flagged'
                                ? 'Why is this flagged?'
                                : undefined
                            }
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize shadow-sm ${
                              fare.quality_status.toLowerCase() ===
                              'flagged'
                                ? 'cursor-help'
                                : ''
                            } ${statusClass(fare.quality_status)}`}
                          >
                            {statusLabel(fare.quality_status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-[#D9E1E7] bg-[#F1F4F6] p-10 text-center">
                <Database
                  size={28}
                  className="mx-auto text-[#1976D2]"
                />

                <div className="mt-4 text-sm font-semibold text-[#17212B]">
                  No observation sample returned
                </div>

                <p className="mt-1 text-xs text-[#667685]">
                  Check that the backend is running and contains
                  airfare observations.
                </p>
              </div>
            )}

            {latestFare && (
              <div className="records-provenance mt-5 flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-[#D9E1E7] bg-[#EEF3F7] px-4 py-3 text-xs text-[#667685]">
                <span>
                  Latest collection:{' '}
                  <b className="font-semibold text-[#17212B]">
                    {formatDate(latestFare.collection_timestamp)}
                  </b>
                </span>

                <span>
                  Source:{' '}
                  <b className="font-semibold text-[#17212B]">
                    {latestFare.source}
                  </b>
                </span>

                <span>
                  Currency:{' '}
                  <b className="font-semibold text-[#17212B]">
                    {latestFare.currency}
                  </b>
                </span>
              </div>
            )}
          </Card>

          {/* Quality events */}
          <Card className="data-quality-events-card mt-4 border-[#D9E1E7] shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={16}
                className="text-[#1976D2]"
              />

              <div>
                <div className="section-label text-[#17212B]">QUALITY EVENTS</div>
                <h2 className="card-title">
                  Recorded validation events
                </h2>
              </div>
            </div>

            {events.length > 0 ? (
              <div className="events-table mt-5 overflow-x-auto rounded-lg border border-[#D9E1E7]">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#F1F4F6]">
                    <tr className="border-b border-[#D9E1E7]">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Event
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Count
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Route
                      </th>

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#667685]">
                        Recorded
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.slice(0, 30).map((event, index) => {
                      const eventName =
                        typeof event.event_type === 'string'
                          ? event.event_type
                          : typeof event.event === 'string'
                            ? event.event
                            : '—';

                      const count =
                        typeof event.count === 'number'
                          ? event.count
                          : null;

                      const route =
                        typeof event.origin === 'string' &&
                        typeof event.destination === 'string'
                          ? `${event.origin} → ${event.destination}`
                          : '—';

                      const timestamp =
                        typeof event.created_at === 'string'
                          ? event.created_at
                          : typeof event.timestamp === 'string'
                            ? event.timestamp
                            : null;

                      return (
                        <tr
                          key={`${eventName}-${index}`}
                          className="border-b border-[#E1E7EC] transition-colors last:border-0 hover:bg-[#F5F8FA]"
                        >
                          <td className="event-primary px-4 py-3 text-xs font-semibold capitalize text-[#17212B]">
                            {statusLabel(eventName)}
                          </td>

                          <td className="event-secondary px-4 py-3 text-xs text-[#667685]">
                            {count === null
                              ? '—'
                              : formatNumber(count)}
                          </td>

                          <td className="event-secondary px-4 py-3 font-mono text-xs text-[#667685]">
                            {route}
                          </td>

                          <td className="event-secondary px-4 py-3 text-xs text-[#667685]">
                            {formatDate(timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="quality-events-empty mt-5 flex items-start gap-3 rounded-xl border border-[#C9E2D4] bg-[#EEF7F2] p-5 shadow-sm">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-[#2E7D32]"
                />

                <div>
                  <div className="empty-heading text-sm font-semibold text-[#17212B]">
                    No additional quality events recorded for the current
                    query.
                  </div>

                  <p className="empty-copy mt-1 text-xs text-[#667685]">
                    Individual observations may still carry quality flags,
                    as shown in the sample above.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Integrity note */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="data-quality-integrity-card border-[#D9E1E7] shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="integrity-icon text-[#1976D2]" />
                <div className="integrity-heading section-label text-[#17212B]">DATA INTEGRITY</div>
              </div>

              <p className="integrity-copy mt-3 text-xs leading-6 text-[#667685]">
                Quality controls are applied before observations enter index
                calculations. Records are retained with their quality status
                so the collection history remains auditable.
              </p>
            </Card>

            <Card className="data-quality-integrity-card border-[#D9E1E7] shadow-sm">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="integrity-icon text-[#1976D2]" />
                <div className="integrity-heading section-label text-[#17212B]">
                  INTEGRITY PRINCIPLE
                </div>
              </div>

              <p className="integrity-copy mt-3 text-xs leading-6 text-[#667685]">
                APIx never replaces missing or rejected airfare
                observations with invented prices. Routes without
                sufficient eligible observations remain uncovered,
                preserving the integrity of the index.
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
