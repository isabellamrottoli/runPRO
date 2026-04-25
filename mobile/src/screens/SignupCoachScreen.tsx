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
import { signupCoach } from '../api/client';
import { useAuthStore } from '../store/auth';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupCoach'>;

export default function SignupCoachScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cref, setCref] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [advisoryName, setAdvisoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleSubmit() {
    if (!name || !email || !cref || !password || !confirm) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    setLoading(true);
    try {
      const res = await signupCoach({
        name: name.trim(),
        email: email.trim(),
        cref: cref.trim(),
        password,
        advisoryName: advisoryName.trim() || `${name.trim()} Assessoria`,
      });
      setAuth(res.token, res.user);
      navigation.reset({ index: 0, routes: [{ name: 'CoachHome' }] });
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
      <InputField icon={<IdCardIcon />} placeholder="CREF" value={cref} onChangeText={setCref} />
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
