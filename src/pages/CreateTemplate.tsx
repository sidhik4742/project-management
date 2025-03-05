
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, ArrowLeft, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldType, Template } from '@/lib/types';
import { saveTemplate } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { inputTypes } from '@/constants/constants';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  
  // For current field being edited
  const [currentField, setCurrentField] = useState<Field>({
    id: '',
    label: '',
    type: 'text',
    required: false,
    options: []
  });

  const [currentOption, setCurrentOption] = useState('');

  const addOption = () => {
    if (currentOption.trim() && currentField.options) {
      setCurrentField({
        ...currentField,
        options: [...(currentField.options || []), currentOption.trim()]
      });
      setCurrentOption('');
    }
  };

  const removeOption = (index: number) => {
    if (currentField.options) {
      const newOptions = [...currentField.options];
      newOptions.splice(index, 1);
      setCurrentField({
        ...currentField,
        options: newOptions
      });
    }
  };

  const addField = () => {
    if (currentField.label.trim()) {
      const newField = {
        ...currentField,
        id: Date.now().toString()
      };
      setFields([...fields, newField]);
      setCurrentField({
        id: '',
        label: '',
        type: 'text',
        required: false,
        options: []
      });
    }
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one field to your template",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      description,
      fields,
      createdAt: new Date().toISOString()
    };

    saveTemplate(newTemplate);
    toast({
      title: "Success",
      description: "Template created successfully"
    });
    navigate('/templates');
  };

  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-display font-semibold tracking-tight">
              Create Template
            </h2>
            <p className="text-muted-foreground">
              Define form fields and structure
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Information</CardTitle>
            <CardDescription>
              Provide basic information about your template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="Enter template name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter template description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Fields</CardTitle>
            <CardDescription>
              Add fields to collect information in your form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field-label">Field Label</Label>
                <Input
                  id="field-label"
                  placeholder="Enter field label"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({...currentField, label: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field-type">Field Type</Label>
                <Select 
                  value={currentField.type} 
                  onValueChange={(value: FieldType) => setCurrentField({...currentField, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Object.values(inputTypes).map(type => (
                        <SelectItem value={type.toLowerCase()}>{type}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="required"
                  checked={currentField.required}
                  onCheckedChange={(checked) => 
                    setCurrentField({...currentField, required: checked === true})
                  }
                />
                <label
                  htmlFor="required"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Required Field
                </label>
              </div>

              {(currentField.type === 'select' || currentField.type === 'checkbox' || currentField.type === 'radio') && (
                <div className="space-y-3 border rounded-md p-3">
                  <Label>Options</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add option"
                      value={currentOption}
                      onChange={(e) => setCurrentOption(e.target.value)}
                    />
                    <Button type="button" onClick={addOption} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {currentField.options && currentField.options.length > 0 && (
                    <div className="space-y-2">
                      {currentField.options.map((option, index) => (
                        <div key={index} className="flex items-center justify-between border rounded-md px-3 py-2">
                          <span>{option}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeOption(index)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <Button onClick={addField} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>

            {fields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Template Preview</h3>
                <div className="border rounded-md divide-y">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                          {field.required && ' (Required)'}
                        </p>
                        {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && field.options && (
                          <p className="text-sm text-muted-foreground">
                            Options: {field.options.join(', ')}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeField(field.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/templates')}>Cancel</Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateTemplate;
