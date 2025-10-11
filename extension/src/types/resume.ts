
export interface UserDetails {
  name: string;
  job_title: string;
  email: string;
  linkedin: string;
  github_username: string;
}

export interface ResumeItem {
  id: string;
  primary: string; 
  secondary: string;
  timeline: string; 
  description: string;
  repo_link?: string;
}

export interface ResumeSection {
  id: string; 
  title: string; 
  items: ResumeItem[];
}