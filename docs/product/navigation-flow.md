# Navigation Flow

```mermaid
flowchart TD
    SignIn["Sign in / Sign up"] --> Verify["Verify email"]
    Verify --> Dashboard["Dashboard"]
    SignIn --> Dashboard

    Dashboard --> Boards["Boards list"]
    Boards --> BoardDetail["Board detail"]
    BoardDetail --> Columns["Columns"]
    Columns --> Tasks["Tasks"]
    Tasks --> TaskDialog["Task dialog"]
    TaskDialog --> Subtasks["Subtasks"]
```

## Reading the flow

- Authenticated users land in the dashboard.
- A board is the main container for the rest of the workflow.
- Columns group tasks visually.
- Tasks can be created, edited, viewed, and broken into subtasks.
