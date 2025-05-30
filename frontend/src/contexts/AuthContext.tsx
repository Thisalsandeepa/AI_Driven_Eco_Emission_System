


// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast'; // ✅ Import toast

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   isAdmin: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   isAdmin: boolean;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   adminLogin: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isAdmin: false,
//   loading: true,
//   login: async () => {},
//   adminLogin: async () => {},
//   signup: async () => {},
//   logout: async () => {}
// });

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load user from localStorage on first load
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');

//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const signup = async (email: string, password: string, name: string) => {
//     await axios.post('http://localhost:5000/api/signup', {
//       email,
//       password,
//       name
//     });

//     toast.success('Account created successfully!');
//     await login(email, password); // Optional auto-login
//   };

//   const login = async (email: string, password: string) => {
//     const response = await axios.post('http://localhost:5000/api/login', {
//       email,
//       password
//     });

//     const { token, user } = response.data;

//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);

//     toast.success(`Welcome back, ${user.name}!`);
//   };

//   const adminLogin = async (email: string, password: string) => {
//     const response = await axios.post('http://localhost:5000/api/login', {
//       email,
//       password
//     });

//     const { token, user } = response.data;

//     if (!user.isAdmin) {
//       throw new Error('You are not authorized as admin');
//     }

//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);

//     toast.success(`Admin access granted, ${user.name}!`);
//   };

//   const logout = async () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);

//     toast('Logged out successfully.', { icon: '👋' });
//   };

//   const value = {
//     user,
//     isAdmin: user?.isAdmin || false,
//     loading,
//     login,
//     adminLogin,
//     signup,
//     logout
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // ✅ Added
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null, // ✅ Default value
  isAdmin: false,
  loading: true,
  login: async () => {},
  adminLogin: async () => {},
  signup: async () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // ✅ Added
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    await axios.post('http://localhost:5000/api/signup', {
      email,
      password,
      name
    });

    toast.success('Account created successfully!');
    await login(email, password); // Optional auto-login
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:5000/api/login', {
      email,
      password
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token); // ✅ Set token in state

    toast.success(`Welcome back, ${user.name}!`);
  };

  const adminLogin = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:5000/api/login', {
      email,
      password
    });

    const { token, user } = response.data;

    if (!user.isAdmin) {
      throw new Error('You are not authorized as admin');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token); // ✅ Set token in state

    toast.success(`Admin access granted, ${user.name}!`);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null); // ✅ Clear token in state

    toast('Logged out successfully.', { icon: '👋' });
  };

  const value = {
    user,
    token, // ✅ Included in context value
    isAdmin: user?.isAdmin || false,
    loading,
    login,
    adminLogin,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
