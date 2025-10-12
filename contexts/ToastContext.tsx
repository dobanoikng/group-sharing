import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ToastType = 'info' | 'error' | 'warning' | 'success';

interface ToastOptions {
  duration?: number;
  type?: ToastType;
}

const ToastContext = createContext({
  showToast: (_msg: string, _options?: ToastOptions) => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<ToastType>('info');
  const timerRef = useRef<number | null>(null);

  const hideToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  };

  const showToast = (msg: string, options: ToastOptions = {}) => {
    const { duration = 5000, type = 'info' } = options; // Longer duration if closable
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    setType(type);
    setVisible(true);
    timerRef.current = setTimeout(hideToast, duration);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && <Toast message={message} type={type} onClose={hideToast} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) => (
  <View style={[styles.toast, styles[type]]}>
    <Text style={styles.text}>{message}</Text>
    <Pressable onPress={onClose} style={styles.closeButton}>
      <Text style={styles.closeButtonText}>✕</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  info: {
    backgroundColor: '#2196F3', // Blue
  },
  success: {
    backgroundColor: '#4CAF50', // Green
  },
  warning: {
    backgroundColor: '#FF9800', // Orange
  },
  error: {
    backgroundColor: '#F44336', // Red
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
