import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import BottomTabBar from '../components/BottomTabBar';
import WeekStrip, { DayItem, DayStatus } from '../components/WeekStrip';
import WorkoutCard, { WorkoutBlock } from '../components/WorkoutCard';
import ProgressBar from '../components/ProgressBar';
import { CaretLeftIcon, SignOutIcon, TimerIcon } from '../components/icons';
import { useAuthStore } from '../store/auth';
import type { RootStackParamList } from '../navigation/types';
import {
  completeWorkout,
  fetchWeek,
  fetchWeeklyGoal,
  fetchWorkout,
  type Week,
  type WeekDay,
  type WeeklyGoal,
  type Workout,
} from '../api/client';

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function RunnerHomeScreen() {
  const logout = useAuthStore((s) => s.logout);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<'home' | 'profile'>('home');

  function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  }
  const [week, setWeek] = useState<Week | null>(null);
  const [goal, setGoal] = useState<WeeklyGoal | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [w, g] = await Promise.all([fetchWeek(), fetchWeeklyGoal()]);
    setWeek(w);
    setGoal(g);
    const todayIso = new Date().toISOString().slice(0, 10);
    const todayIdx = w.days.findIndex((d) => d.date === todayIso);
    const firstWithWorkout = w.days.findIndex((d) => d.workoutId !== null);
    setActiveIndex(todayIdx >= 0 ? todayIdx : firstWithWorkout >= 0 ? firstWithWorkout : 0);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await load();
      } catch (err: any) {
        Alert.alert('Erro', err?.response?.data?.message ?? 'Falha ao carregar semana.');
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  useEffect(() => {
    if (!week) return;
    const selected = week.days[activeIndex];
    if (!selected?.workoutId) {
      setWorkout(null);
      return;
    }
    fetchWorkout(selected.workoutId).then(setWorkout).catch(() => setWorkout(null));
  }, [week, activeIndex]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const days: DayItem[] = useMemo(() => {
    if (!week) return [];
    const todayIso = new Date().toISOString().slice(0, 10);
    return week.days.map((d, i) => ({
      label: DAY_LABELS[i],
      number: Number(d.date.slice(8)),
      status: mapStatus(d, todayIso),
      kind: mapKind(d, todayIso),
    }));
  }, [week]);

  async function handleMarkDone() {
    if (!workout) return;
    try {
      const updated = await completeWorkout(workout.id);
      setWorkout(updated);
      await load();
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message ?? 'Não foi possível marcar o treino.');
    }
  }

  const blocks: WorkoutBlock[] = workout?.description
    ? [
        {
          label: 'Treino',
          description: workout.description,
          icon: <TimerIcon />,
        },
      ]
    : [];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.weekWrap}>
        <View style={styles.weekHeaderRow}>
          <View style={styles.avatar} />
          <View style={styles.weekTitleRow}>
            <CaretLeftIcon />
            <Text style={styles.weekTitle}>Semana</Text>
            <CaretLeftIcon mirrored />
          </View>
          <Pressable style={styles.logoutBtn} onPress={handleLogout} hitSlop={12}>
            <SignOutIcon />
          </Pressable>
        </View>
        {days.length > 0 && (
          <WeekStrip days={days} activeIndex={activeIndex} onSelect={setActiveIndex} />
        )}
      </SafeAreaView>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.brandPrimary} />
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {workout ? (
            <WorkoutCard
              title={workout.name}
              blocks={blocks}
              done={workout.status === 'COMPLETED'}
              onMarkDone={handleMarkDone}
            />
          ) : (
            <View style={styles.restCard}>
              <Text style={styles.restTitle}>Dia de descanso</Text>
              <Text style={styles.restMsg}>Aproveite! Nenhum treino marcado.</Text>
            </View>
          )}

          {goal && (
            <View style={styles.goalsBlock}>
              <Text style={styles.goalsTitle}>Minhas Metas Da Semana</Text>
              <ProgressBar value={goal.currentValue} max={goal.targetValue} />
              <Text style={styles.goalsValue}>
                {formatNumber(goal.currentValue)} / {formatNumber(goal.targetValue)} {goal.unit}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <SafeAreaView edges={['bottom']}>
        <BottomTabBar active={tab} onChange={setTab} />
      </SafeAreaView>

      <StatusBar style="light" />
    </View>
  );
}

function mapStatus(d: WeekDay, todayIso: string): DayStatus {
  if (d.status === 'COMPLETED') return 'done';
  if (d.status === 'MISSED') return 'missed';
  if (!d.workoutId) return 'rest';
  if (d.date === todayIso) return 'active';
  return 'planned';
}

function mapKind(d: WeekDay, todayIso: string): DayItem['kind'] {
  if (d.date === todayIso && d.status === 'PENDING') return 'fire';
  if (d.type === 'STRENGTH') return 'strength';
  return 'run';
}

function formatNumber(n: number): string {
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F8' },
  weekWrap: {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.white,
  },
  weekTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weekTitle: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  bodyContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  goalsBlock: {
    marginTop: spacing.lg,
  },
  goalsTitle: {
    color: colors.brandAccent,
    fontFamily: fonts.extrabold,
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  goalsValue: {
    color: colors.textSecondary,
    fontFamily: fonts.semibold,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  restCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E3EF',
  },
  restTitle: {
    color: colors.brandPrimary,
    fontFamily: fonts.extrabold,
    fontSize: 18,
    marginBottom: 4,
  },
  restMsg: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
