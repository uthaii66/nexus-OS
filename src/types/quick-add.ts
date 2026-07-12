export type QuickAddAction =
  | "expense"
  | "income"
  | "weight"
  | "meal"
  | "workout"
  | "study-session"
  | "job-application"
  | "application-update"
  | "project-task"
  | "calendar-event"
  | "note";

export interface QuickAddRequest {
  action?: QuickAddAction;
  source?: "button" | "command" | "shortcut" | "module";
}
