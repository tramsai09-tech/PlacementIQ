'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, GitBranch, Target, ChevronRight, Star, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'AI-Powered Gap Detection',
    description: 'Compare your profile against thousands of real job descriptions. Know exactly which skills are blocking you.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Transparent Scoring',
    description: 'Every score has an explanation. 6 weighted components, zero hallucinations. Your score is always backed by evidence.',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: 'GitHub & Coding Analysis',
    description: 'Connect LeetCode, Codeforces, and GitHub. We analyze your projects, languages, and problem-solving depth.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Personalized Roadmap',
    description: 'A week-by-week learning plan with project ideas that directly improve your placement readiness score.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
];

const STATS = [
  { value: '15+', label: 'Target Roles Supported' },
  { value: '5', label: 'Score Components' },
  { value: '1000s', label: 'JDs Analyzed' },
  { value: '100%', label: 'Explainable AI' },
];

const STEPS = [
  {
    step: '01',
    title: 'Build Your Profile',
    description: 'Upload your resume, connect GitHub, link your LeetCode — our AI extracts the full picture of your skills.',
  },
  {
    step: '02',
    title: 'AI Runs the Analysis',
    description: 'We compare your profile against curated job descriptions for your target role and identify every gap.',
  },
  {
    step: '03',
    title: 'Get Your Action Plan',
    description: 'Receive a personalized score, skill gap report, and a week-by-week roadmap with project recommendations.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function ScoreRingDemo() {
  const score = 73;
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="scoreGradientDemo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18BADD" />
            <stop offset="100%" stopColor="#3039A1" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradientDemo)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(24,186,221,0.4))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-display font-bold text-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-text-secondary">Score</span>
      </div>
    </div>
  );
}

function HeroVisualization() {
  const skills = [
    { name: 'React', match: 90, color: '#18BADD' },
    { name: 'Node.js', match: 75, color: '#3039A1' },
    { name: 'PostgreSQL', match: 60, color: '#00D97E' },
    { name: 'Docker', match: 20, color: '#FF6B6B' },
    { name: 'Redis', match: 10, color: '#FF6B6B' },
  ];

  return (
    <motion.div
      className="glass-card gradient-border p-6 w-full max-w-sm"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ animation: 'float 4s ease-in-out infinite' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Full Stack Developer</p>
          <p className="text-sm font-display font-semibold text-text mt-0.5">Placement Readiness</p>
        </div>
        <ScoreRingDemo />
      </div>

      {/* Skill bars */}
      <div className="space-y-3">
        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-3">Skill Match vs JD</p>
        {skills.map((skill, i) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-text">{skill.name}</span>
              <span className="text-xs font-mono text-text-secondary">{skill.match}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{ background: skill.color === '#FF6B6B' ? '#FF6B6B' : `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)` }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.match}%` }}
                transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Gap alert */}
      <motion.div
        className="mt-4 p-3 rounded-xl flex items-start gap-2.5"
        style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-danger">Critical Gap: Docker</p>
          <p className="text-xs text-text-secondary mt-0.5">Appears in 82% of Full Stack JDs</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at center top, #18BADD 0%, transparent 65%)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05]" style={{ background: 'rgba(44,46,67,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #18BADD, #3039A1)' }}>
              <span className="text-bg font-display font-bold text-sm">P</span>
            </div>
            <span className="font-display font-semibold text-text text-lg">PlacementIQ</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-text-secondary hover:text-text transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-text-secondary hover:text-text transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm text-text-secondary hover:text-text transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-4 py-2">Sign in</Link>
            <Link href="/login" className="btn-primary text-sm px-4 py-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left — Copy */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-6"
                style={{ borderColor: 'rgba(24,186,221,0.3)', background: 'rgba(24,186,221,0.08)', color: '#18BADD' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                AI-Powered Placement Intelligence
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-text leading-[1.05] mb-6"
              >
                Know Exactly What
                <br />
                <span className="text-gradient">Stands Between You</span>
                <br />
                and Your Dream Job.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-text-secondary max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                PlacementIQ analyzes your resume, GitHub, and coding profiles against thousands of real job descriptions — and tells you exactly what&apos;s missing.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link href="/login" className="btn-primary px-8 py-3.5 text-base font-semibold w-full sm:w-auto">
                  Analyze My Profile Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#how-it-works" className="btn-ghost px-8 py-3.5 text-base w-full sm:w-auto">
                  See How it Works
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-bg" style={{ background: `hsl(${200 + i * 30}, 70%, 50%)` }} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-sm text-text-secondary">Trusted by 2,000+ students</span>
              </motion.div>
            </motion.div>

            {/* Right — Visualization */}
            <div className="flex-shrink-0">
              <HeroVisualization />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 px-6 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text mb-4">
              Not generic advice.<br />
              <span className="text-gradient">Real intelligence.</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every insight is grounded in data from actual job descriptions. No hallucinations. No guesswork.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 group cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-display font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                <div className={`flex items-center gap-1.5 mt-4 text-xs font-medium ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: 'linear-gradient(180deg, transparent, rgba(59,61,85,0.5), transparent)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text mb-4">
              From resume to
              <span className="text-gradient"> action plan</span>
              <br />in minutes.
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-[calc(50%-0.5px)] top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

            <div className="space-y-12">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <div className="text-xs font-mono text-primary mb-2">{step.step}</div>
                    <h3 className="text-2xl font-display font-semibold text-text mb-3">{step.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{step.description}</p>
                  </div>
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #18BADD, #3039A1)' }}>
                      <CheckCircle2 className="w-6 h-6 text-bg" />
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div
            className="glass-card gradient-border p-12"
            style={{ background: 'rgba(24,186,221,0.04)' }}
          >
            <div className="text-4xl md:text-5xl font-display font-bold text-text mb-4">
              Stop guessing.<br />
              <span className="text-gradient">Start knowing.</span>
            </div>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Get your free placement readiness analysis in minutes. No credit card required.
            </p>
            <Link href="/login" className="btn-primary text-base px-10 py-4 font-semibold inline-flex">
              Analyze My Profile — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #18BADD, #3039A1)' }}>
              <span className="text-bg font-display font-bold text-xs">P</span>
            </div>
            <span className="font-display font-semibold text-text">PlacementIQ</span>
          </div>
          <p className="text-sm text-text-secondary">© 2025 PlacementIQ. Built for students who refuse to guess.</p>
        </div>
      </footer>
    </div>
  );
}
