import axios from 'axios';
import { 
  LoginRequest, 
  RegisterPatientRequest, 
  RegisterDoctorRequest,
  ApiResponse,
  User,
  Doctor,
  Appointment,
  PaginatedResponse
} from '@/types';

const API_BASE_URL = 'https://appointment-manager-node.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (data: LoginRequest) => 
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  
  registerPatient: (data: RegisterPatientRequest) => 
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register/patient', data),
  
  registerDoctor: (data: RegisterDoctorRequest) => 
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register/doctor', data),
};

// Specializations API
export const specializationsApi = {
  getAll: () => api.get<string[]>('/specializations'),
};

// Doctors API
export const doctorsApi = {
  getAll: (params: {
    page?: number;
    limit?: number;
    search?: string;
    specialization?: string;
  }) => api.get<PaginatedResponse<Doctor>>('/doctors', { params }),
};

// Appointments API
export const appointmentsApi = {
  create: (data: { doctorId: string; date: string }) =>
    api.post<ApiResponse<Appointment>>('/appointments', data),
  
  getPatientAppointments: (params: {
    status?: string;
    page?: number;
  }) => api.get<PaginatedResponse<Appointment>>('/appointments/patient', { params }),
  
  getDoctorAppointments: (params: {
    status?: string;
    date?: string;
    page?: number;
  }) => api.get<PaginatedResponse<Appointment>>('/appointments/doctor', { params }),
  
  updateStatus: (data: {
    status: 'COMPLETED' | 'CANCELLED';
    appointment_id: string;
  }) => api.patch<ApiResponse<Appointment>>('/appointments/update-status', data),
};

export default api;