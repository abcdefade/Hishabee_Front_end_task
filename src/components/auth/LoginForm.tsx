import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'PATIENT',
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      login(user, token);
      toast.success('Login successful!');
      
      const redirectPath = user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
      router.push(redirectPath);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const selectedRole = watch('role');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Login as
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="relative">
            <input
              type="radio"
              value="PATIENT"
              {...register('role')}
              className="sr-only"
            />
            <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedRole === 'PATIENT'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium">Patient</div>
              </div>
            </div>
          </label>
          
          <label className="relative">
            <input
              type="radio"
              value="DOCTOR"
              {...register('role')}
              className="sr-only"
            />
            <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedRole === 'DOCTOR'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium">Doctor</div>
              </div>
            </div>
          </label>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="Enter your email"
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={errors.password?.message}
          placeholder="Enter your password"
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={loginMutation.isPending}
      >
        Sign In
      </Button>
    </form>
  );
};