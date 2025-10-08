import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const avatarSizes = {
  tiny: 24,
  small: 32,
  medium: 40,
  large: 48,
  giant: 56,
};
type Size = keyof typeof avatarSizes;
type IProps = {
  text: string;
  size?: Size;
  shape?: 'round' | 'rounded';
  style?: StyleProp<ViewStyle>;
};
const StringAvatar = ({ text, size = 'small', shape = 'round', style }: IProps) => {
  // Determine size based on UI Kitten's Avatar sizes

  const avatarSize = avatarSizes[size] || avatarSizes.medium;

  // Determine border radius for different shapes
  const borderRadius =
    shape === 'round' ? avatarSize / 2 : shape === 'rounded' ? avatarSize / 4 : 0;

  return (
    <View
      style={[
        styles.stringAvatarContainer,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: borderRadius,
        },
        style,
      ]}
    >
      <Text category="c1" style={[
        styles.stringAvatarText,
        {
          fontSize: avatarSize * 0.5, // tuỳ chỉnh cỡ chữ
          lineHeight: avatarSize * 0.5, // giữ cho không bị lệch dọc
          textAlign: 'center',
          textAlignVertical: 'center', // chỉ hoạt động tốt trên Android
        },
      ]}>
        {text.charAt(0).toUpperCase()} {/* Display first letter */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stringAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A0A0A0',
  },
  stringAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    includeFontPadding: false, // loại bỏ padding mặc định Android
    textAlign: 'center',
  },
});

export default StringAvatar;
