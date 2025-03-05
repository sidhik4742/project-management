
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTemplates } from '@/lib/storage';
import { Template } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadTemplates = () => {
      const loadedTemplates = getTemplates();
      setTemplates(loadedTemplates);
    };
    
    loadTemplates();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-semibold tracking-tight">
              Templates
            </h2>
            <p className="text-muted-foreground">
              Create and manage your form templates
            </p>
          </div>
          <Button asChild>
            <Link to="/templates/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Link>
          </Button>
        </div>

        {templates.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <p className="text-muted-foreground mb-4">
                No templates created yet. Create your first template to get started.
              </p>
              <Button asChild>
                <Link to="/templates/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {template.fields.length} fields
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/templates/edit/${template.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Templates;
