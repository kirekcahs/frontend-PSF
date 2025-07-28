import React, { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchSubmissions} from '../../assets/lib/surveySlice';
import type { RootState } from '../../store/store';
import { toast } from 'react-toastify';
import StatCard from './StatCard';
import TechChart from './TechChart';

type ChartableTech = 'preferredFrontend' | 'preferredBackend' | 'preferredDatabase' | 'preferredHosting';

// AdminDashboard component to display survey statistics and charts
const AdminDashboard: React.FC = () => { 
  const dispatch = useAppDispatch();
  const { submissions, status, error } = useAppSelector((state: RootState) => state.survey);

 // Fetch submissions when the component mounts or when the status changes 
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSubmissions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, error]);

  // Prepare data for charts
  // This function counts the occurrences of each technology in the submissions
  const chartData = useMemo(() => {
    const countTech = (field: ChartableTech) => {
      const counts = submissions.reduce((acc, submission) => {
        const tech = submission[field];
        if (tech) acc[tech] = (acc[tech] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    };
// Return the top 3 technologies for each category
    return {
      frontend: countTech('preferredFrontend'),
      backend: countTech('preferredBackend'),
      database: countTech('preferredDatabase'),
    };
  }, [submissions]);
// Render the AdminDashboard component
  if (status === 'loading') return <p className="text-center font-semibold text-lg">Loading Dashboard Data...</p>;
  if (status === 'failed') return <p className="text-center text-red-500 font-semibold text-lg">Error: Could not load dashboard data.</p>;
// If there are no submissions, display a message
  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Submissions" value={submissions.length} />
        <StatCard title="Top Frontend Tech" value={chartData.frontend[0]?.name || 'N/A'} />
        <StatCard title="Top Backend Tech" value={chartData.backend[0]?.name || 'N/A'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TechChart title="Frontend Tech Distribution" data={chartData.frontend} />
        <TechChart title="Backend Tech Distribution" data={chartData.backend} />
        <TechChart title="Database Distribution" data={chartData.database} />
      </div>

    </div>
  );
};

export default AdminDashboard;