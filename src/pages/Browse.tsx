
import React from "react";
import { Layout } from "@/components/layout/Layout";

const Browse = () => {
  return (
    <Layout>
      <div className="space-y-6 py-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-semibold tracking-tight">
            Browse
          </h2>
          <p className="text-muted-foreground">
            Discover content with our elegant browsing experience.
          </p>
        </div>
        
        <div className="h-64 rounded-lg bg-secondary/50 flex items-center justify-center">
          <p className="text-muted-foreground">Browse content will appear here</p>
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
