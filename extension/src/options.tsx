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

// Define an interface for our user details for type safety
interface UserDetails {
  name: string;
  email: string;
  linkedin: string;
  github_username: string;
  about: string;
  skills: string; // We'll store skills as a comma-separated string
  job_title: string;
}

const Options = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    linkedin: '',
    github_username: '',
    about: '',
    skills: '',
    job_title: '',
  });

  // Load existing user details from storage when the page opens
  useEffect(() => {
    chrome.storage.sync.get(['userDetails'], (result) => {
      if (result.userDetails) {
        setUserDetails(result.userDetails);
      }
    });
  }, []);

  // Handle changes to any input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Save the details to chrome.storage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.sync.set({ userDetails }, () => {
      // --- This is the new, simpler API for Sonner ---
      toast("Success!", {
        description: "Your details have been saved.",
        action: {
          label: "Dismiss",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription>
            This information will be used to generate your resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {/* The form JSX is exactly the same as before */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={userDetails.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" name="job_title" value={userDetails.job_title} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={userDetails.email} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input id="linkedin" name="linkedin" value={userDetails.linkedin} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_username">GitHub Username</Label>
                <Input id="github_username" name="github_username" value={userDetails.github_username} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About You</Label>
              <Textarea id="about" name="about" value={userDetails.about} onChange={handleChange} rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" name="skills" placeholder="e.g., Python, React, FastAPI" value={userDetails.skills} onChange={handleChange} />
            </div>
            <Button type="submit" className="w-full">Save Details</Button>
          </form>
        </CardContent>
      </Card>
      <Toaster /> {/* <-- This component is now imported from sonner */}
    </div>
  );
};

// --- This rendering part is the same ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>
  );
}