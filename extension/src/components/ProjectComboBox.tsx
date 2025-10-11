// extension/src/components/ProjectComboBox.tsx
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ResumeItem } from "@/types/resume"

interface ProjectComboBoxProps {
  allProjects: any[];
  savedProjects: ResumeItem[];
  onProjectAdd: (project: any) => void;
}

export function ProjectComboBox({ allProjects, savedProjects, onProjectAdd }: ProjectComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  // Filter out projects that have already been saved/selected
  const availableProjects = allProjects.filter(p => 
    !savedProjects.some(sp => sp.id === `proj_${p.id}`)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={allProjects.length === 0}
        >
          {allProjects.length > 0 ? "Select a project to add..." : "Refresh repo list first"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {availableProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    onProjectAdd(project)
                    setOpen(false)
                  }}
                >
                  {project.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}