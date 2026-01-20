// extension/src/options.tsx

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster} from "@/components/ui/sonner";
import { toast } from "sonner";
import { ThemeProvider } from './components/theme-provider';
import { EditSectionDialog } from './components/EditSectionDialog';

import { UserDetails, ResumeSection } from './types/resume';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from '@hello-pangea/dnd';

const Options = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    job_title: '',
    email: '',
    linkedin: '',
    github_username: '',
  });

  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [editingSection, setEditingSection] = useState<ResumeSection | null>(null);
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  // Load data from storage on component mount
  useEffect(() => {
    chrome.storage.sync.get(['userDetails', 'sections', 'deepseekApiKey'], (result) => {
      if (result.userDetails) setUserDetails(result.userDetails);
      if (result.deepseekApiKey) setDeepseekApiKey(result.deepseekApiKey);
      if (result.sections && result.sections.length > 0) {
        setSections(result.sections);
      } else {
        setSections([
          { id: `sec_${Date.now()}_1`, title: 'Educational Qualifications', items: [] },
          { id: `sec_${Date.now()}_2`, title: 'Employment History', items: [] },
          { id: `sec_${Date.now()}_3`, title: 'Projects', items: [] },
        ]);
      }
    });
  }, []);

  // --- HANDLERS ---

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.sync.set({ userDetails, sections, deepseekApiKey }, () => {
      toast("Success!", { description: "Your settings have been saved." });
    });
  };
  
  const handleLoadFromGoogleDoc = async () => {
    if (!googleDocUrl.trim()) {
      toast("Error", { description: "Please enter a Google Docs URL" });
      return;
    }
    
    setIsLoadingDoc(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/parse_google_doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_url: googleDocUrl })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to parse document');
      }
      
      const data = await response.json();
      
      // Merge user details
      if (data.user_details) {
        setUserDetails(prev => ({ ...prev, ...data.user_details }));
      }
      
      // Merge sections (avoid duplicating Projects section)
      if (data.sections) {
        const existingProjectsSection = sections.find(s => s.title === 'Projects');
        const newSections = data.sections.filter((s: any) => s.title !== 'Projects');
        if (existingProjectsSection) {
          setSections([...newSections, existingProjectsSection]);
        } else {
          setSections([...newSections, { id: `sec_${Date.now()}`, title: 'Projects', items: [] }]);
        }
      }
      
      toast("Success!", { description: "Data loaded from Google Docs. Don't forget to save!" });
    } catch (error: any) {
      toast("Error", { description: error.message });
    } finally {
      setIsLoadingDoc(false);
    }
  };
  
  const handleAddSection = () => {
    const title = prompt("Enter the title for the new section:");
    if (title) {
      const newSection: ResumeSection = { id: `sec_${Date.now()}`, title, items: [] };
      setSections(prev => [...prev, newSection]);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections(prev => prev.filter(s => s.id !== sectionId));
    }
  };

  const handleSaveSection = (updatedSection: ResumeSection) => {
    setSections(prev => prev.map(s => s.id === updatedSection.id ? updatedSection : s));
  };
  
  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Codefolio Settings</CardTitle>
          <CardDescription>Manage the content and appearance of your generated resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">
            {/* --- Optional: Load from Google Docs --- */}
            <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium">📄 Quick Import from Google Docs (Optional)</h3>
              <p className="text-sm text-muted-foreground">
                Have your CV in a Google Doc? Share it with "Anyone with the link" and paste the URL below to auto-fill your details.
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://docs.google.com/document/d/..." 
                  value={googleDocUrl} 
                  onChange={(e) => setGoogleDocUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleLoadFromGoogleDoc}
                  disabled={isLoadingDoc}
                  variant="outline"
                >
                  {isLoadingDoc ? 'Loading...' : 'Import'}
                </Button>
              </div>
            </div>

            {/* --- DeepSeek API Key (Optional) --- */}
            <div className="space-y-4 bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-medium">🤖 AI Enhancement (Optional)</h3>
              <p className="text-sm text-muted-foreground">
                Add your DeepSeek API key to automatically generate professional descriptions for GitHub projects without descriptions.
              </p>
              <div className="space-y-2">
                <Label>DeepSeek API Key</Label>
                <Input 
                  type="password"
                  placeholder="sk-..." 
                  value={deepseekApiKey} 
                  onChange={(e) => setDeepseekApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from <a href="https://platform.deepseek.com/api_keys" target="_blank" className="text-blue-600 hover:underline">DeepSeek Platform</a>
                </p>
              </div>
            </div>

            {/* --- Part 1: Basic Details Form --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={userDetails.name} onChange={handleDetailsChange} /></div>
                <div className="space-y-2"><Label>Job Title / Role</Label><Input name="job_title" value={userDetails.job_title} onChange={handleDetailsChange} /></div>
                <div className="space-y-2"><Label>Email Address</Label><Input name="email" type="email" value={userDetails.email} onChange={handleDetailsChange} /></div>
                <div className="space-y-2"><Label>LinkedIn Profile URL</Label><Input name="linkedin" value={userDetails.linkedin} onChange={handleDetailsChange} /></div>
              </div>
            </div>
            
            {/* --- Part 2: Dynamic Sections List (with Drag-and-Drop) --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-medium">Resume Sections</h3><p className="text-sm text-muted-foreground">Drag to re-order</p></div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div className="space-y-3 rounded-lg border p-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {sections.filter(s => s.title !== 'Projects').map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Card>
                                <CardContent className="p-4 flex items-center justify-between">
                                  <p className="font-semibold">{section.title}</p>
                                  <div className="flex items-center space-x-2">
                                    <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setEditingSection(section); }}>Edit</Button>
                                    <Button type="button" variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}>Delete</Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <Button type="button" variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); handleAddSection(); }}>+ Add New Section</Button>
            </div>

            <div className="space-y-6 border-t pt-6">
      
              <Button type="submit" className="w-full bg-[#238636] text-white hover:bg-[#2ea043]">Save All Settings</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <EditSectionDialog section={editingSection} onClose={() => setEditingSection(null)} onSave={handleSaveSection} />
      <Toaster />
    </div>
  );
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="codefolio-theme">
        <Options />
      </ThemeProvider>
    </React.StrictMode>
  );
}