import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, toggleRecord, setDate, submitAttendance } from '../slices/attendanceSlice';
import Toggle from '../components/common/Toggle';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

export default function StudentsPage() {
  const dispatch = useDispatch();
  const { students, records, date, loading, error } = useSelector(s => s.attendance);
  const nav = useNavigate();

  useEffect(() => {
    dispatch(fetchStudents()).unwrap().catch(err => {
      if (err && err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        nav('/login');
      }
    });
  }, [dispatch, nav]);

  function handleToggle(id) {
    dispatch(toggleRecord(id));
  }

  async function handleSubmit() {
    const payload = { date, records: students.map(s => ({ studentId: s._id, present: !!records[s._id] })) };
    try {
      await dispatch(submitAttendance(payload)).unwrap();
      alert('Attendance saved for ' + date);
    } catch (err) {
      alert('Failed to save attendance');
    }
  }

  return (
    <div className='container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Class Attendance</h2>
        <div>
          <Button onClick={() => { localStorage.removeItem('token'); nav('/login'); }}>Logout</Button>
          <Button onClick={() => nav('/summary')} style={{ marginLeft: 8 }}>View Summary</Button>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: 12 }}>
          <label>Date: </label>
          <input type='date' value={date} onChange={e => dispatch(setDate(e.target.value))} />
        </div>

        {loading && <div>Loading students...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <table>
          <thead>
            <tr><th>Roll</th><th>Name</th><th>Status</th></tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{s.rollNo}</td>
                <td style={{ padding: 8 }}>{s.name}</td>
                <td style={{ padding: 8 }}>
                  <Toggle value={!!records[s._id]} onToggle={() => handleToggle(s._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          <Button onClick={handleSubmit}>Submit Attendance</Button>
        </div>
      </Card>
    </div>
  );
}
