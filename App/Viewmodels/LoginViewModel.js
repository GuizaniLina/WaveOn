import { useState } from 'react';
import LoginService from '../services/LoginService';
import pingService from '../services/pingService';

const LoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const loginResponse  = await LoginService.login(email, password);
      const { idclient, iduser, token } = loginResponse;
      await pingService( idclient, iduser, token);
      // Handle successful login (e.g., store token in AsyncStorage, navigate to next screen)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
  };
};

export default LoginViewModel;