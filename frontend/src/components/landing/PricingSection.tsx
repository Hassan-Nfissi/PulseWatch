import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Developer',
      badge: 'Free Forever',
      badgeColor: 'text-slate-300 bg-slate-800/80 border-slate-700',
      description: 'Ideal for indie hackers, hobbyists, and side projects requiring solid uptime peace of mind.',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '10 HTTP(s) Monitors',
        '5-Minute Check Intervals',
        '1 Branded Public Status Page',
        'Email Outage Alerting',
        '7-Day Latency History',
        'Zero-Trust SSRF Protection',
        'Community Support',
      ],
      buttonText: 'Start for Free',
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
      popular: false,
    },
    {
      name: 'Pro',
      badge: 'Most Popular',
      badgeColor: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40',
      description: 'Built for startups, production SaaS, and growing tech teams that need rapid incident detection.',
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        '50 HTTP(s) Monitors',
        '60-Second Check Intervals',
        'Unlimited Public Status Pages',
        'SSL Certificate Expiry Tracking',
        '30-Day Rolling Latency History',
        'Custom HTTP Methods (GET / HEAD)',
        'Zero-Trust SSRF Protection',
        'Priority Alert Notifications',
      ],
      buttonText: 'Start 14-Day Free Trial',
      buttonStyle: 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25',
      popular: true,
    },
    {
      name: 'Team & Scale',
      badge: 'High Concurrency',
      badgeColor: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40',
      description: 'For mission-critical infrastructure, microservices fleets, and high-traffic applications.',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        '200+ HTTP(s) Monitors',
        '30-Second High-Frequency Checks',
        'Custom Domain Status Pages',
        'Multi-Region Telemetry Routing',
        '90-Day Time-Series Retention',
        'SLA Uptime Compliance Reports',
        'Dedicated Worker IP Pool',
        'Priority 24/7 Incident Support',
      ],
      buttonText: 'Scale With Enterprise',
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header & Toggle */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            Predictable Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Transparent plans for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              teams of every size.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            No surprise overages. No credit card required to get started. Cancel or upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center gap-4 text-sm font-semibold">
            <span className={!isAnnual ? 'text-white' : 'text-slate-400'}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors focus:outline-none"
              aria-label="Toggle billing interval"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={isAnnual ? 'text-white' : 'text-slate-400'}>
              Annual <span className="text-xs text-emerald-400 font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-slate-900 border-2 border-indigo-500/60 shadow-2xl shadow-indigo-950/40 scale-100 lg:-translate-y-2'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/30">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                        {plan.description}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      / month {isAnnual && price > 0 && <span className="text-xs text-slate-500">(billed yearly)</span>}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Included features:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-8 mt-8 border-t border-slate-800/80">
                  <Link
                    to="/login"
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${plan.buttonStyle}`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
