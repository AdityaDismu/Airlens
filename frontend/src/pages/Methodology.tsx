import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle,
  CopyMinus,
  Database,
  FileText,
  Info,
  Layers,
  Search,
  Settings2,
  ShieldCheck,
  Weight,
} from 'lucide-react';

import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { getMethodology } from '../api/api';
import type { Methodology as MethodologyType } from '../api/types';

function Step({
  n,
  title,
  text,
  Icon,
}: {
  n: string;
  title: string;
  text: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="methodology-step-card relative flex flex-col rounded-2xl border border-[#D9E1E7] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between">
        <div className="methodology-step-icon flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3F7] text-[#1976D2] shadow-sm">
          <Icon size={24} strokeWidth={2} />
        </div>
        <div className="methodology-step-number font-mono text-3xl font-black text-[#AFC7D8] select-none">
          {n}
        </div>
      </div>

      <h3 className="methodology-step-title text-base font-bold text-[#17212B]">
        {title}
      </h3>

      <p className="methodology-step-copy mt-3 flex-1 text-sm leading-6 text-[#667685]">
        {text}
      </p>
    </div>
  );
}

function Formula({
  title,
  formula,
  note,
}: {
  title: string;
  formula: React.ReactNode;
  note: string;
}) {
  return (
    <div className="methodology-formula-card flex flex-col overflow-hidden rounded-2xl border border-[#D9E1E7] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="border-b border-[#D9E1E7] bg-white px-5 py-3.5 flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#17212B]">{title}</h4>
        <Calculator size={14} className="text-[#1976D2]" />
      </div>
      
      <div className="methodology-formula-area relative flex flex-1 items-center justify-center overflow-hidden bg-[#17212B] p-6">
        {/* Subtle background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#667685_1px,transparent_1px),linear-gradient(to_bottom,#667685_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-10"></div>
        <div className="methodology-formula-text relative z-10 w-full overflow-x-auto whitespace-nowrap py-2 text-center font-mono text-[15px] tracking-wide text-white sm:text-base [&_sub]:text-white [&_sup]:text-white">
          {formula}
        </div>
      </div>

      <div className="border-t border-[#D9E1E7] bg-white px-5 py-4">
        <p className="text-xs leading-5 text-[#667685]">
          {note}
        </p>
      </div>
    </div>
  );
}

export default function Methodology() {
  const [m, setM] = useState<MethodologyType | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMethodology()
      .then(setM)
      .catch((e) =>
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to load methodology',
        ),
      );
  }, []);

  return (
    <div className="page-shell methodology-page">
      <style>{`
        .methodology-page > .mb-6 > div:first-child {
          background: #EEF3F7 !important;
          border-color: #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .methodology-page > .mb-6 > div:first-child svg {
          color: #1976D2 !important;
        }

        .methodology-page .methodology-summary-card,
        .methodology-page .methodology-pipeline-section {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .methodology-page .methodology-summary-block {
          background: #FFFFFF !important;
        }

        .methodology-page .methodology-summary-label,
        .methodology-page .methodology-summary-copy {
          color: #667685 !important;
        }

        .methodology-page .methodology-summary-value {
          color: #17212B !important;
        }

        .methodology-page .methodology-window-chip {
          background: #EEF3F7 !important;
          border: 1px solid #D9E1E7 !important;
          color: #1976D2 !important;
        }

        .methodology-page .methodology-pipeline-heading,
        .methodology-page .methodology-formulas-heading {
          color: #17212B !important;
        }

        .methodology-page .methodology-pipeline-icon,
        .methodology-page .methodology-formulas-icon {
          color: #1976D2 !important;
        }

        .methodology-page .methodology-formula-area,
        .methodology-page .methodology-formula-area .methodology-formula-text,
        .methodology-page .methodology-formula-area .methodology-formula-text * {
          color: #FFFFFF !important;
        }

        .methodology-page .standardization-card,
        .methodology-page .national-aggregation-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .methodology-page .standardization-heading,
        .methodology-page .national-aggregation-heading,
        .methodology-page .flow-step-label,
        .methodology-page .aggregation-card-heading {
          color: #17212B !important;
        }

        .methodology-page .standardization-description,
        .methodology-page .aggregation-subtitle,
        .methodology-page .flow-step-copy,
        .methodology-page .aggregation-card-copy {
          color: #667685 !important;
        }

        .methodology-page .standardization-flow {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .methodology-page .standardization-flow-step {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
          color: #17212B !important;
        }

        .methodology-page .standardization-final-step {
          background: #EEF3F7 !important;
          border-color: #AFC7D8 !important;
          color: #1976D2 !important;
        }

        .methodology-page .standardization-arrow {
          color: #A8BAC8 !important;
        }

        .methodology-page .standardization-warning {
          background: #FFF8ED !important;
          border-color: #E8D2A8 !important;
          color: #667685 !important;
        }

        .methodology-page .standardization-warning strong,
        .methodology-page .standardization-warning svg {
          color: #17212B !important;
        }

        .methodology-page .standardization-warning svg {
          color: #D97706 !important;
        }

        .methodology-page .aggregation-card,
        .methodology-page .aggregation-card-heading,
        .methodology-page .aggregation-card-copy {
          border-color: #D9E1E7 !important;
        }

        .methodology-page .aggregation-dot-reference { background: #1976D2 !important; }
        .methodology-page .aggregation-dot-covered { background: #2E7D32 !important; }
        .methodology-page .aggregation-dot-missing { background: #D97706 !important; }

        .methodology-page .national-aggregation-icon { color: #1976D2 !important; }

        .methodology-page .prototype-state-panel,
        .methodology-page .policy-card,
        .methodology-page .auditability-card {
          background: #FFFFFF !important;
          border-color: #D9E1E7 !important;
        }

        .methodology-page .prototype-state-panel {
          background: #EEF3F7 !important;
        }

        .methodology-page .prototype-state-heading,
        .methodology-page .policy-heading,
        .methodology-page .policy-card-heading,
        .methodology-page .auditability-card-heading {
          color: #17212B !important;
        }

        .methodology-page .prototype-state-copy,
        .methodology-page .policy-copy,
        .methodology-page .policy-subtitle,
        .methodology-page .periodic-description,
        .methodology-page .periodic-secondary,
        .methodology-page .auditability-subtitle,
        .methodology-page .auditability-copy {
          color: #667685 !important;
        }

        .methodology-page .prototype-state-heading svg,
        .methodology-page .policy-icon-cpi,
        .methodology-page .policy-icon-periodic {
          color: #1976D2 !important;
        }

        .methodology-page .policy-icon-source,
        .methodology-page .auditability-icon {
          color: #2E7D32 !important;
        }

        .methodology-page .policy-divider,
        .methodology-page .periodic-row {
          border-color: #D9E1E7 !important;
        }
      `}</style>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D9E1E7] bg-[#EEF3F7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1976D2] shadow-sm mb-3">
          <BookOpen size={12} className="text-[#1976D2]" />
          TECHNICAL DOCUMENTATION
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#17212B] sm:text-4xl">
          APIx Methodology
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#667685]">
          The implemented statistical path from live airfare observations to route, national and periodic indicators.
        </p>
      </div>

      {error ? (
        <div className="alert-error mt-6">
          <Info size={15} />
          {error}
        </div>
      ) : !m ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6B5A78] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
          <div className="mt-4 text-sm font-medium text-[#74727A]">Loading backend methodology…</div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Methodology summary banner */}
          <div className="methodology-summary-card overflow-hidden rounded-2xl border border-[#D9E1E7] bg-white shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-[#D9E1E7] md:grid-cols-3 md:divide-x md:divide-y-0">
              <div className="methodology-summary-block flex flex-col justify-center bg-white p-5">
                <div className="methodology-summary-label mb-1 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Version</div>
                <div className="methodology-summary-value text-xl font-bold text-[#17212B]">{m.version}</div>
              </div>
              <div className="methodology-summary-block flex flex-col justify-center bg-white p-5">
                <div className="methodology-summary-label mb-1 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Base Index</div>
                <div className="methodology-summary-value text-xl font-bold text-[#17212B]">{m.base_index}</div>
              </div>
              <div className="methodology-summary-block flex flex-col justify-center bg-white p-5">
                <div className="methodology-summary-label mb-1 text-[10px] font-bold uppercase tracking-wide text-[#667685]">Lead-time Windows</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {m.lead_time_windows.map((x) => (
                    <span key={x} className="methodology-window-chip inline-flex items-center rounded-md bg-[#EEF3F7] px-2 py-1 text-[11px] font-semibold text-[#1976D2]">
                      T+{x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-[#D9E1E7] p-5">
              <div className="flex gap-3 items-start">
                <Info size={18} className="shrink-0 mt-0.5 text-[#1976D2]" />
                <p className="methodology-summary-copy text-sm leading-6 text-[#667685]">
                  {m.cpi_relationship}
                </p>
              </div>
            </div>
          </div>

          {/* Methodology flow */}
          <div className="methodology-pipeline-section rounded-2xl border border-[#D9E1E7] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Layers size={18} className="methodology-pipeline-icon text-[#1976D2]" />
              <h2 className="methodology-pipeline-heading text-lg font-bold text-[#17212B]">Data Processing Pipeline</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Step
                n="01"
                title="Collect"
                Icon={Search}
                text="The collection layer requests current fares from configured live sources for the representative route basket and the configured advance-purchase windows."
              />
              <Step
                n="02"
                title="Validate"
                Icon={ShieldCheck}
                text="Route, travel date, currency, fare, stops, duration and required-field constraints are applied before an observation becomes eligible for index calculation."
              />
              <Step
                n="03"
                title="Standardize"
                Icon={Settings2}
                text="The prototype targets an adult, economy, one-way, non-stop fare and uses the total mandatory consumer fare actually exposed by the source."
              />
              <Step
                n="04"
                title="Deduplicate"
                Icon={CopyMinus}
                text="Stable observation and flight-instance keys are used to prevent the same underlying flight observation from being counted repeatedly within the collection and cleaning process."
              />
              <Step
                n="05"
                title="Flag outliers"
                Icon={AlertTriangle}
                text="Statistical outlier detection flags unusually distant observations. Flagged records remain stored for auditability but are excluded from index calculations."
              />
              <Step
                n="06"
                title="Calculate"
                Icon={Calculator}
                text="Valid price relatives are aggregated using a geometric-mean/Jevons-style calculation at the elementary level, followed by route aggregation and passenger-volume-weighted national aggregation."
              />
            </div>
          </div>

          {/* Core formulas */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <FileText size={18} className="methodology-formulas-icon text-[#1976D2]" />
              <h2 className="methodology-formulas-heading text-lg font-bold text-[#17212B]">Core Statistical Formulas</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Formula
                title="Price Relative"
                note="P is the standardized mandatory consumer fare. The reference fare is the matched base/reference observation for the same route and lead-time window."
                formula={<span>R = (P<sub>current</sub> / P<sub>reference</sub>) × 100</span>}
              />

              <Formula
                title="Jevons Elementary Index"
                note="Positive price relatives are combined using the geometric mean. This provides the elementary airfare movement measure used by the prototype."
                formula={<span>I = (∏ R<sub>i</sub>)<sup>1/n</sup></span>}
              />

              <Formula
                title="Route APIx"
                note="The route index combines the available lead-time-window price relatives using the implemented geometric-mean aggregation. A route is reported only from eligible observed windows."
                formula={<span>I<sub>route,t</sub> = (∏ R<sub>route,t,w</sub>)<sup>1/k</sup></span>}
              />

              <Formula
                title="DGCA Passenger-Volume Route Weight"
                note="Q represents passenger volume for route r in the verified DGCA reference dataset. The weights are derived from reference traffic data, not generated by the airfare scraper."
                formula={<span>w<sub>r</sub> = Q<sub>r</sub> / ΣQ<sub>r</sub></span>}
              />

              <Formula
                title="National APIx"
                note="The national indicator uses a passenger-volume-weighted geometric aggregation of covered route indexes. Weights of covered routes are renormalized when some configured routes are unavailable."
                formula={<span>APIx<sub>t</sub> = exp(Σ w<sub>r</sub> × ln(I<sub>r,t</sub>))</span>}
              />

              <Formula
                title="Publication Coverage"
                note="National publication requires the configured minimum route-coverage condition. The current prototype threshold is 80% of the weighted route basket."
                formula={<span>Coverage<sub>t</sub> = W<sub>covered</sub> / W<sub>total</sub></span>}
              />
            </div>
          </div>

          {/* Fare standardization visually enhanced */}
          <Card className="standardization-card border-[#D9E1E7] shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Settings2 size={18} className="text-[#1976D2]" />
              <div>
                <h2 className="standardization-heading text-base font-bold text-[#17212B]">Fare Standardization Pipeline</h2>
                <p className="standardization-description mt-1 text-xs text-[#667685]">Transforming raw inputs into comparable elementary prices</p>
              </div>
            </div>

            <div className="standardization-flow flex flex-col items-center justify-between gap-3 rounded-xl border border-[#D9E1E7] bg-white p-6 lg:flex-row">
              {[
                'Observed source fare',
                'Adult',
                'Economy',
                'One-way',
                'Non-stop',
                'Mandatory charges',
              ].map((x, i) => (
                <React.Fragment key={x}>
                  <div className="standardization-flow-step w-full flex-1 rounded-lg border border-[#D9E1E7] bg-white p-3 text-center text-xs font-semibold text-[#17212B] shadow-sm lg:w-auto">
                    {x}
                  </div>
                  <div className="standardization-arrow hidden shrink-0 items-center justify-center text-[#A8BAC8] lg:flex">
                    <ArrowRight size={16} />
                  </div>
                  <div className="standardization-arrow flex shrink-0 items-center justify-center py-1 text-[#A8BAC8] lg:hidden">
                    <ArrowDown size={16} />
                  </div>
                </React.Fragment>
              ))}
              <div className="standardization-final-step w-full flex-1 rounded-lg border border-[#AFC7D8] bg-[#EEF3F7] p-3 text-center text-xs font-bold text-[#1976D2] shadow-sm ring-2 ring-[#EEF3F7] lg:w-auto">
                Standardized fare
              </div>
            </div>

            <div className="standardization-warning mt-5 flex gap-3 rounded-lg border border-[#E8D2A8] bg-[#FFF8ED] p-4 text-[#667685]">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#D97706]" />
              <p className="text-xs leading-5">
                <strong>Excluded from standardization:</strong> Optional baggage, seat selection, meals, insurance, flexible upgrades and member/coupon discounts are strictly excluded and not silently added to the standardized price.
              </p>
            </div>
          </Card>

          {/* National APIx explanation */}
          <Card className="national-aggregation-card border-[#D9E1E7] shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Weight size={18} className="national-aggregation-icon text-[#1976D2]" />
              <div>
                <h2 className="national-aggregation-heading text-base font-bold text-[#17212B]">National Aggregation</h2>
                <p className="aggregation-subtitle mt-1 text-xs text-[#667685]">Passenger-volume-weighted route basket approach</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="aggregation-card rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="aggregation-dot-reference h-2 w-2 rounded-full bg-[#1976D2]"></div>
                  <div className="aggregation-card-heading text-sm font-bold text-[#17212B]">Reference basket</div>
                </div>
                <p className="aggregation-card-copy text-xs leading-5 text-[#667685]">
                  The prototype uses the verified DGCA passenger-volume reference dataset to construct the route basket and assign accurate baseline route weights.
                </p>
              </div>

              <div className="aggregation-card rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="aggregation-dot-covered h-2 w-2 rounded-full bg-[#2E7D32]"></div>
                  <div className="aggregation-card-heading text-sm font-bold text-[#17212B]">Covered routes</div>
                </div>
                <p className="aggregation-card-copy text-xs leading-5 text-[#667685]">
                  Only routes with sufficient valid, standardizable airfare observations are permitted to contribute to the published national calculation.
                </p>
              </div>

              <div className="aggregation-card rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="aggregation-dot-missing h-2 w-2 rounded-full bg-[#D97706]"></div>
                  <div className="aggregation-card-heading text-sm font-bold text-[#17212B]">Missing routes</div>
                </div>
                <p className="aggregation-card-copy text-xs leading-5 text-[#667685]">
                  Missing routes are never assigned artificial or imputed prices. Instead, the weights of the successfully covered routes are renormalized.
                </p>
              </div>
            </div>

            <div className="prototype-state-panel mt-5 rounded-xl border border-[#D9E1E7] bg-[#EEF3F7] p-5 shadow-inner">
              <div className="prototype-state-heading mb-2 flex items-center gap-2 text-sm font-bold text-[#17212B]">
                <Activity size={16} />
                Current prototype state
              </div>
              <p className="prototype-state-copy text-sm leading-6 text-[#667685]">
                The current National APIx is calculated from the configured <strong>40-directional-route basket</strong>. The latest verified build uses <strong>38 covered routes</strong>, representing <strong>95.0% route coverage</strong>, weighted strictly against DGCA 2024–25 passenger-volume data.
              </p>
            </div>
          </Card>

          {/* 3-Column Policy Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Data source policy */}
            <Card className="policy-card flex flex-col border-[#D9E1E7] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="policy-icon-source text-[#2E7D32]" />
                <h3 className="policy-heading text-sm font-bold text-[#17212B]">Data Source Policy</h3>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="policy-card-heading text-xs font-bold text-[#17212B]">Live measurement layer</h4>
                  <p className="policy-copy mt-1 text-xs leading-5 text-[#667685]">
                    Airfare observations are collected during scheduled runs and stored with precise timestamps, route, travel date, lead time, source and quality metadata.
                  </p>
                </div>
                <div className="policy-divider h-px w-full bg-[#D9E1E7]"></div>
                <div>
                  <h4 className="policy-card-heading text-xs font-bold text-[#17212B]">Reference layer</h4>
                  <p className="policy-copy mt-1 text-xs leading-5 text-[#667685]">
                    DGCA traffic data strictly supplies route-selection and passenger-volume weights. It is never used as a substitute for live airfare measurements.
                  </p>
                </div>
              </div>
            </Card>

            {/* CPI relationship */}
            <Card className="policy-card flex flex-col border-[#D9E1E7] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Database size={18} className="policy-icon-cpi text-[#1976D2]" />
                <h3 className="policy-heading text-sm font-bold text-[#17212B]">Relationship to CPI</h3>
              </div>
              <div className="flex-1">
                <div className="rounded-lg border border-[#D9E1E7] bg-[#EEF3F7] p-4 h-full">
                  <h4 className="policy-card-heading mb-2 text-xs font-bold text-[#17212B]">High-frequency augmentation indicator</h4>
                  <p className="policy-copy text-xs leading-5 text-[#667685]">
                    APIx is explicitly designed as a high-frequency airfare price indicator meant to augment airfare price measurement for real-time economic monitoring. It should not be interpreted as a replacement for the official CPI produced by NSO/MoSPI.
                  </p>
                </div>
              </div>
            </Card>

            {/* Periodic indices */}
            <Card className="policy-card flex flex-col border-[#D9E1E7] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="policy-icon-periodic text-[#1976D2]" />
                <h3 className="policy-heading text-sm font-bold text-[#17212B]">Periodic Indices</h3>
              </div>
              <div className="flex-1 space-y-3 text-xs">
                <p className="periodic-description mb-3 leading-5 text-[#667685]">
                  Historical gaps are preserved; the frontend does not fill missing periods with fabricated values.
                </p>
                <div className="periodic-row flex items-center justify-between border-b border-[#D9E1E7] pb-2">
                  <span className="font-semibold text-[#17212B]">Daily</span>
                  <span className="periodic-secondary text-[#667685]">Short-term movement</span>
                </div>
                <div className="periodic-row flex items-center justify-between border-b border-[#D9E1E7] pb-2">
                  <span className="font-semibold text-[#17212B]">Weekly</span>
                  <span className="periodic-secondary text-[#667685]">Smoothed movement</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="font-semibold text-[#17212B]">Monthly</span>
                  <span className="periodic-secondary text-[#667685]">Long-period aggregation</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Auditability */}
          <Card className="auditability-card border-[#D9E1E7] bg-white shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CheckCircle size={18} className="auditability-icon text-[#2E7D32]" />
              <div>
                <h2 className="text-base font-bold text-[#17212B]">Reproducibility & Auditability</h2>
                <p className="auditability-subtitle mt-1 text-xs text-[#667685]">Every published value has traceable inputs</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="auditability-card-heading font-bold text-[#17212B]">Timestamped observations</div>
                <p className="auditability-copy mt-2 text-xs leading-5 text-[#667685]">
                  Immutable collection timestamps precisely identify when live airfare observations entered the system pipeline.
                </p>
              </div>

              <div className="rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="auditability-card-heading font-bold text-[#17212B]">Versioned methodology</div>
                <p className="auditability-copy mt-2 text-xs leading-5 text-[#667685]">
                  The backend clearly exposes the methodology version used by the index calculation for absolute version control.
                </p>
              </div>

              <div className="rounded-xl border border-[#D9E1E7] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="auditability-card-heading font-bold text-[#17212B]">Quality traceability</div>
                <p className="auditability-copy mt-2 text-xs leading-5 text-[#667685]">
                  Flagged observations remain securely stored for deep audits rather than being silently deleted from the dataset.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
