import { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthScreenLayout from '../components/AuthScreenLayout';
import BrandTabs from '../components/BrandTabs';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import {
  IdCardIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../components/icons';
import { signupAthlete } from '../api/client';
import { useAuthStore } from '../store/auth';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupRunner'>;

export default function SignupRunnerScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [advisoryCode, setAdvisoryCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleSubmit() {
    if (!name || !email || !advisoryCode || !password || !confirm) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    setLoading(true);
    try {
      const res = await signupAthlete({
        name: name.trim(),
        email: email.trim(),
        advisoryCode: advisoryCode.trim().toUpperCase(),
        password,
      });
      setAuth(res.token, res.user);
      navigation.reset({ index: 0, routes: [{ name: 'RunnerHome' }] });
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message ?? 'Não foi possível cadastrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreenLayout>
      <BrandTabs
        value="signup"
        onChange={(t) => {
          if (t === 'login') navigation.navigate('Login');
        }}
      />

      <InputField icon={<UserIcon />} placeholder="Nome completo" value={name} onChangeText={setName} />
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
        icon={<IdCardIcon />}
        placeholder="Código da assessoria"
        autoCapitalize="characters"
        value={advisoryCode}
        onChangeText={setAdvisoryCode}
      />
      <InputField icon={<LockIcon />} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <InputField icon={<LockIcon />} placeholder="Confirmar senha" secureTextEntry value={confirm} onChangeText={setConfirm} />

      <PrimaryButton
        label={loading ? 'Cadastrando…' : 'Cadastrar'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </AuthScreenLayout>
  );
}
