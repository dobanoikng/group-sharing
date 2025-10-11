import React, { createContext, ReactNode, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ToastContext = createContext({ showToast: (msg: string, duration?: number) => {} });
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const showToast = (msg: string, duration = 2000) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && <Toast message={message} />}
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);
const Toast = ({ message }: { message: string }) => (
  <View style={styles.toast}>
    <Text style={styles.text}>{message}</Text>
  </View>
);
const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    right: 30,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});
