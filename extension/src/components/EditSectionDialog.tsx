// extension/src/components/EditSectionDialog.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeItem, ResumeSection } from "@/types/resume";
import { useState, useEffect } from "react";


interface EditSectionDialogProps {
  section: ResumeSection | null;
  onClose: () => void;
  onSave: (updatedSection: ResumeSection) => void;
}

export const EditSectionDialog = ({ section, onClose, onSave }: EditSectionDialogProps) => {
  // This state holds the "draft" of our changes while the dialog is open
  const [editedSection, setEditedSection] = useState<ResumeSection | null>(null);

  // This effect synchronizes the internal state with the prop passed from the parent.
  // It runs whenever the 'section' prop changes (i.e., when the user clicks 'Edit').
  useEffect(() => {
    // We create a deep copy to prevent accidentally modifying the original state
    setEditedSection(section ? JSON.parse(JSON.stringify(section)) : null);
  }, [section]);

  // If there's no section being edited, don't render anything.
  if (!editedSection) {
    return null;
  }

  // --- HANDLERS FOR MANIPULATING ITEMS WITHIN THE DIALOG ---

  const handleAddItem = () => {
    const newItem: ResumeItem = {
      id: `item_${Date.now()}`,
      primary: '',
      secondary: '',
      timeline: '',
      description: '',
    };
    setEditedSection(prev => prev ? { ...prev, items: [...prev.items, newItem] } : null);
  };

  const handleDeleteItem = (itemId: string) => {
    setEditedSection(prev => prev ? { ...prev, items: prev.items.filter(item => item.id !== itemId) } : null);
  };

  const handleItemChange = (itemId: string, field: keyof ResumeItem, value: string) => {
    setEditedSection(prev => prev ? {
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    } : null);
  };

  const handleSaveChanges = () => {
    if (editedSection) {
      onSave(editedSection);
    }
    onClose(); // This closes the dialog
  };

  return (
    <Dialog open={!!section} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Editing Section: {editedSection.title}</DialogTitle>
          <DialogDescription>
            Add, edit, or remove items for this section. The "Projects" section is managed from the extension popup.
          </DialogDescription>
        </DialogHeader>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
          {editedSection.items.length === 0 ? (
             <p className="text-sm text-muted-foreground text-center py-8">No items in this section yet. Click "+ Add New Item" to begin.</p>
          ) : (
            editedSection.items.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3 bg-secondary/50">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Item #{index + 1}</p>
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>Delete Item</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Primary Text</Label><Input placeholder="(e.g., Degree or Job Title)" value={item.primary} onChange={(e) => handleItemChange(item.id, 'primary', e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Secondary Text</Label><Input placeholder="(e.g., University or Company)" value={item.secondary} onChange={(e) => handleItemChange(item.id, 'secondary', e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Timeline</Label><Input placeholder="(e.g., 2020 - 2024)" value={item.timeline} onChange={(e) => handleItemChange(item.id, 'timeline', e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} rows={3} /></div>
              </div>
            ))
          )}
        </div>
        
        {/* --- ACTION FOOTER --- */}
        <div className="px-6 py-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddItem} 
            disabled={editedSection.title === 'Projects'} 
            className="w-full"
          >
            + Add New Item
          </Button>
        </div>
        
        <DialogFooter className="p-6 bg-secondary/30">
          <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
          <Button type="button" onClick={handleSaveChanges}>Save Changes to Section</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};