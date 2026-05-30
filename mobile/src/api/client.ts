import axios from 'axios';
import { NativeModules, Platform } from 'react-native';
import { useAuthStore } from '../store/auth';

const BACKEND_PORT = 8080;

function resolveBaseURL(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/+$/, '');

  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^/:]+)(?::\d+)?/);
    if (match) return `http://${match[1]}:${BACKEND_PORT}`;
  }

  if (Platform.OS === 'android') return `http://10.0.2.2:${BACKEND_PORT}`;
  return `http://localhost:${BACKEND_PORT}`;
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export type UserRole = 'COACH' | 'ATHLETE';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  advisoryId: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password });
  return data;
}

export type CoachSignupPayload = {
  name: string;
  email: string;
  cref: string;
  password: string;
  advisoryName: string;
};

export type AthleteSignupPayload = {
  name: string;
  email: string;
  advisoryCode: string;
  password: string;
};

export async function signupCoach(payload: CoachSignupPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/signup/coach', payload);
  return data;
}

export async function signupAthlete(payload: AthleteSignupPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/signup/athlete', payload);
  return data;
}

export type Advisory = {
  id: string;
  name: string;
  code: string;
};

export type JoinRequest = {
  id: string;
  athleteId: string;
  athleteName: string;
  message: string;
  requestedAt: string;
};

export type AthleteListItem = {
  id: string;
  name: string;
  nextRace: string | null;
  lastTrainingCompleted: boolean | null;
};

export async function fetchAdvisory(): Promise<Advisory> {
  const { data } = await api.get<Advisory>('/api/coach/advisory');
  return data;
}

export async function fetchJoinRequests(): Promise<JoinRequest[]> {
  const { data } = await api.get<JoinRequest[]>('/api/coach/join-requests');
  return data;
}

export async function approveJoinRequest(id: string): Promise<void> {
  await api.post(`/api/coach/join-requests/${id}/approve`);
}

export async function rejectJoinRequest(id: string): Promise<void> {
  await api.post(`/api/coach/join-requests/${id}/reject`);
}

export async function fetchAthletes(): Promise<AthleteListItem[]> {
  const { data } = await api.get<AthleteListItem[]>('/api/coach/athletes');
  return data;
}

export type WorkoutType = 'RUNNING' | 'STRENGTH';
export type WorkoutStatus = 'PENDING' | 'COMPLETED' | 'MISSED';

export type WeekDay = {
  date: string;
  workoutId: string | null;
  workoutName: string | null;
  type: WorkoutType | null;
  status: WorkoutStatus | null;
};

export type Week = {
  start: string;
  end: string;
  days: WeekDay[];
};

export type Workout = {
  id: string;
  name: string;
  description: string | null;
  date: string;
  type: WorkoutType;
  status: WorkoutStatus;
};

export type WeeklyGoal = {
  id: string;
  description: string;
  type: 'DISTANCE' | 'TIME' | 'FREQUENCY' | 'PACE';
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string | null;
};

export async function fetchWeek(date?: string): Promise<Week> {
  const { data } = await api.get<Week>('/api/runner/week', {
    params: date ? { date } : {},
  });
  return data;
}

export async function fetchWorkout(id: string): Promise<Workout> {
  const { data } = await api.get<Workout>(`/api/runner/workouts/${id}`);
  return data;
}

export async function fetchWeeklyGoal(): Promise<WeeklyGoal | null> {
  const res = await api.get<WeeklyGoal>('/api/runner/weekly-goal', {
    validateStatus: (s) => s === 200 || s === 204,
  });
  return res.status === 204 ? null : res.data;
}

export async function completeWorkout(id: string): Promise<Workout> {
  const { data } = await api.post<Workout>(`/api/workouts/${id}/complete`);
  return data;
}

export async function missWorkout(id: string): Promise<Workout> {
  const { data } = await api.post<Workout>(`/api/workouts/${id}/miss`);
  return data;
}
