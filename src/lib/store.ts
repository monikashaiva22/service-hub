import { User, Vehicle, Service, Booking } from './types';

// Default services
const defaultServices: Service[] = [
  { id: 's1', serviceName: 'Oil Change', price: 49.99, description: 'Full synthetic oil change with filter replacement', duration: '30 min' },
  { id: 's2', serviceName: 'Engine Repair', price: 199.99, description: 'Diagnostics and engine repair service', duration: '2-4 hrs' },
  { id: 's3', serviceName: 'Car Wash & Detail', price: 29.99, description: 'Exterior wash, interior vacuum and detail', duration: '1 hr' },
  { id: 's4', serviceName: 'Brake Service', price: 149.99, description: 'Brake pad replacement and inspection', duration: '1-2 hrs' },
  { id: 's5', serviceName: 'Tire Rotation', price: 39.99, description: 'Rotate and balance all four tires', duration: '45 min' },
  { id: 's6', serviceName: 'AC Service', price: 89.99, description: 'AC inspection, recharge, and repair', duration: '1 hr' },
];

// Default admin
const defaultAdmin: User = {
  id: 'admin1',
  name: 'Admin',
  email: 'admin@autocare.com',
  phone: '0000000000',
  password: 'admin123',
  role: 'admin',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize defaults
export function initStore() {
  if (!localStorage.getItem('vsbs_services')) setItem('vsbs_services', defaultServices);
  const users = getItem<User[]>('vsbs_users', []);
  if (!users.find(u => u.role === 'admin')) {
    setItem('vsbs_users', [...users, defaultAdmin]);
  }
}

// Users
export const getUsers = (): User[] => getItem('vsbs_users', []);
export const addUser = (user: User) => { const users = getUsers(); users.push(user); setItem('vsbs_users', users); };
export const findUserByEmail = (email: string) => getUsers().find(u => u.email === email);

// Vehicles
export const getVehicles = (): Vehicle[] => getItem('vsbs_vehicles', []);
export const getUserVehicles = (userId: string) => getVehicles().filter(v => v.userId === userId);
export const addVehicle = (v: Vehicle) => { const all = getVehicles(); all.push(v); setItem('vsbs_vehicles', all); };
export const deleteVehicle = (id: string) => setItem('vsbs_vehicles', getVehicles().filter(v => v.id !== id));

// Services
export const getServices = (): Service[] => getItem('vsbs_services', defaultServices);
export const addService = (s: Service) => { const all = getServices(); all.push(s); setItem('vsbs_services', all); };
export const updateService = (s: Service) => setItem('vsbs_services', getServices().map(x => x.id === s.id ? s : x));
export const deleteService = (id: string) => setItem('vsbs_services', getServices().filter(s => s.id !== id));

// Bookings
export const getBookings = (): Booking[] => getItem('vsbs_bookings', []);
export const getUserBookings = (userId: string) => getBookings().filter(b => b.userId === userId);
export const addBooking = (b: Booking) => { const all = getBookings(); all.push(b); setItem('vsbs_bookings', all); };
export const updateBooking = (b: Booking) => setItem('vsbs_bookings', getBookings().map(x => x.id === b.id ? b : x));
export const cancelBooking = (id: string) => {
  const bookings = getBookings();
  const b = bookings.find(x => x.id === id);
  if (b) { b.status = 'cancelled'; setItem('vsbs_bookings', bookings); }
};
