import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const safeNext = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export default function Login() {
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = next;
    });
  }, [next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
        return;
      }
      window.location.href = next;
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${next}` },
      });
      setBusy(false);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Check your email", description: "Confirm your address to finish signing up." });
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
    });
    if (result.error) {
      setBusy(false);
      toast({ title: "Google sign in failed", description: String(result.error), variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    window.location.href = next;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? "Sign in" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to connect findadentist to your other apps.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>
          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
            Continue with Google
          </Button>
          <button
            type="button"
            className="text-sm text-primary underline w-full"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </Card>
      </main>
    </div>
  );
}
