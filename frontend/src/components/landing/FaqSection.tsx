import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How quickly does PulseWatch alert me when an outage occurs?',
      answer:
        'Checks execute according to your configured interval (60s, 300s, or 900s). When an endpoint fails to return the expected status code or times out, our state engine marks the monitor DOWN, creates an open incident record, and dispatches styled HTML email alerts within sub-seconds.',
    },
    {
      question: 'How does the Zero-Trust SSRF Protection work?',
      answer:
        'PulseWatch includes a dedicated kernel-level DNS pre-flight filter (SsrfValidator). Before any outbound socket is initiated, the target hostname is resolved and verified against RFC 1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopbacks (127.0.0.1), and cloud metadata endpoints (169.254.169.254). Any private target is blocked instantly.',
    },
    {
      question: 'How do Public Status Pages work?',
      answer:
        'You can generate live, public status pages at /status/:slug. Choose which monitors to display, add your custom title and description, and your users can view real-time component health, 30-day historical uptime bars, and open incident notifications without needing an account.',
    },
    {
      question: 'Is the Developer free plan really free forever?',
      answer:
        'Yes! The Developer plan is 100% free with 10 monitors, 5-minute intervals, email alerts, and a public status page. No credit card is required to sign up, and your free monitors will never expire.',
    },
    {
      question: 'Can PulseWatch be self-hosted on my own servers?',
      answer:
        'Yes. PulseWatch is designed cloud-native and packaged with Docker Compose (Alpine JRE, PostgreSQL 16, Redis 7, Nginx). It runs seamlessly on an AWS EC2 instance, DigitalOcean Droplet, or Kubernetes cluster.',
    },
    {
      question: 'What HTTP methods and response validation are supported?',
      answer:
        'PulseWatch supports both HTTP GET and HEAD requests. You can define custom expected response status codes (such as 200, 201, 204), monitor latency across 24 hours, and inspect exact error codes during failures.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-950/40 border-t border-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Common Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Have questions about how PulseWatch works? Everything you need to know about our engine.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400 bg-slate-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
