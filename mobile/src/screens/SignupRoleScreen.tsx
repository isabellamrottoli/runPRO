import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TreadmillIcon, WhistleIcon } from '../components/icons';
import AuthScreenLayout from '../components/AuthScreenLayout';
import BrandTabs from '../components/BrandTabs';
import PrimaryButton from '../components/PrimaryButton';
import RoleCard from '../components/RoleCard';
import type { RootStackParamList } from '../navigation/types';

type Role = 'coach' | 'runner';
type Props = NativeStackScreenProps<RootStackParamList, 'SignupRole'>;

export default function SignupRoleScreen({ navigation }: Props) {
  const [role, setRole] = useState<Role | null>(null);

  function onContinue() {
    if (role === 'coach') navigation.navigate('SignupCoach');
    else if (role === 'runner') navigation.navigate('SignupRunner');
  }

  return (
    <AuthScreenLayout>
      <BrandTabs
        value="signup"
        onChange={(t) => {
          if (t === 'login') navigation.navigate('Login');
        }}
      />

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

      <PrimaryButton label="Continuar" onPress={onContinue} disabled={!role} />
    </AuthScreenLayout>
  );
}
