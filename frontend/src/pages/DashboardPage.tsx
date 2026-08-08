import React from 'react';
import { Dashboard } from '@/features/dashboard/components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
