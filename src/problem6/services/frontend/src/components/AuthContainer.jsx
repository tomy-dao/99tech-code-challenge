import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import auth from '@/clients/auth';
import { toast } from 'sonner';

const AuthContainer = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (loginData) => {
    try {
      console.log(loginData);
      const {user, token} = await auth.login(loginData);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Call success callback
      onAuthSuccess(user);
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: "top-right",
        style: {
          background: "white",
          color: "red",
        },
      });
      throw new Error('Invalid username or password.');
    }
  };

  const handleRegister = async (registerData) => {
    try {
      const {user, token} = await auth.register(registerData);
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Call success callback
      onAuthSuccess(user);
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        style: {
          background: "white",
          color: "red",
        },
      });
      throw new Error(error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        {isLogin ? (
          <LoginForm
            onSwitchToRegister={() => setIsLogin(false)}
            onLogin={handleLogin}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setIsLogin(true)}
            onRegister={handleRegister}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
