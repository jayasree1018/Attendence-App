import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('teacher@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      nav('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className='container'>
      <div className='card' style={{ maxWidth: 520, margin: '0 auto' }}>
        <h2>Teacher Login</h2>
        <form onSubmit={handleSubmit}>
          <Input label='Email' value={email} onChange={e => setEmail(e.target.value)} />
          <Input label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
          <div style={{ marginTop: 8 }}>
            <Button type='submit'>Login</Button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
        <div style={{ marginTop: 12, color: '#555' }}>Demo: teacher@example.com / password123</div>
      </div>
    </div>
  );
}
