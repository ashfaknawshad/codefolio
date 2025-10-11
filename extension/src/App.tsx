// extension/src/App.tsx

import { useEffect, useState } from 'react';
import './index.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from './constants';
import { cn } from '@/lib/utils';

function App() {
  // --- State Management ---
  const [tokenInput, setTokenInput] = useState('');
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Effects ---
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
    if (!tokenInput.trim()) return;

    chrome.storage.sync.set({ githubToken: tokenInput }, () => {
      setGithubToken(tokenInput);
      setTokenInput('');
    });
  };

  const handleDisconnect = () => {
    chrome.storage.sync.remove('githubToken', () => {
      setGithubToken(null);
      setProjects([]);
      setSelectedProjects([]);
    });
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const handleFetchProjects = async () => {
    if (!githubToken) return;
    setIsFetching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/fetch_repos`, {
        headers: { 'Authorization': `token ${githubToken}` },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects(currentSelected =>
      currentSelected.includes(projectId)
        ? currentSelected.filter(id => id !== projectId)
        : [...currentSelected, projectId]
    );
  };

  // extension/src/App.tsx

const handleGenerateResume = async () => {
  if (selectedProjects.length === 0) {
    alert("Please select at least one project.");
    return;
  }
  setIsGenerating(true);

  
  // Fetch the latest userDetails from storage.
  chrome.storage.sync.get(['userDetails'], async (result) => {
    if (!result.userDetails) {
      alert("Please fill out your details on the options page first.");
      setIsGenerating(false); // Make sure to reset loading state on error
      return;
    }
    
    // The rest of the function is now inside this callback
    const projectsToInclude = projects.filter(p => selectedProjects.includes(p.id));
    
    // Convert the skills string from "Python, React" into an array ["Python", "React"]
    const skillsArray = result.userDetails.skills.split(',').map((skill: string) => skill.trim());

    const resumeData = {
      user_details: {
        ...result.userDetails, // Use the data from storage
        skills: skillsArray,    // Use the converted array of skills
      },
      projects: projectsToInclude.map(p => ({
        title: p.name,
        description: p.description,
        languages: p.language ? [p.language] : [],
        repo_link: p.html_url,
      })),
      template: "resume_basic"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate_resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const pdfBlob = await response.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Codefolio-Resume-${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to generate resume:", error);
    } finally {
      setIsGenerating(false);
    }
  });
  };

  // --- UI Rendering ---
  if (isLoading) {
    return <div className="w-[350px] h-[100px] flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!githubToken) {
    return (
      <div className="w-[350px] p-4">
        <Card>
          <CardHeader><CardTitle>Connect to GitHub</CardTitle></CardHeader>
          <form onSubmit={handleConnect}>
            <CardContent>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="github-token">Personal Access Token</Label>
                <Input id="github-token" placeholder="ghp_..." type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
                <Button type="submit" className="mt-2 w-full">Connect</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Your token is stored securely in your browser's sync storage.</p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-[350px] p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Your Projects</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleOpenOptions}>
              Options
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
      </div>
      <div className="space-y-2 h-[200px] overflow-y-auto pr-2">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Click "Fetch Projects" to sync.</p>
        ) : (
          projects.map((project) => (
            <Card key={project.id} onClick={() => toggleProjectSelection(project.id)} className={cn("cursor-pointer transition-colors", selectedProjects.includes(project.id) && "border-primary bg-secondary")}>
              <CardContent className="p-3">
                <p className="font-semibold truncate">{project.name}</p>
                <p className="text-sm text-muted-foreground">
                      {project.language || 'N/A'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={handleFetchProjects} disabled={isFetching}>{isFetching ? 'Fetching...' : 'Fetch Projects'}</Button>
        <Button className="w-full" variant="secondary" onClick={handleGenerateResume} disabled={isGenerating}>{isGenerating ? 'Generating...' : 'Generate Resume'}</Button>
      </div>
    </div>
  );
}

export default App;