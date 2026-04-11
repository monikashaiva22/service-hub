import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addUser, findUserByEmail } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) { toast.error('All fields are required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (findUserByEmail(form.email)) { toast.error('Email already registered'); return; }

    addUser({
      id: 'u_' + Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: 'user',
    });
    toast.success('Registration successful! Please login.');
    navigate('/login');
  };

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-3">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-heading">Create Account</CardTitle>
            <CardDescription>Join AutoCare Pro today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="John Doe" className="pl-10" value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-10" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="1234567890" className="pl-10" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10" value={form.password} onChange={e => update('password', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10" value={form.confirm} onChange={e => update('confirm', e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full">Register</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
