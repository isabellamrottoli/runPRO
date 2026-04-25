import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { SearchIcon, SignOutIcon } from '../components/icons';
import JoinRequestCard from '../components/JoinRequestCard';
import AthleteListItem from '../components/AthleteListItem';
import BottomTabBar from '../components/BottomTabBar';
import { useAuthStore } from '../store/auth';
import type { RootStackParamList } from '../navigation/types';
import {
  approveJoinRequest,
  fetchAthletes,
  fetchJoinRequests,
  rejectJoinRequest,
  type AthleteListItem as AthleteDto,
  type JoinRequest,
} from '../api/client';

export default function CoachHomeScreen() {
  const user = useAuthStore((s) => s.user);
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
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [athletes, setAthletes] = useState<AthleteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? '';

  const load = useCallback(async () => {
    try {
      const [reqs, ath] = await Promise.all([fetchJoinRequests(), fetchAthletes()]);
      setRequests(reqs);
      setAthletes(ath);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message ?? 'Falha ao carregar dados.');
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  async function handleApprove(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    try {
      await approveJoinRequest(id);
      const ath = await fetchAthletes();
      setAthletes(ath);
    } catch {
      await load();
    }
  }

  async function handleReject(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    try {
      await rejectJoinRequest(id);
    } catch {
      await load();
    }
  }

  const filtered = search.trim()
    ? athletes.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : athletes;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatar} />
          <Text style={styles.greeting}>
            Olá <Text style={styles.greetingBold}>{firstName}</Text>
          </Text>
          <Pressable style={styles.logoutBtn} onPress={handleLogout} hitSlop={12}>
            <SignOutIcon />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar atleta..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Solicitações ({requests.length})</Text>
          </View>
          {requests.map((r) => (
            <JoinRequestCard
              key={r.id}
              name={r.athleteName}
              message={r.message}
              onApprove={() => handleApprove(r.id)}
              onReject={() => handleReject(r.id)}
            />
          ))}
          {requests.length === 0 && (
            <Text style={styles.empty}>Nenhuma solicitação pendente.</Text>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus atletas ({athletes.length})</Text>
          </View>
          {filtered.map((a) => (
            <AthleteListItem
              key={a.id}
              name={a.name}
              nextRace={a.nextRace ?? '—'}
              lastTrainingCompleted={a.lastTrainingCompleted ?? false}
            />
          ))}
          {filtered.length === 0 && <Text style={styles.empty}>Nenhum atleta encontrado.</Text>}
        </ScrollView>
      )}

      <SafeAreaView edges={['bottom']}>
        <BottomTabBar active={tab} onChange={setTab} />
      </SafeAreaView>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F8' },
  header: {
    backgroundColor: colors.brandAccent,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.white,
  },
  greeting: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  greetingBold: { fontFamily: fonts.bold },
  logoutBtn: {
    marginLeft: 'auto',
    padding: spacing.xs,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.bgBase,
  },
  body: { flex: 1 },
  bodyContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.brandAccent,
    fontFamily: fonts.extrabold,
    fontSize: 18,
  },
  empty: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
