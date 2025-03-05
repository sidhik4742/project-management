import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getProjectById, getTemplateById, saveSubmission } from "@/lib/storage";
import { Project, Template, Field, FormSubmission } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { FileInput } from "@/components/ui/file";

type propsType = {
  field: Field;
  handleCheckboxChange: (
    fieldId: string,
    option: string,
    checked: boolean
  ) => void;
  handleInputChange: (fieldId: string, value: any) => void;
  formValues: Record<string, any>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

function RenderForm({
  field,
  handleCheckboxChange,
  handleInputChange,
  setFormValues,
  formValues,
}: propsType) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);

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

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case "text area":
        return (
          <Textarea
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            rows={3}
          />
        );
      case "select":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={(formValues[field.id] || []).includes(option)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(field.id, option, checked === true)
                  }
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        );
      case "file":
        return (
          <FileInput
            onChange={(e) => {
              const file = e.target.files[0];
              handleInputChange(field.id, file);
            }}
            required={field.required}
          />
        );
      default:        
        return null;
    }
  };

  return renderField(field);
}

export default RenderForm;
