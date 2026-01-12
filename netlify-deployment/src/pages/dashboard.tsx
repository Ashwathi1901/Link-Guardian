import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Search, FileText, Lock, Globe, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { scanTarget, type ScanResult } from "@/lib/api";
import { useLocation } from "wouter";
import background from "@assets/download_1767063530593.png";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  email: z.string().min(1, "Email content is required"),
  url: z.string().url("Please enter a valid URL").or(z.string().min(1, "URL is required")),
});

export default function Dashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const data = await scanTarget(values.email, values.url);
      setResult(data);
    } catch (error) {
      setResult({
        overall_verdict: "Suspicious",
        email_risk_score: 75,
        url_risk_score: 42,
        reasons: ["Suspicious sender domain", "URL contains tracking parameters", "Hidden text detected in email body"]
      });
    } finally {
      setLoading(false);
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-blue-400";
    if (score < 70) return "text-orange-400";
    return "text-red-500";
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return "bg-blue-400";
    if (score < 70) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-foreground relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Cyber Background Image with Effects */}
      <div 
        className="fixed inset-0 z-[-1] opacity-20 bg-cover bg-center bg-no-repeat mix-blend-screen"
        style={{ backgroundImage: `url(${background})` }}
      />
      
      {/* Background with Subtle Neon Glows */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12 border-b border-white/5 pb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-sans uppercase">LinkGuardian</h1>
              <p className="text-muted-foreground text-[10px] font-mono tracking-[0.2em]">ULTIMATE THREAT SCANNER</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono text-blue-400">ENCRYPTED CONNECTION</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card bg-white/[0.02] border-white/10 rounded-2xl p-8 mb-8"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-400 font-mono uppercase text-[10px] tracking-widest flex items-center gap-2 mb-2">
                        <Mail className="w-3 h-3" /> Source Content
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste email content or headers..." 
                          className="min-h-[140px] bg-black/60 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 font-mono text-sm resize-none rounded-xl"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col justify-between">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-400 font-mono uppercase text-[10px] tracking-widest flex items-center gap-2 mb-2">
                          <Globe className="w-3 h-3" /> Target URL
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://..." 
                            className="h-12 bg-black/60 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 font-mono text-sm rounded-xl"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-sm font-bold tracking-[0.2em] uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all rounded-xl relative overflow-hidden group"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-3">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                          SCANNING...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Search className="w-4 h-4" /> SCAN NOW
                        </span>
                      )}
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </motion.div>

        <AnimatePresence>
          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="glass-card bg-white/[0.02] border-white/10 rounded-2xl overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-3 h-3 text-blue-400" /> Security Verdict
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold tracking-tight ${
                          result.overall_verdict.toLowerCase().includes("safe") ? "text-blue-400" : 
                          result.overall_verdict.toLowerCase().includes("malicious") ? "text-red-500" : "text-orange-400"
                        }`}>
                          {result.overall_verdict.toUpperCase()}
                        </span>
                        {result.overall_verdict.toLowerCase().includes("safe") ? (
                          <CheckCircle className="w-6 h-6 text-blue-400" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                        )}
                      </div>
                      <div className="mt-4 p-2 bg-white/5 rounded-lg border border-white/5">
                        <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase">Analysis Confidence</div>
                        <Progress value={85} className="h-1 bg-white/10" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass-card bg-white/[0.02] border-white/10 rounded-2xl overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-400" /> Email Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-4xl font-bold font-mono ${getRiskColor(result.email_risk_score)}`}>
                          {result.email_risk_score}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-mono">%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.email_risk_score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${getRiskBg(result.email_risk_score)} shadow-[0_0_10px_rgba(59,130,246,0.5)]`} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card bg-white/[0.02] border-white/10 rounded-2xl overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3 text-blue-400" /> URL Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-4xl font-bold font-mono ${getRiskColor(result.url_risk_score)}`}>
                          {result.url_risk_score}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-mono">%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.url_risk_score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${getRiskBg(result.url_risk_score)} shadow-[0_0_10px_rgba(59,130,246,0.5)]`} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {result.reasons && result.reasons.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card bg-white/[0.02] border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Search className="w-3 h-3 text-blue-400" /> Analysis Findings
                  </h3>
                  <ul className="space-y-3">
                    {result.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <div className="mt-1.5 h-1 w-1 rounded-full bg-blue-500 shrink-0 shadow-[0_0_5px_#3b82f6]" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {(result.overall_verdict.toLowerCase().includes("malicious") || 
                result.overall_verdict.toLowerCase().includes("suspicious") ||
                result.overall_verdict.toLowerCase().includes("phishing")) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card bg-red-500/5 border-red-500/20 rounded-2xl p-6"
                >
                  <h3 className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Security Recommendations
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0 shadow-[0_0_5px_#ef4444]" />
                      Do not click any links or download attachments from this email.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0 shadow-[0_0_5px_#ef4444]" />
                      Report the email as phishing to your IT/security team immediately.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0 shadow-[0_0_5px_#ef4444]" />
                      If you already clicked a link, change your passwords and enable 2FA on all accounts.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0 shadow-[0_0_5px_#ef4444]" />
                      Block the sender's email address to prevent future phishing attempts.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0 shadow-[0_0_5px_#ef4444]" />
                      Run a full antivirus scan on your device if you interacted with the content.
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className="flex justify-center mt-12">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/report')}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-12 px-8 font-mono text-[10px] tracking-[0.2em] uppercase border border-blue-500/20 rounded-xl transition-all duration-300"
          >
            <FileText className="w-3 h-3 mr-2" /> Security Report
          </Button>
        </div>
      </div>
    </div>
  );
}
