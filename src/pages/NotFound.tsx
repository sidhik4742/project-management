
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-display font-bold text-primary">404</h1>
            <h2 className="text-2xl font-medium">Page not found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> 
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
