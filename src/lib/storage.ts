import { Template, Project, FormSubmission } from "./types";

// Initialize storage with empty arrays if they don't exist
const initializeStorage = () => {
  if (!localStorage.getItem("templates")) {
    localStorage.setItem("templates", JSON.stringify([]));
  }
  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify([]));
  }
  if (!localStorage.getItem("submissions")) {
    localStorage.setItem("submissions", JSON.stringify([]));
  }
};

// Templates
export const getTemplates = (): Template[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem("templates") || "[]");
};

export const saveTemplate = (template: Template): void => {
  const templates = getTemplates();
  templates.push(template);
  localStorage.setItem("templates", JSON.stringify(templates));
};

export const getTemplateById = (id: string): Template | undefined => {
  const templates = getTemplates();
  return templates.find((template) => template.id === id);
};

// Projects
export const getProjects = (): Project[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem("projects") || "[]");
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
};

export const saveAllProject = (projects: Array<Project>): void => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find((project) => project.id === id);
};

export const updateProject = (data: Project): Project | undefined => {
  let projects = getProjects();
  const projectIndex = projects.findIndex((project) => project.id === data.id);
  if (projectIndex >= 0) {
    projects[projectIndex] = data;
    saveAllProject(projects);
    return projects[projectIndex];
  }
  return undefined;
};

// Form Submissions
export const getSubmissions = (): FormSubmission[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem("submissions") || "[]");
};

export const getSubmissionsByProjectId = (
  projectId: string
): FormSubmission[] => {
  const submissions = getSubmissions();
  return submissions.filter((submission) => submission.projectId === projectId);
};

export const saveSubmission = (submission: FormSubmission): void => {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem("submissions", JSON.stringify(submissions));
};
