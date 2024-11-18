import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useIntegrationApp } from '@integration-app/react';

function CreateContact() {
  const integrationApp = useIntegrationApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const { firstName, lastName, email, phone } = formData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await integrationApp.connection('hubspot').action('test-hima').run({
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
      });

      if (response?.output?.id) {
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push({ ...formData, id: Date.now(), contactId: response?.output?.id });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        navigate('/contacts');
      }
    } catch (error) {
      alert('Error creating contact, Please try again');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      console.error('Error creating contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const initCall = async () => {
    try {
      await integrationApp.self.get();

      const { items: connections } = await integrationApp.connections.find();

      if (connections?.length > 0 && connections?.[0]?.name?.toLowerCase() === 'hubspot') {
        const responseUser = await integrationApp.connection(connections?.[0]?.id).proxy.get('/account-info/v3/details');
        localStorage.setItem('portalId', JSON.stringify(responseUser?.portalId));
      }
    } catch (error) {
      console.error('Error in initCall:', error);
    }
  };

  useEffect(() => {
    initCall();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="h-8 w-8 text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Create New Contact</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateContact;
