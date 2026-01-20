// extension/src/App.tsx

import { useEffect, useState } from 'react';
import './index.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from './constants';
import { ResumeItem, ResumeSection } from './types/resume';
import { ProjectComboBox } from './components/ProjectComboBox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function App() {
  // --- State Management ---
  const [tokenInput, setTokenInput] = useState('');
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedProjects, setFetchedProjects] = useState<any[]>([]); // Full list from GitHub API
  const [savedProjectItems, setSavedProjectItems] = useState<ResumeItem[]>([]); // Projects saved to resume
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('resume_modern');
  const [isEnhancing, setIsEnhancing] = useState(false);


  // --- Effects ---
  useEffect(() => {
    chrome.storage.sync.get(['githubToken', 'sections'], (result) => {
      if (result.githubToken) {
        setGithubToken(result.githubToken);
      }
      if (result.sections) {
        const projectsSection = result.sections.find((sec: ResumeSection) => sec.title === 'Projects');
        if (projectsSection) {
          setSavedProjectItems(projectsSection.items);
        }
      }
      setIsLoading(false);
    });
  }, []);

  // --- Helper function to update projects in chrome.storage ---
  const updateProjectsInStorage = (updatedItems: ResumeItem[]) => {
    chrome.storage.sync.get(['sections'], (result) => {
      const sections = result.sections || [];
      const updatedSections = sections.map((s: ResumeSection) =>
        s.title === 'Projects' ? { ...s, items: updatedItems } : s
      );
      chrome.storage.sync.set({ sections: updatedSections }, () => {
        setSavedProjectItems(updatedItems); // Update local state to re-render the UI
      });
    });
  };
  
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
      setFetchedProjects([]);
      setSavedProjectItems([]);
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
      setFetchedProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleEnhanceAndGenerateResume = async () => {
    if (!githubToken) return;
    
    // Get DeepSeek API key and user details from storage
    chrome.storage.sync.get(['deepseekApiKey', 'userDetails', 'sections'], async (result) => {
      if (!result.deepseekApiKey) {
        alert("Please add your DeepSeek API key in the Options page to use AI enhancement.");
        return;
      }
      
      if (!result.userDetails || !result.sections) {
        alert("Please fill out your details on the options page first.");
        return;
      }
      
      if (savedProjectItems.length === 0) {
        alert("Please add some projects first by selecting them from the dropdown.");
        return;
      }
      
      setIsEnhancing(true);
      setIsGenerating(true);
      try {
        // Step 1: Extract the full project data from savedProjectItems
        const selectedRepos = savedProjectItems
          .map(item => fetchedProjects.find(p => p.id.toString() === item.id.replace('proj_', '')))
          .filter(Boolean);
        
        console.log(`[1/2] Enhancing ${selectedRepos.length} repositories with AI...`);
        
        // Step 2: Call AI enhancement API
        const enhanceResponse = await fetch(`${API_BASE_URL}/api/enhance_repos`, {
          method: 'POST',
          headers: { 
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            repos: selectedRepos,
            deepseek_api_key: result.deepseekApiKey
          })
        });
        
        if (!enhanceResponse.ok) {
          const errorText = await enhanceResponse.text();
          console.error('Enhancement error:', errorText);
          throw new Error(`Enhancement failed: ${enhanceResponse.status} - ${errorText}`);
        }
        
        const enhancedRepos = await enhanceResponse.json();
        console.log(`✓ Successfully enhanced ${enhancedRepos.length} repositories`);
        
        // Step 3: Update project items with enhanced descriptions
        const enhancedItems = savedProjectItems.map(item => {
          const enhanced = enhancedRepos.find((r: any) => r.id.toString() === item.id.replace('proj_', ''));
          if (enhanced && enhanced.description) {
            return { ...item, description: enhanced.description };
          }
          return item;
        });
        
        // Step 4: Update sections with enhanced projects
        const updatedSections = result.sections.map((s: ResumeSection) =>
          s.title === 'Projects' ? { ...s, items: enhancedItems } : s
        );
        
        console.log(`[2/2] Generating resume with enhanced descriptions...`);
        
        // Step 5: Generate resume with enhanced descriptions
        const resumeData = {
          user_details: result.userDetails,
          sections: updatedSections,
          template: selectedTemplate || 'resume_modern',
        };
        
        const resumeResponse = await fetch(`${API_BASE_URL}/api/generate_resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData),
        });
        
        if (!resumeResponse.ok) {
          throw new Error(`Resume generation failed: ${resumeResponse.status}`);
        }
        
        // Step 6: Download the PDF
        const pdfBlob = await resumeResponse.blob();
        const url = window.URL.createObjectURL(pdfBlob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const a = document.createElement('a');
        a.href = url;
        a.download = `Codefolio-Resume-AI-Enhanced-${timestamp}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        
        console.log(`✓ Resume generated successfully!`);
        
        // Step 7: Save enhanced items to storage for future use
        chrome.storage.sync.set({ sections: updatedSections });
        setSavedProjectItems(enhancedItems);
        
        // Also update fetchedProjects cache
        const updatedFetchedProjects = fetchedProjects.map(proj => {
          const enhanced = enhancedRepos.find((r: any) => r.id === proj.id);
          return enhanced || proj;
        });
        setFetchedProjects(updatedFetchedProjects);
        
      } catch (error: any) {
        console.error("Failed:", error);
        alert(`Failed: ${error.message}\n\nCheck the browser console and backend terminal for details.`);
      } finally {
        setIsEnhancing(false);
        setIsGenerating(false);
      }
    });
  };
  
  const handleAddProject = (projectToAdd: any) => {
    const newItem: ResumeItem = {
      id: `proj_${projectToAdd.id}`,
      primary: projectToAdd.name,
      secondary: projectToAdd.language || 'N/A',
      timeline: new Date(projectToAdd.updated_at).getFullYear().toString(),
      description: projectToAdd.description || '',
      repo_link: projectToAdd.html_url,
    };
    const updatedItems = [...savedProjectItems, newItem];
    updateProjectsInStorage(updatedItems);
  };
  
  const handleRemoveProject = (itemIdToRemove: string) => {
    const updatedItems = savedProjectItems.filter(item => item.id !== itemIdToRemove);
    updateProjectsInStorage(updatedItems);
  };

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    chrome.storage.sync.get(['userDetails', 'sections', 'selectedTemplate'], async (result) => {
      if (!result.userDetails || !result.sections) {
        alert("Please fill out your details on the options page first.");
        setIsGenerating(false);
        return;
      }

      const resumeData = {
        user_details: result.userDetails,
        sections: result.sections,
        template: selectedTemplate || 'resume_modern',
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
                <Button type="submit" className="mt-2 w-full bg-[#238636] text-white hover:bg-[#2ea043]">Connect</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Your token is stored securely.</p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-[350px] p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Manage Projects</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleOpenOptions}>Options</Button>
          <Button variant="destructive" size="sm" onClick={handleDisconnect}>Disconnect</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <ProjectComboBox
          allProjects={fetchedProjects}
          savedProjects={savedProjectItems}
          onProjectAdd={handleAddProject}
        />
      </div>

      <div className="space-y-2 h-[150px] overflow-y-auto pr-2 border rounded-md p-2">
        {savedProjectItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-10">
            Use the dropdown to add projects.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {savedProjectItems.map(item => (
              <Badge key={item.id} variant="secondary" className="flex items-center gap-2 text-base py-1">
                {item.primary}
                <button 
                  onClick={() => handleRemoveProject(item.id)}
                  className="rounded-full bg-muted-foreground/30 hover:bg-destructive w-4 h-4 flex items-center justify-center text-destructive-foreground text-xs"
                >
                  &#x2715;
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <Button className="w-full" onClick={handleFetchProjects} disabled={isFetching} variant="outline">
          {isFetching ? 'Refreshing...' : 'Refresh Repo List'}
        </Button>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-muted-foreground">Template:</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume_modern">Modern</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        <Button className="w-full bg-[#238636] text-white hover:bg-[#2ea043]" onClick={handleEnhanceAndGenerateResume} disabled={isEnhancing || isGenerating || savedProjectItems.length === 0}>
          {(isEnhancing || isGenerating) ? '✨ Enhancing & Generating...' : '✨ AI Enhance & Generate Resume'}
        </Button>
        <Button className="w-full" onClick={handleGenerateResume} disabled={isGenerating} variant="outline">
          {isGenerating ? 'Generating...' : 'Generate Resume (No AI)'}
        </Button>
      </div>
    </div>
  );
}

export default App;