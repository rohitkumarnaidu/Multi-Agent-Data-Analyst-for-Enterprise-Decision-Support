import React from 'react';
import { ReportViewer } from '@/features/reports/components/ReportViewer';

const ReportsPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <ReportViewer />
    </div>
  );
};

export default ReportsPage;
