import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { LockIcon, MailIcon, TreadmillIcon, WhistleIcon } from '../components/icons';

type Tab = 'login' | 'signup';
type Role = 'coach' | 'runner';

const TABS_PADDING = 4;

export default function LoginScreen() {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [tabsWidth, setTabsWidth] = useState(0);
  const indicatorPos = useRef(new Animated.Value(0)).current;

  const halfWidth = tabsWidth > 0 ? (tabsWidth - TABS_PADDING * 2) / 2 : 0;
  const indicatorTranslate = indicatorPos.interpolate({
    inputRange: [0, 1],
    outputRange: [0, halfWidth],
  });

  useEffect(() => {
    Animated.timing(indicatorPos, {
      toValue: tab === 'login' ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [tab, indicatorPos]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoBlock}>
            <View style={styles.logoN}>
              <Text style={styles.logoNText}>N</Text>
            </View>
            <Text style={styles.logoBrand}>RUNPRO</Text>
          </View>

          <View
            style={styles.tabs}
            onLayout={(e) => setTabsWidth(e.nativeEvent.layout.width)}
          >
            {halfWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.tabIndicator,
                  { width: halfWidth, transform: [{ translateX: indicatorTranslate }] },
                ]}
              />
            )}
            <Pressable style={styles.tab} onPress={() => setTab('login')}>
              <Text
                style={[
                  styles.tabText,
                  tab === 'login' ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                Entrar
              </Text>
            </Pressable>
            <Pressable style={styles.tab} onPress={() => setTab('signup')}>
              <Text
                style={[
                  styles.tabText,
                  tab === 'signup' ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                Cadastrar
              </Text>
            </Pressable>
          </View>

          {tab === 'login' ? (
            <>
              <View style={styles.input}>
                <View style={styles.inputIconWrap}>
                  <MailIcon />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="E-mail"
                  placeholderTextColor={colors.brandPrimary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.input}>
                <View style={styles.inputIconWrap}>
                  <LockIcon />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Senha"
                  placeholderTextColor={colors.brandPrimary}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Entrar com</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialApple}></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialGoogle}>G</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <RoleCard
                title="Assessoria"
                description="Gerencie seus atletas, treinos e metas"
                icon={<WhistleIcon />}
                selected={role === 'coach'}
                onPress={() => setRole('coach')}
              />
              <RoleCard
                title="Corredor"
                description="Acompanhe seus treinos e evolua com seu coach"
                icon={<TreadmillIcon />}
                selected={role === 'runner'}
                onPress={() => setRole('runner')}
              />
              <TouchableOpacity
                style={[styles.primaryBtn, !role && styles.primaryBtnDisabled]}
                disabled={!role}
              >
                <Text style={styles.primaryBtnText}>Continuar</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

type RoleCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
};

function RoleCard({ title, description, icon, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      style={[styles.roleCard, selected && styles.roleCardSelected]}
      onPress={onPress}
    >
      <View style={styles.roleIcon}>{icon}</View>
      <View style={styles.roleText}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

const LIGHT_BG = '#F3F4F8';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  logoBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoN: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  logoNText: {
    color: colors.white,
    fontFamily: fonts.brand,
    fontSize: 36,
    lineHeight: 40,
    transform: [{ skewX: '-8deg' }],
  },
  logoBrand: {
    color: colors.bgBase,
    fontFamily: fonts.extrabold,
    fontSize: 22,
    letterSpacing: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EC',
    borderRadius: radius.full,
    padding: TABS_PADDING,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: TABS_PADDING,
    bottom: TABS_PADDING,
    left: TABS_PADDING,
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.full,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  tabText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  tabTextActive: {
    color: colors.white,
  },
  tabTextInactive: {
    color: colors.textSecondary,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    marginBottom: spacing.md,
  },
  inputIconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  inputField: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.brandPrimary,
  },
  primaryBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryBtnDisabled: {
    backgroundColor: '#9CA0B8',
  },
  primaryBtnText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0D1DD',
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },
  socialApple: {
    fontSize: 20,
    color: colors.bgBase,
  },
  socialGoogle: {
    fontFamily: fonts.extrabold,
    fontSize: 20,
    color: '#4285F4',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  roleCardSelected: {
    backgroundColor: '#EDEEFB',
    borderWidth: 2,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    color: colors.bgBase,
    fontFamily: fonts.extrabold,
    fontSize: 18,
    marginBottom: 2,
  },
  roleDescription: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
