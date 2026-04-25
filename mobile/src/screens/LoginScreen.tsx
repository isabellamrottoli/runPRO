import { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LockIcon, MailIcon } from '../components/icons';
import AuthScreenLayout from '../components/AuthScreenLayout';
import BrandTabs from '../components/BrandTabs';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { login } from '../api/client';
import { useAuthStore } from '../store/auth';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      setAuth(res.token, res.user);
      navigation.reset({
        index: 0,
        routes: [{ name: res.user.role === 'COACH' ? 'CoachHome' : 'RunnerHome' }],
      });
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message ?? 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout>
      <BrandTabs
        value="login"
        onChange={(t) => {
          if (t === 'signup') navigation.navigate('SignupRole');
        }}
      />

      <InputField
        icon={<MailIcon />}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        icon={<LockIcon />}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <PrimaryButton label={loading ? 'Entrando…' : 'Login'} onPress={handleLogin} disabled={loading} />
    </AuthScreenLayout>
  );
}
