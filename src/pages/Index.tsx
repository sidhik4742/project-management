import React, { Fragment } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Folder, ArrowRight, ListPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects, getTemplates } from "@/lib/storage";

const Index = () => {
  const haveProjects: boolean = Boolean(getProjects().length);
  const haveTemplates: boolean = Boolean(getTemplates().length);
  return (
    <Layout>
      <div className="space-y-8 py-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-semibold tracking-tight transition-colors">
            Template Management System
          </h2>
          <p className="text-muted-foreground">
            Create custom templates, manage projects and collect form
            submissions easily.
          </p>
        </div>

        <Fragment>
          {haveProjects || haveTemplates ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden border border-border/40 transition-all duration-200 hover:shadow-md">
                <CardHeader className="p-6">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates
                  </CardTitle>
                  <CardDescription>
                    Create and manage custom form templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Design reusable templates with various field types including
                    text, select, checkboxes, and more.
                  </p>
                  <Button asChild>
                    <Link to="/templates">
                      Manage Templates <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border border-border/40 transition-all duration-200 hover:shadow-md">
                <CardHeader className="p-6">
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    Projects
                  </CardTitle>
                  <CardDescription>
                    Create projects with associated templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Organize your work into projects, each using a specific
                    template for data collection and form submissions.
                  </p>
                  <Button asChild>
                    <Link to="/projects">
                      Manage Projects <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="overflow-hidden border border-border/40">
              <div className="md:grid md:grid-cols-2">
                <div className="p-6 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <ListPlus className="h-5 w-5" />
                    Get Started
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Begin by creating templates for your forms, then create
                    projects that use these templates. Collect form submissions
                    and view them all in one place.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full md:w-auto">
                      <Link to="/templates/create">Create Template</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full md:w-auto"
                    >
                      <Link to="/projects/create">Create Project</Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent h-64 md:h-auto" />
              </div>
            </Card>
          )}
        </Fragment>
      </div>
    </Layout>
  );
};

export default Index;
