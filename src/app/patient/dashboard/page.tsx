'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { DoctorList } from '@/components/patient/DoctorList';

export default function PatientDashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
          <p className="text-gray-600">Browse our network of qualified healthcare professionals</p>
        </div>
        
        <DoctorList />
      </div>
    </Layout>
  );
}