
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, SkipForward, Mail } from 'lucide-react'; // Added Mail icon

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'), // In a real app, password would be min 6-8 chars
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickAccessLoading, setIsQuickAccessLoading] = useState(false);
  const [isMicrosoftLoginLoading, setIsMicrosoftLoginLoading] = useState(false); // New loading state
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const success = await login(data.username); // Password check is mocked in AuthContext
    setIsLoading(false);
    if (success) {
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
      form.setError('username', { type: 'manual', message: ' ' }); 
      form.setError('password', { type: 'manual', message: 'Invalid credentials' });
    }
  };

  const handleQuickAccess = async () => {
    setIsQuickAccessLoading(true);
    const success = await login('admin'); // Log in as admin
    setIsQuickAccessLoading(false);
    if (success) {
      toast({ title: 'Quick Access Successful', description: "Logged in as 'admin'." });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Quick Access Failed',
        description: "Could not log in as 'admin'. Ensure the user exists.",
        variant: 'destructive',
      });
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoginLoading(true);
    // Simulate Microsoft login by logging in as 'salesrep2'
    const success = await login('salesrep2'); 
    setIsMicrosoftLoginLoading(false);
    if (success) {
      toast({ title: 'Microsoft Login Successful (Simulated)', description: "Logged in as 'salesrep2'." });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Microsoft Login Failed (Simulated)',
        description: "Could not log in as 'salesrep2'. Ensure the user exists.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g. admin or salesrep1"
              {...form.register('username')}
              className={form.formState.errors.username ? 'border-destructive' : ''}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter any password"
              {...form.register('password')}
              className={form.formState.errors.password ? 'border-destructive' : ''}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isQuickAccessLoading || isMicrosoftLoginLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
         <Button
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
            onClick={handleMicrosoftLogin}
            disabled={isLoading || isQuickAccessLoading || isMicrosoftLoginLoading}
          >
            {isMicrosoftLoginLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" /> // Using Mail icon as a placeholder
            )}
            Sign in with Microsoft (Simulated)
          </Button>
          <div className="w-full text-center">
             <p className="text-xs text-muted-foreground my-1">For development:</p>
             <Button
                variant="outline"
                className="w-full"
                onClick={handleQuickAccess}
                disabled={isLoading || isQuickAccessLoading || isMicrosoftLoginLoading}
              >
                {isQuickAccessLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SkipForward className="mr-2 h-4 w-4" />
                )}
                Quick Access (Admin)
              </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
