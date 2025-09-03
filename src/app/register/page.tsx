'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">MediCare</h1>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-gray-900">Join MediCare</h2>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}