import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Search,
  TrendingUp,
  Filter,
  CheckCircle,
  XCircle,
  Download,
  Car,
  Edit,
  Trash2,
  Send,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface UserMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

interface Prediction {
  _id: string;
  make: string;
  model: string;
  emissionLevel: string;
  createdAt: string;
  userId: string;
  vehicleId: string;
}

interface MaintenanceNotification {
  _id: string;
  vehicleId: string;
  userId: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  userId: string;
  engineSize: number;
  fuelType: string;
  transmission: string;
  registrationNumber?: string;
  createdAt: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [notifications, setNotifications] = useState<MaintenanceNotification[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [emissionFilter, setEmissionFilter] = useState<string>('all');
  const [notificationFilter, setNotificationFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalPredictions: 0
  });
  const [loading, setLoading] = useState({
    stats: true,
    messages: true,
    predictions: true,
    notifications: true,
    vehicles: true
  });
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [showUserVehiclesModal, setShowUserVehiclesModal] = useState(false);
  const [vehiclesForUser, setVehiclesForUser] = useState<Vehicle[]>([]);

  const COLORS = {
    Low: '#16a34a',
    Medium: '#eab308',
    High: '#dc2626'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({
          stats: true,
          messages: true,
          predictions: true,
          notifications: true,
          vehicles: true
        });

        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Fetch dashboard statistics
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { headers });
        setStats(statsRes.data);
        setLoading(prev => ({ ...prev, stats: false }));

        // Fetch messages
        const messagesRes = await axios.get('http://localhost:5000/api/admin/messages', { headers });
        const mappedMessages = messagesRes.data.map((m: any) => ({
          id: m._id,
          name: m.name,
          email: m.email,
          message: m.message,
          date: m.createdAt,
          read: m.read
        }));
        setMessages(mappedMessages);
        setLoading(prev => ({ ...prev, messages: false }));

        // Fetch predictions
        const predictionsRes = await axios.get('http://localhost:5000/api/admin/predictions', { headers });
        setPredictions(predictionsRes.data);
        setLoading(prev => ({ ...prev, predictions: false }));

        // Fetch maintenance notifications
        const notificationsRes = await axios.get('http://localhost:5000/api/admin/notifications', { headers });
        setNotifications(notificationsRes.data);
        setLoading(prev => ({ ...prev, notifications: false }));

