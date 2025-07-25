
import { LoginForm } from '@/components/auth/LoginForm';
import { Package } from 'lucide-react'; 

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Package className="mx-auto h-16 w-16 text-primary mb-4" /> 
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Grams to <span className="text-primary">Gains</span>
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to access your account</p>
        </div>
        <LoginForm />
      </div>
      <footer className="text-center text-muted-foreground text-sm mt-12">
        &copy; {new Date().getFullYear()} Grams to Gains. All rights reserved.
      </footer>
    </div>
  );
}
