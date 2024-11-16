import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { useIntegrationApp } from '@integration-app/react';

function Connect() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionID, setConnectionID] = useState('');
  const navigate = useNavigate();

  const integrationApp = useIntegrationApp();
  const handleConnect = async () => {
    const result = await integrationApp.open();
    const { items: connections } = await integrationApp.connections.find();

    const connectionId = localStorage.getItem('connectionId') || connections?.[0]?.integrationId || '';

    if (connectionId?.length > 0) {
      setConnectionID(connectionId);

      setIsConnected(true);
    }

    navigate('/create');

    console.log(result);
  };

  const getConnections = async () => {
    const { items: connections } = await integrationApp.connections.find();
    console.log(connections, 'connections');
    // if (connections?.length > 0 && connections?.[0]?.name?.toLowerCase() === 'hubspot') {
    //   console.log('hubspot');
    // }

    const connectionId = localStorage.getItem('connectionId') || connections?.[0]?.integrationId || '';
    if (connectionId?.length > 0) {
      setConnectionID(connectionId);
      setIsConnected(true);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  console.log(connectionID, 'connectionID');

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-orange-100 p-3 rounded-full inline-flex">
            <Link2 className="h-8 w-8 text-orange-500" />
          </div>

          {isConnected ? (
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Connected to HubSpot</h2>
          ) : (
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Connect to your CRM</h2>
          )}
        </div>

        <div className="space-y-6">
          <div></div>

          {isConnected ? (
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => {
                integrationApp.connection(connectionID).archive();
                localStorage.removeItem('connectionId');
                setIsConnected(false);
              }}
            >
              Disconnect
            </button>
          ) : (
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => handleConnect()}
            >
              Connect to HubSpot
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Connect;
