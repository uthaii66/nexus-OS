import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { RouteError } from "@/app/route-error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import(
            "@/features/overview/pages/overview-page"
          );
          return { Component: module.OverviewPage };
        },
      },
      {
        path: "finance",
        lazy: async () => {
          const module = await import("@/features/finance");
          return { Component: module.FinancePage };
        },
      },
      {
        path: "health",
        lazy: async () => {
          const module = await import("@/features/health");
          return { Component: module.HealthPage };
        },
      },
      {
        path: "learning",
        lazy: async () => {
          const module = await import("@/features/learning");
          return { Component: module.LearningPage };
        },
      },
      {
        path: "career",
        lazy: async () => {
          const module = await import("@/features/career");
          return { Component: module.CareerPage };
        },
      },
      {
        path: "projects",
        lazy: async () => {
          const module = await import("@/features/projects");
          return { Component: module.ProjectsPage };
        },
      },
      {
        path: "projects/:projectId",
        lazy: async () => {
          const module = await import("@/features/projects");
          return { Component: module.ProjectDetailPage };
        },
      },
      {
        path: "calendar",
        lazy: async () => {
          const module = await import("@/features/calendar");
          return { Component: module.CalendarPage };
        },
      },
      {
        path: "insights",
        lazy: async () => {
          const module = await import("@/features/insights");
          return { Component: module.InsightsPage };
        },
      },
      {
        path: "settings",
        lazy: async () => {
          const module = await import("@/features/settings");
          return { Component: module.SettingsPage };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const module = await import(
            "@/features/not-found/pages/not-found-page"
          );
          return { Component: module.NotFoundPage };
        },
      },
    ],
  },
]);
