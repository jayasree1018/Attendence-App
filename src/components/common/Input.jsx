import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{ padding: 8, width: '100%' }} />
    </div>
  );
}
