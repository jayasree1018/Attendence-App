import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Async thunks
export const fetchStudents = createAsyncThunk('attendance/fetchStudents', async (_, thunkAPI) => {
  const res = await API.get('/students');
  return res.data;
});

export const submitAttendance = createAsyncThunk('attendance/submitAttendance', async (payload, thunkAPI) => {
  // payload: { date, records }
  const res = await API.post('/attendance', payload);
  return res.data;
});

export const fetchSummary = createAsyncThunk('attendance/fetchSummary', async () => {
  const res = await API.get('/attendance/summary');
  return res.data;
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    students: [],
    records: {}, // { studentId: boolean }
    date: new Date().toISOString().slice(0,10),
    loading: false,
    error: null,
    summary: [],
    totalDays: 0
  },
  reducers: {
    toggleRecord(state, action) {
      const id = action.payload;
      state.records[id] = !state.records[id];
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setRecords(state, action) {
      state.records = action.payload;
    },
    clearError(state) { state.error = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        // initialize records if empty
        const map = {};
        action.payload.forEach(s => { map[s._id] = true; });
        state.records = map;
      })
      .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(submitAttendance.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitAttendance.fulfilled, (state) => { state.loading = false; })
      .addCase(submitAttendance.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchSummary.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary || [];
        state.totalDays = action.payload.totalDays || 0;
      })
      .addCase(fetchSummary.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export const { toggleRecord, setDate, setRecords, clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
