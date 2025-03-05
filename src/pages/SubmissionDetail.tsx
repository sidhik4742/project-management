
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getProjectById, getTemplateById, getSubmissions } from '@/lib/storage';
import { Project, Template, FormSubmission, Field } from '@/lib/types';

const SubmissionDetail = () => {
  const { projectId, submissionId } = useParams<{ projectId: string, submissionId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    if (!projectId || !submissionId) return;

    const loadData = () => {
      const projectData = getProjectById(projectId);
      if (!projectData) return;
      setProject(projectData);
      
      const templateData = getTemplateById(projectData.templateId);
      if (!templateData) return;
      setTemplate(templateData);
      
      const submissions = getSubmissions();
      const submissionData = submissions.find(sub => sub.id === submissionId);
      if (submissionData) {
        setSubmission(submissionData);
      }
    };
    
    loadData();
  }, [projectId, submissionId]);

  const renderFieldValue = (field: Field, value: any) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    switch (field.type) {
      case 'checkbox':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <ul className="list-disc pl-5">
              {value.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          );
        }
        return <span className="text-muted-foreground italic">None selected</span>;
      
      case 'date':
        return new Date(value).toLocaleDateString();
      
      default:
        return <span>{value}</span>;
    }
  };

  if (!project || !template || !submission) {
    return (
      <Layout>
        <div className="py-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <p>Submission not found or loading...</p>
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
          <Button variant="outline" size="icon" onClick={() => navigate(`/projects/${projectId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-display font-semibold tracking-tight">
              Submission Details
            </h2>
            <p className="text-muted-foreground">
              Viewing submission for {project.name}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Form Submission</CardTitle>
                <CardDescription>
                  {template.name}
                </CardDescription>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(submission.submittedAt).toLocaleString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <tbody>
                  {template.fields.map((field) => (
                    <tr key={field.id} className="border-t first:border-t-0">
                      <th className="bg-muted/30 text-left p-3 w-1/3">{field.label}</th>
                      <td className="p-3">
                        {renderFieldValue(field, submission.values[field.id])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubmissionDetail;
