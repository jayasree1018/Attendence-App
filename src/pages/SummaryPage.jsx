import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummary } from '../slices/attendanceSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

export default function SummaryPage() {
  const dispatch = useDispatch();
  const { summary, totalDays, loading } = useSelector(s => s.attendance);
  const nav = useNavigate();

  useEffect(() => {
    dispatch(fetchSummary()).unwrap().catch(err => {
      if (err && err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        nav('/login');
      }
    });
  }, [dispatch, nav]);

  const chartData = summary.map(s => ({ name: s.name, percentage: s.percentage }));

  return (
    <div className='container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Attendance Summary</h2>
        <div>
          <Button onClick={() => nav('/students')}>Back</Button>
        </div>
      </div>

      <Card>
        <p>Total recorded days: {totalDays}</p>
        {loading && <div>Loading...</div>}
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis unit='%' />
              <Tooltip />
              <Bar dataKey='percentage' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
