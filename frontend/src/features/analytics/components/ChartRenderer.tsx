import React, { useMemo } from 'react';
import { ChartSpec } from '@/types/chat';
import ReactECharts from 'echarts-for-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface ChartRendererProps {
  spec: ChartSpec;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ spec }) => {
  const { chart_type, title, data } = spec;

  // Render ECharts if data looks like ECharts config
  if (data.series && data.xAxis) {
    const option = {
      title: { text: title, left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0 },
      ...data,
    };
    return (
      <div className="w-full h-80 mt-4 border border-gray-200 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }

  // Otherwise, use Recharts based on standard data array
  // Assuming data is { rows: [{ name: 'A', value: 10 }, ...] } or just an array
  const chartData = Array.isArray(data) ? data : (data.rows || []);
  if (chartData.length === 0) return null;

  const renderRecharts = () => {
    const keys = Object.keys(chartData[0]).filter(k => k !== 'name' && k !== 'x');
    const xKey = Object.keys(chartData[0]).includes('name') ? 'name' : 'x';

    switch (chart_type.toLowerCase()) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {keys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {keys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} activeDot={{ r: 8 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey={keys[0]} nameKey={xKey} cx="50%" cy="50%" outerRadius={80} label>
                {chartData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="text-red-500">Unsupported chart type: {chart_type}</div>;
    }
  };

  return (
    <div className="w-full h-80 mt-4 border border-gray-200 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
      <h3 className="text-center font-medium text-sm text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
      {renderRecharts()}
    </div>
  );
};