        // Fetch vehicles
        const vehiclesRes = await axios.get('http://localhost:5000/api/admin/vehicles', { headers });
        setVehicles(vehiclesRes.data);
        setLoading(prev => ({ ...prev, vehicles: false }));
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Failed to load dashboard data');
        setLoading({
          stats: false,
          messages: false,
          predictions: false,
          notifications: false,
          vehicles: false
        });
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const totalUsers = 1286;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMessageClick = (message: UserMessage) => {
    if (!message.read) {
      setMessages(prev =>
        prev.map(m =>
          m.id === message.id ? { ...m, read: true } : m
        )
      );
    }
    setSelectedMessage(prev => (prev?.id === message.id ? null : message));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Prediction statistics
  const totalPredictions = predictions.length;
  const emissionDistribution = predictions.reduce((acc, pred) => {
    acc[pred.emissionLevel] = (acc[pred.emissionLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredPredictions = predictions.filter(pred => 
    emissionFilter === 'all' || pred.emissionLevel.toLowerCase() === emissionFilter.toLowerCase()
  );

  const pieChartData = Object.entries(emissionDistribution).map(([level, count]) => ({
    name: level,
    value: count
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReply = async (messageId: string) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/messages/${messageId}/reply`,
        { reply: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyMessage('');
      toast.success('Reply sent successfully');
      
      // Refresh messages
      const messagesRes = await axios.get('http://localhost:5000/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messagesRes.data.map((m: any) => ({
        id: m._id,
        name: m.name,
        email: m.email,
        message: m.message,
        date: m.createdAt,
        read: m.read
      })));
    } catch (err) {
      console.error('Error sending reply:', err);
      toast.error('Failed to send reply');
    }
  };

  const exportMessages = () => {
    const csvContent = [
      ['Name', 'Email', 'Message', 'Date', 'Status'],
      ...messages.map(m => [
        m.name,
        m.email,
        m.message,
        new Date(m.date).toLocaleString(),
        m.read ? 'Read' : 'Unread'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contact-messages-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleVehicleAction = async (vehicleId: string, action: 'edit' | 'delete') => {
    if (action === 'delete') {
      if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
      try {
        await axios.delete(`http://localhost:5000/api/admin/vehicles/${vehicleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(prev => prev.filter(v => v._id !== vehicleId));
        toast.success('Vehicle deleted successfully');
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        toast.error('Failed to delete vehicle');
      }
    } else {
      setSelectedVehicle(vehicles.find(v => v._id === vehicleId) || null);
    }
  };

  const fetchUsers = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/admin/users', { headers });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => { setShowUsersModal(false); setSelectedUser(null); }}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            {!selectedUser ? (
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{user.email}</td>
                        <td className="px-4 py-2 text-sm">
                          {user.isAdmin ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Admin</span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">User</span>
                          )}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            className="text-blue-600 hover:underline text-xs"
                            onClick={() => setSelectedUser(user)}
                          >
                            View Details
                          </button>
                          <button
                            className="text-green-600 hover:underline text-xs"
                            onClick={() => {
                              setVehiclesForUser(vehicles.filter(v => v.userId === user._id));
                              setSelectedUser(user);
                              setShowUserVehiclesModal(true);
                            }}
                          >
                            View Vehicles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <button
                  className="mb-4 text-blue-600 hover:underline text-xs"
                  onClick={() => setSelectedUser(null)}
                >
                  &larr; Back to all users
                </button>
                <div className="mb-2 text-lg font-semibold">{selectedUser.name}</div>
                <div className="mb-1 text-gray-700">Email: {selectedUser.email}</div>
                <div className="mb-1 text-gray-700">Role: {selectedUser.isAdmin ? 'Admin' : 'User'}</div>
                <div className="mb-1 text-gray-700">Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                {/* Add more user details here if needed */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Vehicles Modal */}
      {showUserVehiclesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowUserVehiclesModal(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Vehicles for {selectedUser?.name}</h2>
            {vehiclesForUser.length === 0 ? (
              <div className="text-gray-500">No vehicles found for this user.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {vehiclesForUser.map(vehicle => (
                  <li key={vehicle._id} className="py-3">
                    <div className="font-semibold text-green-700">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                    <div className="text-sm text-gray-600">Engine: {vehicle.engineSize}L | Fuel: {vehicle.fuelType} | Transmission: {vehicle.transmission}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome back, {user?.name || 'Admin'}.</p>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {loading.stats ? (
                <div className="animate-pulse bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
                </div>
              ) : (
                <>
                  <StatCard icon={<Users className="h-6 w-6 text-blue-600" />} title="Total Users" value={stats.totalUsers.toLocaleString()} bg="blue" onClick={async () => { await fetchUsers(); setShowUsersModal(true); }} clickable />
                  <StatCard icon={<MessageSquare className="h-6 w-6 text-green-600" />} title="Total Messages" value={stats.totalMessages} bg="green" />
                  <StatCard icon={<MessageSquare className="h-6 w-6 text-red-600" />} title="Unread Messages" value={stats.unreadMessages} bg="red" />
                  <StatCard icon={<TrendingUp className="h-6 w-6 text-purple-600" />} title="Total Predictions" value={stats.totalPredictions} bg="purple" />
                </>
              )}
            </div>

            {/* Emission Predictions Overview */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Emission Predictions Overview</h3>
                      <p className="mt-1 text-sm text-gray-500">View and analyze vehicle emission predictions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={emissionFilter}
                        onChange={(e) => setEmissionFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Levels</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Emission Distribution Chart */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Emission Level Distribution</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Recent Predictions Table */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Predictions</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPredictions.slice(0, 5).map((prediction) => (
                              <tr key={prediction._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {prediction.make} {prediction.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${prediction.emissionLevel.toLowerCase() === 'low' ? 'bg-green-100 text-green-800' :
                                      prediction.emissionLevel.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'}`}>
                                    {prediction.emissionLevel}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(prediction.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Notifications */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Maintenance Notifications</h3>
                      <p className="mt-1 text-sm text-gray-500">Track maintenance reminders and notifications</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={notificationFilter}
                        onChange={(e) => setNotificationFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="sent">Sent</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {notifications
                          .filter(n => notificationFilter === 'all' || n.status === notificationFilter)
                          .map((notification) => (
                            <tr key={notification._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {notification.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(notification.dueDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                                  notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {notification.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Message Management */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Contact Message Management</h3>
                      <p className="mt-1 text-sm text-gray-500">View and respond to user messages</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={messageFilter}
                        onChange={(e) => setMessageFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                      </select>
                      <button
                        onClick={exportMessages}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {messages
                    .filter(m => messageFilter === 'all' || (messageFilter === 'unread' ? !m.read : m.read))
                    .map((message) => (
                      <div key={message.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600">{message.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{message.name}</div>
                              <div className="text-sm text-gray-500">{message.email}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(message.date).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{message.message}</div>
                        <div className="mt-4">
                          <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={3}
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleReply(message.id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Vehicle/Prediction Management */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Vehicle Management</h3>
                      <p className="mt-1 text-sm text-gray-500">Manage vehicles and their predictions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={vehicleFilter}
                        onChange={(e) => setVehicleFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Vehicles</option>
                        <option value="recent">Recently Added</option>
                        <option value="predictions">With Predictions</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predictions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicles
                        .filter(v => {
                          if (vehicleFilter === 'all') return true;
                          if (vehicleFilter === 'recent') {
                            const oneWeekAgo = new Date();
                            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                            return new Date(v.createdAt) > oneWeekAgo;
                          }
                          if (vehicleFilter === 'predictions') {
                            return predictions.some(p => p.vehicleId === v._id);
                          }
                          return true;
                        })
                        .map((vehicle) => (
                          <tr key={vehicle._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Car className="h-5 w-5 text-gray-400 mr-2" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {vehicle.make} {vehicle.model}
                                  </div>
                                  <div className="text-sm text-gray-500">{vehicle.year}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>Engine: {vehicle.engineSize}L</div>
                              <div>Fuel: {vehicle.fuelType}</div>
                              <div>Transmission: {vehicle.transmission}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {predictions.filter(p => p.vehicleId === vehicle._id).length} predictions
                              </div>
                              <div className="text-sm text-gray-500">
                                Latest: {new Date(
                                  predictions
                                    .filter(p => p.vehicleId === vehicle._id)
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt || ''
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleVehicleAction(vehicle._id, 'edit')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleVehicleAction(vehicle._id, 'delete')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  bg,
  onClick,
  clickable
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bg: 'blue' | 'green' | 'red' | 'purple';
  onClick?: () => void;
  clickable?: boolean;
}) => {
  const bgColor = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  }[bg];

  return (
    <div
      className={`overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 ${clickable ? 'cursor-pointer hover:bg-blue-50 transition' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${bgColor}`}>{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
