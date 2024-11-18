import {
  IntegrationAppClient,
  IntegrationAppProvider,
  // useIntegrationApp
} from '@integration-app/react';

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Building2, Users, UserPlus } from 'lucide-react';
import Connect from './components/Connect';
import CreateContact from './components/CreateContact';
import ContactList from './components/ContactList';

const integrationAppToken = import.meta.env.VITE_INTEGRATION_APP_TOKEN;

function App() {
  const integrationApp = new IntegrationAppClient({
    token: import.meta.env.VITE_INTEGRATION_APP_TOKEN,
  });

  // const [connections, setConnections] = useState<string[]>([]);

  const initCall = async () => {
    try {
      await integrationApp.self.get();

      const { items: connections } = await integrationApp.connections.find();

      if (connections?.length > 0 && connections?.[0]?.name?.toLowerCase() === 'hubspot') {
        const responseUser = await integrationApp.connection(connections?.[0]?.id).proxy.get('/account-info/v3/details');
        localStorage.setItem('portalId', JSON.stringify(responseUser?.portalId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initCall();
  }, []);

  return (
    <BrowserRouter basename="/">
      <IntegrationAppProvider token={integrationAppToken}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center">
                    <Building2 className="h-8 w-8 text-orange-500" />
                    <span className="ml-2 text-xl font-bold text-gray-800">Integration App Demo</span>
                  </Link>
                </div>
                <div className="flex space-x-4">
                  <Link to="/create" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500">
                    <UserPlus className="h-5 w-5 mr-1" />
                    Create Contact
                  </Link>
                  <Link
                    to="/contacts"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500"
                  >
                    <Users className="h-5 w-5 mr-1" />
                    Contact List
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Connect />} />
              <Route path="/create" element={<CreateContact />} />
              <Route path="/contacts" element={<ContactList />} />
            </Routes>
          </main>
        </div>
      </IntegrationAppProvider>
    </BrowserRouter>
  );
}

export default App;
