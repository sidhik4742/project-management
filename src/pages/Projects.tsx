import React, { useState, useEffect } from "react";
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
import { Plus, FileText, ArrowRight, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects, getTemplateById } from "@/lib/storage";
import { Project } from "@/lib/types";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = () => {
      const loadedProjects = getProjects();
      setProjects(loadedProjects);
    };

    loadProjects();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-semibold tracking-tight">
              Projects
            </h2>
            <p className="text-muted-foreground">
              Manage your projects and their forms
            </p>
          </div>
          <Button asChild>
            <Link to="/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <p className="text-muted-foreground mb-4">
                No projects created yet. Create your first project to get
                started.
              </p>
              <Button asChild>
                <Link to="/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const template = getTemplateById(project.templateId);

              return (
                <Card
                  key={project.id}
                  className="transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex justify-between" >
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Link to={`/projects/edit/${project.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Template: {template?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/projects/${project.id}/form`}>
                        <FileText className="h-4 w-4 mr-1" />
                        Create
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/projects/${project.id}`}>
                        View
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
