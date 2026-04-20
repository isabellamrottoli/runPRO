import { EnvelopeIcon as PhEnvelope } from 'phosphor-react-native/src/icons/Envelope';
import { LockIcon as PhLock } from 'phosphor-react-native/src/icons/Lock';
import { PersonSimpleRunIcon as PhRun } from 'phosphor-react-native/src/icons/PersonSimpleRun';
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
