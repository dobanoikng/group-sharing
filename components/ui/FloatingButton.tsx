import { useTheme } from '@ui-kitten/components';
import React from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native';

type IProps = {
  onPress: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
};

const FloatingButton = ({ onPress, children }: IProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme['color-primary-500'] }]}
      onPress={onPress}
    >
      <View>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    borderRadius: 30, // Makes it circular
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FloatingButton;
