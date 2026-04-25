import { EnvelopeIcon as PhEnvelope } from 'phosphor-react-native/src/icons/Envelope';
import { LockIcon as PhLock } from 'phosphor-react-native/src/icons/Lock';
import { PersonSimpleRunIcon as PhRun } from 'phosphor-react-native/src/icons/PersonSimpleRun';
import { UserIcon as PhUser } from 'phosphor-react-native/src/icons/User';
import { IdentificationCardIcon as PhIdCard } from 'phosphor-react-native/src/icons/IdentificationCard';
import { MagnifyingGlassIcon as PhSearch } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { HouseIcon as PhHouse } from 'phosphor-react-native/src/icons/House';
import { UserCircleIcon as PhUserCircle } from 'phosphor-react-native/src/icons/UserCircle';
import { CaretRightIcon as PhCaretRight } from 'phosphor-react-native/src/icons/CaretRight';
import { CaretLeftIcon as PhCaretLeft } from 'phosphor-react-native/src/icons/CaretLeft';
import { CheckCircleIcon as PhCheckCircle } from 'phosphor-react-native/src/icons/CheckCircle';
import { XCircleIcon as PhXCircle } from 'phosphor-react-native/src/icons/XCircle';
import { FireIcon as PhFire } from 'phosphor-react-native/src/icons/Fire';
import { BarbellIcon as PhBarbell } from 'phosphor-react-native/src/icons/Barbell';
import { TimerIcon as PhTimer } from 'phosphor-react-native/src/icons/Timer';
import { SignOutIcon as PhSignOut } from 'phosphor-react-native/src/icons/SignOut';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/tokens';

type IconProps = {
  size?: number;
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  mirrored?: boolean;
};

export function MailIcon(props: IconProps) {
  return <PhEnvelope size={22} color={colors.brandPrimary} weight="regular" {...props} />;
}

export function LockIcon(props: IconProps) {
  return <PhLock size={22} color={colors.brandPrimary} weight="regular" {...props} />;
}

export function UserIcon(props: IconProps) {
  return <PhUser size={22} color={colors.brandPrimary} weight="regular" {...props} />;
}

export function IdCardIcon(props: IconProps) {
  return <PhIdCard size={22} color={colors.brandPrimary} weight="regular" {...props} />;
}

export function SearchIcon(props: IconProps) {
  return <PhSearch size={20} color={colors.textSecondary} weight="regular" {...props} />;
}

export function HouseIcon(props: IconProps) {
  return <PhHouse size={24} color={colors.white} weight="fill" {...props} />;
}

export function ProfileIcon(props: IconProps) {
  return <PhUserCircle size={24} color={colors.white} weight="regular" {...props} />;
}

export function CaretRightIcon(props: IconProps) {
  return <PhCaretRight size={20} color={colors.brandPrimary} weight="bold" {...props} />;
}

export function CaretLeftIcon(props: IconProps) {
  return <PhCaretLeft size={20} color={colors.white} weight="bold" {...props} />;
}

export function CheckCircleIcon(props: IconProps) {
  return <PhCheckCircle size={20} color={colors.statusSuccess} weight="fill" {...props} />;
}

export function XCircleIcon(props: IconProps) {
  return <PhXCircle size={20} color={colors.statusError} weight="fill" {...props} />;
}

export function FireIcon(props: IconProps) {
  return <PhFire size={18} color={colors.brandAccent} weight="fill" {...props} />;
}

export function BarbellIcon(props: IconProps) {
  return <PhBarbell size={18} color={colors.brandPrimary} weight="regular" {...props} />;
}

export function TimerIcon(props: IconProps) {
  return <PhTimer size={18} color={colors.brandPrimary} weight="regular" {...props} />;
}

export function SignOutIcon(props: IconProps) {
  return <PhSignOut size={22} color={colors.white} weight="regular" {...props} />;
}

export function TreadmillIcon(props: IconProps) {
  return <PhRun size={36} color={colors.white} weight="fill" {...props} />;
}

type WhistleProps = { size?: number; color?: string };
export function WhistleIcon({ size = 36, color = '#FFFFFF' }: WhistleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 13l4-3h9a4 4 0 010 8H7l-4-3z" fill={color} />
      <Circle cx="14" cy="12" r="1.3" fill="#4F56D3" />
      <Path
        d="M10 3.5l1 2.5M14 2.5v2.5M18 3.5l-1 2.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BrandN({ size = 36, color = colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 20 V8 Q4 4 8 4 H12 Q16 4 16 8 V16 Q16 20 20 20"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
