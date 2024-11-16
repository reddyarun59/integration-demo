import {
  IntegrationAppClient,
  IntegrationAppProvider,
  // useIntegrationApp
} from '@integration-app/react';

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Building2, Users, UserPlus } from 'lucide-react';
import Connect from './components/Connect';
import CreateContact from './components/CreateContact';
import ContactList from './components/ContactList';

function App() {
  const integrationApp = new IntegrationAppClient({
    token: import.meta.env.VITE_INTEGRATION_APP_TOKEN,
  });

  const [connections, setConnections] = useState<string[]>([]);

  const hey = async () => {
    const self = await integrationApp.self.get();
    console.log(self);

    const { items: integrations } = await integrationApp.integrations.find();
    console.log(integrations, 'integrations');
    const { items: connections } = await integrationApp.connections.find();

    if (connections?.length > 0 && connections?.[0]?.name?.toLowerCase() === 'hubspot') {
      setConnections(['hubspot']);

      // const connectionId = localStorage.getItem('connectionId')?.toString() || connections?.[0]?.integrationId || '';

      console.log('hiiiiiiii');

      const responseUser = await integrationApp.connection(connections?.[0]?.id).proxy.get('/account-info/v3/details');
      localStorage.setItem('portalId', JSON.stringify(responseUser?.portalId));
      // console.log(responseUser, 'response userrrrrrrrrr');
      // localStorage.setItem('connec', JSON.stringify(connections));
    }
    console.log(connections, 'connections');
  };

  console.log(connections, 'hub');

  // ('67321a20b357f118d86efb57');

  useEffect(() => {
    // const storedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    // if (storedContacts.length > 0) {
    //   integrationApp.connection('hubspot').action('test-hima').run(storedContacts);
    // }

    hey();
    handleCall();
  }, []);

  const handleCall = async () => {
    const response = await integrationApp.connection('67386a66be832b1c2372e891').proxy.get('/account-info/v3/details');
    console.log(response, 'response user');
  };

  return (
    <IntegrationAppProvider token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzIxNTZlMTc2ZTEzZGUyYWE2MzQ5YyIsImlzcyI6IjM4OTk0NzNiLThhMGUtNDZkNC1iZWIzLWVmNmFlZmQ3YzE4NSIsImV4cCI6MTc2MzE0NjU3N30.M8L-n673IsEL9CXTcEdRpZ-FnmY2Fg1nfh1t_ouNNJg">
      <BrowserRouter>
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
                    <button onClick={hey}>hellloo</button>
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
      </BrowserRouter>
    </IntegrationAppProvider>
  );
}

export default App;
