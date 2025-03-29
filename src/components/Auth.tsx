
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@supabase/supabase-js';

// Inizializza il client Supabase - queste andrebbero idealmente in un file .env o in un file di configurazione separato
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Errore",
        description: "Per favore inserisci email e password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto nell'area amministrativa",
      });
      
      onLoginSuccess();
    } catch (error: any) {
      console.error('Errore di login:', error);
      toast({
        title: "Errore di accesso",
        description: error.message || "Credenziali non valide",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo-sposi-oggi.png"
              alt="Sposi Oggi Logo"
              className="h-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-wedding-dark">
            Area Amministrativa
          </CardTitle>
          <CardDescription>
            Inserisci le tue credenziali per accedere
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-wedding-gold hover:bg-wedding-gold/90"
                disabled={isLoading}
              >
                {isLoading ? "Accesso in corso..." : "Accedi"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground flex justify-center">
          <p>Accesso riservato all'amministratore di Sposi Oggi Magazine</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
