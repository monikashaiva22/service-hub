import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getServices, addService, updateService, deleteService } from '@/lib/store';
import { Service } from '@/lib/types';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const AdminServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState(getServices);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ serviceName: '', price: '', description: '', duration: '' });

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const resetForm = () => { setForm({ serviceName: '', price: '', description: '', duration: '' }); setEditing(null); setShowForm(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceName || !form.price || !form.description || !form.duration) { toast.error('Fill all fields'); return; }
    if (editing) {
      const updated = { ...editing, ...form, price: parseFloat(form.price) };
      updateService(updated);
      toast.success('Service updated');
    } else {
      addService({ id: 's_' + Date.now(), ...form, price: parseFloat(form.price) });
      toast.success('Service added');
    }
    setServices(getServices());
    resetForm();
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    setForm({ serviceName: s.serviceName, price: s.price.toString(), description: s.description, duration: s.duration });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteService(id);
    setServices(getServices());
    toast.success('Service deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">Manage Services</h1>
            <p className="text-muted-foreground mt-1">Add, edit, and remove services</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? <><X className="w-4 h-4 mr-1" /> Cancel</> : <><Plus className="w-4 h-4 mr-1" /> Add Service</>}
          </Button>
        </div>

        {showForm && (
          <Card className="glass-card mb-6">
            <CardHeader><CardTitle className="font-heading">{editing ? 'Edit' : 'Add'} Service</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input value={form.serviceName} onChange={e => setForm({ ...form, serviceName: e.target.value })} placeholder="e.g. Oil Change" />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="49.99" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 30 min" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Service description" />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit">{editing ? 'Update' : 'Add'} Service</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <Card key={s.id} className="glass-card group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading font-bold text-lg">{s.serviceName}</h3>
                  <span className="text-xl font-bold text-primary">${s.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                <p className="text-xs text-muted-foreground mb-4">Duration: {s.duration}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
