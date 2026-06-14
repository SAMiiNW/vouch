'use client';

import { motion } from 'framer-motion';
import { UserPlus, MessageSquareQuote, Users, BadgeCheck } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Open a profile',
    body: 'A subject states a handle and exactly what they want to be vouched for. Opening a profile is a deterministic write: no AI, no deposit, only network fees.',
  },
  {
    icon: MessageSquareQuote,
    title: 'A peer vouches',
    body: 'Someone other than the subject submits an attestation backed by concrete evidence. The contract refuses a vouch from the subject themselves, so credibility is never self-issued.',
  },
  {
    icon: Users,
    title: 'Validators concur',
    body: 'Every validator re-runs the assessor independently. The ruling word must match exactly and the credibility score must agree within tolerance, or the leader rotates and the round retries.',
  },
  {
    icon: BadgeCheck,
    title: 'Credibility settles',
    body: 'The ruling, score, and note are written on-chain. A deterministic backstop clamps the score into the band its ruling requires, so a manipulation attempt can never masquerade as trusted.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="uplabel font-mono text-peri-deep">How a vouch travels</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            From claim to credibility
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-ink-soft">
            Vouch is not a like button. The assessor ruling is the settlement, reproduced
            independently by every validator before the chain records it.
          </p>
        </div>

        {/* vertical timeline with alternating sides */}
        <div className="relative mt-16">
          <div className="absolute left-[27px] top-2 bottom-2 w-1 rounded-pill accent-grad opacity-30 md:left-1/2 md:-translate-x-1/2" />
          <div className="space-y-10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const right = i % 2 === 1;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`relative flex items-start gap-6 md:w-1/2 ${
                    right ? 'md:ml-auto md:flex-row-reverse md:pl-12' : 'md:pr-12'
                  }`}
                >
                  <span className="neu z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                    <Icon size={22} className="text-peri-deep" />
                  </span>
                  <div className={`neu flex-1 rounded-soft p-6 ${right ? 'md:text-right' : ''}`}>
                    <div className={`flex items-center gap-3 ${right ? 'md:flex-row-reverse' : ''}`}>
                      <span className="tabular font-display text-2xl font-extrabold accent-text">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-lg font-bold tracking-tight text-ink">{s.title}</h3>
                    </div>
                    <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
