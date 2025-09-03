'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { AppointmentManagement } from '@/components/doctor/AppointmentManagement';

export default function DoctorDashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and patient interactions</p>
        </div>
        
        <AppointmentManagement />
      </div>
    </Layout>
  );
}