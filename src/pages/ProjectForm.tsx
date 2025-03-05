import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getProjectById, getTemplateById, saveSubmission } from "@/lib/storage";
import { Project, Template, Field, FormSubmission } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import RenderForm from "@/components/ui/render-form";

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!id) return;

    const loadProjectData = () => {
      const projectData = getProjectById(id);

      if (projectData) {
        setProject(projectData);

        const templateData = getTemplateById(projectData.templateId);
        if (templateData) {
          setTemplate(templateData);

          // Initialize form values
          const initialValues: Record<string, any> = {};
          templateData.fields.forEach((field) => {
            if (field.type === "checkbox") {
              initialValues[field.id] = [];
            } else {
              initialValues[field.id] = "";
            }
          });
          setFormValues(initialValues);
        }
      }
    };

    loadProjectData();
  }, [id]);

  const handleInputChange = (fieldId: string, value: any) => {
    console.log("value", value);

    setFormValues({
      ...formValues,
      [fieldId]: value,
    });
  };

  const handleCheckboxChange = (
    fieldId: string,
    option: string,
    checked: boolean
  ) => {
    const currentValues = formValues[fieldId] || [];

    let newValues;
    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((val: string) => val !== option);
    }

    setFormValues({
      ...formValues,
      [fieldId]: newValues,
    });
  };

  const validateForm = () => {
    if (!template) return false;

    let isValid = true;
    const errors: string[] = [];

    console.log("template", formValues);

    template.fields.forEach((field) => {
      if (field.required) {
        const value = formValues[field.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          isValid = false;
          errors.push(`${field.label} is required`);
        }
      }
    });

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm() || !project || !template) return;

    const submission: FormSubmission = {
      id: Date.now().toString(),
      projectId: project.id,
      templateId: template.id,
      values: formValues,
      submittedAt: new Date().toISOString(),
    };

    saveSubmission(submission);
    toast({
      title: "Success",
      description: "Form submitted successfully",
    });
    navigate(`/projects/${id}`);
  };

  if (!project || !template) {
    return (
      <Layout>
        <div className="py-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <p>Project not found or loading...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/projects/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-display font-semibold tracking-tight">
              {project.name}
            </h2>
            <p className="text-muted-foreground">
              Submit a new form for this project
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{template.name} Form</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.fields.map((field: Field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                {
                  <RenderForm
                    key={field.id}
                    field={field}
                    handleCheckboxChange={handleCheckboxChange}
                    handleInputChange={handleInputChange}
                    setFormValues={setFormValues}
                    formValues={formValues}
                  />
                }
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/projects/${id}`)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Submit Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectForm;
