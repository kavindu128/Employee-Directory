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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Connection Status */}
        <div className={`text-center mb-8 p-3 rounded-2xl shadow-sm text-sm font-medium transition-all ${connectionStatus === 'connected' ? 'bg-green-100/80 text-green-800' :
            connectionStatus === 'disconnected' ? 'bg-red-100/80 text-red-800' :
              'bg-yellow-100/80 text-yellow-800'
          }`}>
          {connectionStatus === 'connected' && '✨ Live Server Connection Active'}
          {connectionStatus === 'disconnected' && '❌ Cannot connect to server. Please check your connection.'}
          {connectionStatus === 'checking' && 'Checking server connection...'}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Employee Form (Left Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white sticky top-8 transition-all hover:shadow-2xl">
              <h3 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight">
                {isEditing ? 'Update Details' : 'New Member'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transform active:scale-95 transition-all duration-200 shadow-md disabled:opacity-50"
                    disabled={formLoading || connectionStatus !== 'connected'}
                  >
                    {formLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Person')}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-none bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transform active:scale-95 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Employee List (Right Column) */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : employees.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center border border-white border-dashed">
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Profiles Found</h3>
                <p className="text-gray-500">
                  {connectionStatus === 'connected'
                    ? "It's quiet here. Add your first team member using the form!"
                    : "Having trouble connecting to the database."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {employees.map(employee => (
                  <div key={employee._id} className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-gray-900">{employee.name}</h4>
                        <p className="text-sm font-semibold text-indigo-600">{employee.position}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {employee.department}
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        Contact Details Saved
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="flex-1 bg-gray-50 text-indigo-600 font-semibold py-2 px-4 rounded-xl hover:bg-indigo-50 transition-colors duration-200"
                        disabled={connectionStatus !== 'connected'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="flex-1 bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-xl hover:bg-red-100 transition-colors duration-200"
                        disabled={connectionStatus !== 'connected'}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;