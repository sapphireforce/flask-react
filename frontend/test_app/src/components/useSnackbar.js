import { useState } from 'react';

export default function useSnackbar(defaultState = {}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    ...defaultState,
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const closeSnackbar = () => {
    setSnackbar(s => ({ ...s, open: false }));
  };

  return { snackbar, showSnackbar, closeSnackbar };
}
