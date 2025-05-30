import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddVehicleForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    engineSize: '',
    fuelType: '',
    transmission: '',
    registrationNumber: '',
    imageUrl: ''
  });

  const [preview, setPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_upload');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dw7foepgv/image/upload',
        formData
      );
      const imageUrl = res.data.secure_url;
      setForm((prev) => ({ ...prev, imageUrl }));
      setPreview(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/vehicles',
        {
          ...form,
          year: Number(form.year),
          engineSize: Number(form.engineSize),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Vehicle added successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add vehicle');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-500 to-green-300 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl p-10 border border-white/40">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Register Your Vehicle</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="make" placeholder="Make" value={form.make} onChange={handleChange} required className="input" />
            <input type="text" name="model" placeholder="Model" value={form.model} onChange={handleChange} required className="input" />
            <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} required className="input" />
            <input type="number" name="engineSize" placeholder="Engine Size (L)" value={form.engineSize} onChange={handleChange} required className="input" />
            <select name="fuelType" value={form.fuelType} onChange={handleChange} required className="input">
              <option value="">Select Fuel Type</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
            <select name="transmission" value={form.transmission} onChange={handleChange} required className="input">
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number (optional)"
            value={form.registrationNumber}
            onChange={handleChange}
            className="input w-full"
          />

        
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm;
