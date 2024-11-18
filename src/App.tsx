import { IntegrationAppClient, IntegrationAppProvider } from '@integration-app/react';
import { useEffect } from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import { Building2, Users, UserPlus } from 'lucide-react';
import { lazy, Suspense } from 'react';

const Connect = lazy(() => import('./components/Connect'));
const CreateContact = lazy(() => import('./components/CreateContact'));
const ContactList = lazy(() => import('./components/ContactList'));

const integrationAppToken = import.meta.env.VITE_INTEGRATION_APP_TOKEN;

function App() {
  const integrationApp = new IntegrationAppClient({
    token: integrationAppToken,
  });

  const initCall = async () => {
    try {
      if (!integrationAppToken) {
        console.error('Integration App Token is missing.');
        return;
      }

      await integrationApp.self.get();

      const { items: connections } = await integrationApp.connections.find();

      if (connections?.length > 0 && connections[0]?.name?.toLowerCase() === 'hubspot') {
        const responseUser = await integrationApp.connection(connections[0].id).proxy.get('/account-info/v3/details');
        if (responseUser?.portalId) {
          localStorage.setItem('portalId', JSON.stringify(responseUser.portalId));
        } else {
          console.warn('Portal ID is missing in the response.');
        }
      }
    } catch (error) {
      console.error('Error during initialization:', error);
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
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Connect />} />
                <Route path="/create" element={<CreateContact />} />
                <Route path="/contacts" element={<ContactList />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </IntegrationAppProvider>
    </BrowserRouter>
  );
}

export default App;
