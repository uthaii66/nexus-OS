import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { ErrorState } from "@/components/common/error-state";

export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const description = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "An unexpected route error occurred.";
  return (
    <div className="min-h-screen bg-background p-6">
      <ErrorState
        title="This part of Nexus could not load"
        description={description}
        onRetry={() => navigate("/")}
      />
    </div>
  );
}
