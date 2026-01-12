import { motion } from "framer-motion";
import { ArrowLeft, Shield, AlertTriangle, ShieldCheck, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import background from "@assets/download_1767063530593.png";

export default function ReportPage() {
  const [, setLocation] = useLocation();

  const insights = [
    {
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      title: "Security Posture",
      desc: "No high-risk vulnerabilities were detected during the automated scan. The system shows a baseline secure configuration."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      title: "Medium Risks",
      desc: "Zero medium-level threats found. Critical injection and authentication paths appear protected."
    },
    {
      icon: <Info className="w-5 h-5 text-slate-400" />,
      title: "Configuration Gaps",
      desc: "4 minor configuration issues found (Cookie security flags). These are standard hardening recommendations for production environments."
    }
  ];

  const findings = [
    {
      title: "Cookie Security (HttpOnly)",
      severity: "Low",
      impact: "Cross-site scripting (XSS) risks.",
      fix: "Enable HttpOnly flag on session cookies.",
      count: 4
    },
    {
      title: "Secure Transmission",
      severity: "Low",
      impact: "Data could be intercepted over HTTP.",
      fix: "Enforce Secure flag for all sensitive cookies.",
      count: 3
    },
    {
      title: "MIME Sniffing Protection",
      severity: "Low",
      impact: "Browser may misinterpret file types.",
      fix: "Add X-Content-Type-Options: nosniff header.",
      count: 2
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-foreground relative overflow-hidden font-sans">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-[-1] opacity-20 bg-cover bg-center bg-no-repeat mix-blend-screen"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 gap-2 font-mono text-[10px] tracking-widest uppercase border border-blue-500/20 rounded-xl"
          >
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">Security Audit Summary</h1>
          </div>
        </motion.div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card bg-white/[0.02] border-white/10 rounded-2xl p-6"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive findings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card bg-white/[0.02] border-white/10 rounded-2xl p-8"
        >
          <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
            <FileText className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-mono text-blue-400 uppercase tracking-[0.2em]">Detailed Audit Findings</h2>
          </div>

          <div className="space-y-6">
            {findings.map((finding, i) => (
              <div key={i} className="group relative p-6 rounded-xl bg-white/[0.01] border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold">{finding.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    {finding.severity}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div>
                    <p className="text-muted-foreground uppercase text-[9px] mb-1 tracking-wider">Potential Impact</p>
                    <p className="text-slate-300">{finding.impact}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase text-[9px] mb-1 tracking-wider">Recommended Action</p>
                    <p className="text-blue-400">{finding.fix}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 text-[8px] font-mono text-muted-foreground">INSTANCES: {finding.count}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Complete Scan Data available via</p>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://python--ashna89an.replit.app/security-report', '_blank')}
              className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 h-10 px-6 text-[10px] font-mono rounded-xl"
            >
              Access Raw ZAP Report
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
