import React from 'react';

export default function Toggle({ value, onToggle }) {
  return (
    <button onClick={() => onToggle(!value)} style={{ padding: '6px 10px', borderRadius: 6 }}>
      {value ? 'Present' : 'Absent'}
    </button>
  );
}
