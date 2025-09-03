import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi, specializationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  patientRegisterSchema,
  doctorRegisterSchema,
  PatientRegisterFormData,
  DoctorRegisterFormData,
} from '@/lib/validations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const RegisterForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const { data: specializations } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationsApi.getAll().then(res => res.data),
  });

  const patientForm = useForm<PatientRegisterFormData>({
    resolver: zodResolver(patientRegisterSchema),
  });

  const doctorForm = useForm<DoctorRegisterFormData>({
    resolver: zodResolver(doctorRegisterSchema),
  });

  const patientMutation = useMutation({
    mutationFn: authApi.registerPatient,
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      login(user, token);
      toast.success('Registration successful!');
      router.push('/patient/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const doctorMutation = useMutation({
    mutationFn: authApi.registerDoctor,
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      login(user, token);
      toast.success('Registration successful!');
      router.push('/doctor/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const onPatientSubmit = (data: PatientRegisterFormData) => {
    const submitData = {
      ...data,
      photo_url: data.photo_url || undefined,
    };
    patientMutation.mutate(submitData);
  };

  const onDoctorSubmit = (data: DoctorRegisterFormData) => {
    const submitData = {
      ...data,
      photo_url: data.photo_url || undefined,
    };
    doctorMutation.mutate(submitData);
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'patient'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('patient')}
        >
          Register as Patient
        </button>
        <button
          type="button"
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'doctor'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('doctor')}
        >
          Register as Doctor
        </button>
      </div>

      {activeTab === 'patient' ? (
        <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...patientForm.register('name')}
            error={patientForm.formState.errors.name?.message}
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            type="email"
            {...patientForm.register('email')}
            error={patientForm.formState.errors.email?.message}
            placeholder="Enter your email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...patientForm.register('password')}
              error={patientForm.formState.errors.password?.message}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Input
            label="Photo URL (Optional)"
            {...patientForm.register('photo_url')}
            error={patientForm.formState.errors.photo_url?.message}
            placeholder="https://example.com/photo.jpg"
          />

          <Button
            type="submit"
            className="w-full"
            loading={patientMutation.isPending}
          >
            Register as Patient
          </Button>
        </form>
      ) : (
        <form onSubmit={doctorForm.handleSubmit(onDoctorSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...doctorForm.register('name')}
            error={doctorForm.formState.errors.name?.message}
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            type="email"
            {...doctorForm.register('email')}
            error={doctorForm.formState.errors.email?.message}
            placeholder="Enter your email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...doctorForm.register('password')}
              error={doctorForm.formState.errors.password?.message}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              {...doctorForm.register('specialization')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select specialization</option>
              {specializations?.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {doctorForm.formState.errors.specialization && (
              <p className="mt-1 text-sm text-red-600">
                {doctorForm.formState.errors.specialization.message}
              </p>
            )}
          </div>

          <Input
            label="Photo URL (Optional)"
            {...doctorForm.register('photo_url')}
            error={doctorForm.formState.errors.photo_url?.message}
            placeholder="https://example.com/photo.jpg"
          />

          <Button
            type="submit"
            className="w-full"
            loading={doctorMutation.isPending}
          >
            Register as Doctor
          </Button>
        </form>
      )}
    </div>
  );
};