import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SOCKET_URL = 'http://localhost:5000';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect when both user and token are available
    if (!user?.id || !token) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join_user_room', user.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewNotification = (notification) => {
      // Here is the fixed bell emoji!
      toast(notification.message || 'You have a new notification', {
        icon: '🔔', 
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_notification', handleNewNotification);

    // Cleanup: remove listeners and disconnect when user logs out
    // or component unmounts
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_notification', handleNewNotification);
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user?.id, token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};