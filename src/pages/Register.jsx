import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student' // Default role
  });
  const [error, setError] = useState('');
  
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { name, email, password, role } = formData;
    const result = await registerUser(name, email, password, role);
    
    if (result.success) {
      navigate('/dashboard'); // Redirect to dashboard on success
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Campus Hub</h2>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded"
          required 
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded"
          required 
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded"
          required 
        />

        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="w-full p-2 mb-6 border rounded"
        >
          <option value="Student">Student</option>
          <option value="Organizer">Organizer</option>
        </select>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;