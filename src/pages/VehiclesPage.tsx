import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserVehicles, addVehicle, deleteVehicle } from '@/lib/store';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const VehiclesPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState(() => user ? getUserVehicles(user.id) : []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vehicleName: '', vehicleNumber: '', vehicleType: '' as string });

  if (!user || user.role !== 'user') return <Navigate to="/login" />;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleName || !form.vehicleNumber || !form.vehicleType) {
      toast.error('Please fill all fields'); return;
    }
    const v = {
      id: 'v_' + Date.now(),
      userId: user.id,
      vehicleName: form.vehicleName,
      vehicleNumber: form.vehicleNumber.toUpperCase(),
      vehicleType: form.vehicleType as 'car' | 'bike' | 'truck' | 'suv',
    };
    addVehicle(v);
    setVehicles([...vehicles, v]);
    setForm({ vehicleName: '', vehicleNumber: '', vehicleType: '' });
    setShowForm(false);
    toast.success('Vehicle added!');
  };

  const handleDelete = (id: string) => {
    deleteVehicle(id);
    setVehicles(vehicles.filter(v => v.id !== id));
    toast.success('Vehicle removed');
  };

  const typeEmoji: Record<string, string> = { car: '🚗', bike: '🏍️', truck: '🚛', suv: '🚙' };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">My Vehicles</h1>
            <p className="text-muted-foreground mt-1">Add and manage your vehicles</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-1" /> Add Vehicle
          </Button>
        </div>

        {showForm && (
          <Card className="glass-card mb-6">
            <CardHeader><CardTitle className="font-heading">Add New Vehicle</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Name</Label>
                  <Input placeholder="e.g. Honda Civic" value={form.vehicleName} onChange={e => setForm({ ...form, vehicleName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Number</Label>
                  <Input placeholder="e.g. ABC-1234" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select value={form.vehicleType} onValueChange={v => setForm({ ...form, vehicleType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Button type="submit">Save Vehicle</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {vehicles.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No vehicles added yet. Add your first vehicle to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(v => (
              <Card key={v.id} className="glass-card group hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl mb-2">{typeEmoji[v.vehicleType] || '🚗'}</p>
                      <h3 className="font-heading font-bold text-lg">{v.vehicleName}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{v.vehicleNumber}</p>
                      <span className="inline-block mt-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full capitalize">{v.vehicleType}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
