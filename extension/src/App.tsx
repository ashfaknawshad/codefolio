// extension/src/App.tsx

import { API_BASE_URL } from './constants';
import { useEffect, useState } from 'react';
import './index.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function App() {
  // --- State Management ---
  const [tokenInput, setTokenInput] = useState('');
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]); // To store the fetched repos
  const [isFetching, setIsFetching] = useState(false); // To show a loading state on the button

  // --- Load saved token when the popup opens ---
  useEffect(() => {
    chrome.storage.sync.get(['githubToken'], (result) => {
      if (result.githubToken) {
        setGithubToken(result.githubToken);
      }
      setIsLoading(false);
    });
  }, []);

  // --- Event Handlers ---
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenInput.trim()) {
      // You can add a more user-friendly notification here later
      console.error("Token input is empty.");
      return;
    }

    
    chrome.storage.sync.set({ githubToken: tokenInput }, () => {
      console.log('GitHub token saved.');
      setGithubToken(tokenInput);
      setTokenInput(''); // Clear the input field
    });
  };

  const handleDisconnect = () => {
    // Remove the token from storage
    chrome.storage.sync.remove('githubToken', () => {
      console.log('GitHub token removed.');
      setGithubToken(null); // Update state to trigger UI change
    });
  };

  const handleFetchProjects = async () => {
    if (!githubToken) {
      console.error("No GitHub token found.");
      return;
    }

    setIsFetching(true); // Set loading state to true

    try {
      const response = await fetch(`${API_BASE_URL}/api/fetch_repos`, {
        method: 'GET',
        headers: {
          'Authorization': `token ${githubToken}`, // Send the token in the Authorization header
        },
      });

      if (!response.ok) {
        // Handle errors from the API (e.g., bad token)
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched repositories:", data);
      setProjects(data); // Save the fetched projects into our state
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      // You could show an error message to the user here
    } finally {
      setIsFetching(false); // Set loading state to false, regardless of success or error
    }
  };

  // --- UI Rendering ---
  
  // 1. Loading State
  // Show a simple loading message while we check chrome.storage for the token
  if (isLoading) {
    return (
      <div className="w-[350px] h-[100px] flex items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  // 2. Signed Out State
  // If we are done loading and there is no token, show the connect form
  if (!githubToken) {
    return (
      <div className="w-[350px] p-4 bg-background text-foreground">
        <Card>
          <CardHeader>
            <CardTitle>Connect to GitHub</CardTitle>
          </CardHeader>
           <form onSubmit={handleConnect}>
            <CardContent>
                <div className="grid w-full items-center gap-2">
                <Label htmlFor="github-token">Personal Access Token</Label>
                <Input
                    id="github-token"
                    placeholder="ghp_..."
                    type="password" // Hide the token for security
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                />
                <Button className="mt-2 w-full" onClick={handleConnect}>
                    Connect
                </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                Your token is stored securely in your browser's sync storage.
                </p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  // 3. Signed In State
  // If we have a token, show the main dashboard
  return (
    <div className="w-[350px] p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Your Projects</h1>
        <Button variant="destructive" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>

      {/* This is where the list of projects will go. */}
        <div className="space-y-2 h-[200px] overflow-y-auto pr-2">
        {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
            Click "Fetch Projects" to sync.
            </p>
        ) : (
            projects.map((project) => (
            <Card key={project.id}>
                <CardContent className="p-3">
                <p className="font-semibold truncate">{project.name}</p>
                <p className="text-sm text-muted-foreground">
                    ⭐ {project.stargazers_count} - {project.language || 'N/A'}
                </p>
                </CardContent>
            </Card>
            ))
        )}
        </div>

      <div className="mt-4 space-y-2">
            <Button 
                className="w-full" 
                onClick={handleFetchProjects} // <-- Connect our new function
                disabled={isFetching} // <-- Disable the button while fetching
            >
                {isFetching ? 'Fetching...' : 'Fetch Projects'}
            </Button>
            <Button className="w-full" variant="secondary">
                Generate Resume
            </Button>
        </div>
    </div>
  );
}

export default App;