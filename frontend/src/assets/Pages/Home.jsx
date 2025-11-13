import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar.jsx';
import { employeeAPI, testConnection } from '../../services/api';

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    position: '',
    department: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Test connection and fetch employees on component mount
  useEffect(() => {
    checkConnection();
    fetchEmployees();
  }, []);

  const checkConnection = async () => {
    try {
      await testConnection();
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Connection test failed:', error);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data || response.data);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error fetching employees:', error);
      setConnectionStatus('disconnected');
      if (error.code === 'ECONNREFUSED') {
        alert('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.position || !formData.department || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    setFormLoading(true);
    
    try {
      if (isEditing) {
        // Update existing employee
        const response = await employeeAPI.update(formData.id, formData);
        alert(response.data.message || 'Employee updated successfully!');
      } else {
        // Add new employee
        const response = await employeeAPI.create(formData);
        alert(response.data.message || 'Employee added successfully!');
      }
      
      resetForm();
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error saving employee:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to save employee. Please check if server is running.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      id: employee._id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        alert('Employee deleted successfully!');
        fetchEmployees(); // Refresh the list
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      position: '',
      department: '',
      email: ''
    });
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Connection Status */}
        <div className={`text-center mb-4 p-2 rounded ${
          connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 
          connectionStatus === 'disconnected' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {connectionStatus === 'connected' && '✅ Connected to server'}
          {connectionStatus === 'disconnected' && '❌ Cannot connect to server. Please check if backend is running on port 5000.'}
          {connectionStatus === 'checking' && 'Checking server connection...'}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold">Welcome to Employee Directory</h2>
          <p className="mt-4 text-gray-600">Manage your employees efficiently.</p>
        </div>

        {/* Employee Form */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
                disabled={formLoading || connectionStatus !== 'connected'}
              >
                {formLoading ? 'Saving...' : (isEditing ? 'Update Employee' : 'Add Employee')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Employee List */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Employee List</h3>
            <div className="space-x-2">
              <button
                onClick={checkConnection}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
              >
                Test Connection
              </button>
              <button
                onClick={fetchEmployees}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {loading ? (
            <p className="text-center text-gray-500">Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-gray-500">
              {connectionStatus === 'connected' 
                ? 'No employees added yet.' 
                : 'Cannot load employees. Please check server connection.'}
            </p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map(employee => (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={connectionStatus !== 'connected'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={connectionStatus !== 'connected'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;