import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Template, Project } from "@/lib/types";
import {
  getProjectById,
  getSubmissionsByProjectId,
  getTemplates,
  saveProject,
  updateProject,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project>();

  useEffect(() => {
    const loadTemplates = () => {
      const loadedTemplates = getTemplates();
      setTemplates(loadedTemplates);
    };

    loadTemplates();
  }, []);

  useEffect(() => {
    if (id) {
      const projectMeta = getProjectById(id);
      console.log("projectMeta", projectMeta);
      if (projectMeta) {
        setSelectedProject(projectMeta);
        setName(projectMeta.name);
        setDescription(projectMeta.description);
        setSelectedTemplateId(projectMeta.templateId);
      }
    }
  }, [id]);

  console.log(id);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTemplateId) {
      toast({
        title: "Error",
        description: "Please select a template",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      templateId: selectedTemplateId,
      createdAt: new Date().toISOString(),
    };
    
    if (id && selectedProject) {
      const haveSubmissions: boolean = Boolean(getSubmissionsByProjectId(id).length);
      if (haveSubmissions) {
        toast({
          title: "Error",
          description: "Can not edit the project. Already project have submissions",
          variant: "destructive",
        });
        return;
      }
      const updatedProjectMeta: Project = {
        ...selectedProject,
        name,
        description,
        templateId: selectedTemplateId,
      };
      const result = updateProject(updatedProjectMeta);
      console.log("result", result);
      
    } else {
      saveProject(newProject);
    }

    toast({
      title: "Success",
      description: `Project ${id ? "updated" : "created"} successfully`,
    });
    navigate("/projects");
  };

  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-display font-semibold tracking-tight">
              {id ? "Edit" : "Create"} Project
            </h2>
            <p className="text-muted-foreground">
              {id
                ? "Edit the project and associated template "
                : "Create a new project with an associated form template"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>
              Provide basic information about your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">Select Template</Label>
              {templates.length === 0 ? (
                <div className="border rounded-md p-4 text-center">
                  <p className="text-muted-foreground mb-2">
                    No templates available.
                  </p>
                  <Button asChild>
                    <Link to="/templates/create">Create Template</Link>
                  </Button>
                </div>
              ) : (
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate("/projects")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={templates.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              {id ? "Edit" : "Create"} Project
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateProject;
