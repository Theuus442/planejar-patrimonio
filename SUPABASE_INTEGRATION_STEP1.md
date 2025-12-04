# Step 1: Database API Layer - Complete Reference

## What Was Done

Created `services/supabaseDatabase.ts` - a comprehensive database abstraction layer that provides all CRUD operations for the Supabase database without mixing business logic with data access.

## Architecture Overview

The database layer is organized into **9 main modules**, each handling a specific domain:

```
supabaseDatabase.ts
├── usersDB              // User management
├── userDocumentsDB      // Personal documents
├── projectsDB           // Project operations
├── projectClientsDB     // Project-client relationships
├── documentsDB          // Project documents
├── tasksDB              // Task management
├── chatDB               // Chat messages
├── activityLogsDB       // Activity tracking
├── phaseDataDB          // Phase-specific data
├── assetsDB             // Asset management
├── notificationsDB      // Notifications
└── Mapping Functions    // Data transformation
```

## API Reference

### Users Module (`usersDB`)

#### `getUser(userId: string): Promise<User | null>`
Fetch a single user by ID with all related data (qualification, documents).
```typescript
const user = await usersDB.getUser('user-123');
if (user) {
  console.log(user.name, user.qualificationData);
}
```

#### `listUsers(): Promise<User[]>`
Fetch all users ordered by name.
```typescript
const allUsers = await usersDB.listUsers();
```

#### `listUsersByRole(role: string): Promise<User[]>`
Fetch users filtered by role (client, consultant, auxiliary, administrator).
```typescript
const consultants = await usersDB.listUsersByRole('consultant');
```

#### `createUser(user: Partial<User> & { id: string }): Promise<User | null>`
Create a new user. The `id` should come from Supabase Auth.
```typescript
const newUser = await usersDB.createUser({
  id: authUser.id,
  name: 'João Silva',
  email: 'joao@example.com',
  role: 'client',
  clientType: 'partner'
});
```

#### `updateUser(userId: string, updates: Partial<User>): Promise<User | null>`
Update user information.
```typescript
await usersDB.updateUser('user-123', {
  name: 'João da Silva',
  avatarUrl: 'https://...'
});
```

#### `deleteUser(userId: string): Promise<boolean>`
Delete a user (cascades to related data due to foreign keys).
```typescript
const deleted = await usersDB.deleteUser('user-123');
```

#### `updateQualificationData(userId: string, qualificationData: any): Promise<boolean>`
Update partner qualification data (CPF, RG, marital status, etc.).
```typescript
await usersDB.updateQualificationData('user-123', {
  cpf: '111.222.333-44',
  rg: '12.345.678-9',
  maritalStatus: 'casado',
  birthDate: '1965-05-20',
  // ... other fields
});
```

#### `getQualificationData(userId: string): Promise<any | null>`
Retrieve qualification data for a specific user.
```typescript
const qualData = await usersDB.getQualificationData('user-123');
```

---

### User Documents Module (`userDocumentsDB`)

#### `uploadUserDocument(userId: string, document: any): Promise<boolean>`
Register a user's uploaded document (RG, CNH, tax return, etc.).
```typescript
await userDocumentsDB.uploadUserDocument('user-123', {
  name: 'CNH_joao.pdf',
  category: 'identity',
  url: 'https://supabase-storage-url/...'
});
```

#### `getUserDocuments(userId: string): Promise<any[]>`
Fetch all documents for a user.
```typescript
const docs = await userDocumentsDB.getUserDocuments('user-123');
```

#### `deleteUserDocument(documentId: string): Promise<boolean>`
Delete a user document.
```typescript
await userDocumentsDB.deleteUserDocument('doc-456');
```

---

### Projects Module (`projectsDB`)

#### `getProject(projectId: string): Promise<Project | null>`
Fetch a complete project with all related data.
```typescript
const project = await projectsDB.getProject('proj-123');
```

#### `listProjects(): Promise<Project[]>`
Fetch all projects (admin/consultant view).
```typescript
const projects = await projectsDB.listProjects();
```

#### `listProjectsByConsultant(consultantId: string): Promise<Project[]>`
Fetch projects assigned to a consultant.
```typescript
const myProjects = await projectsDB.listProjectsByConsultant('consultant-01');
```

#### `listProjectsByClient(clientId: string): Promise<Project[]>`
Fetch projects where a user is a client.
```typescript
const clientProjects = await projectsDB.listProjectsByClient('client-01');
```

#### `createProject(project: Partial<Project>): Promise<Project | null>`
Create a new project.
```typescript
const newProject = await projectsDB.createProject({
  name: 'Holding Família Silva',
  consultantId: 'consultant-01',
  auxiliaryId: 'auxiliary-01'
});
```

#### `updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null>`
Update project information.
```typescript
await projectsDB.updateProject('proj-123', {
  currentPhaseId: 2,
  status: 'completed'
});
```

#### `deleteProject(projectId: string): Promise<boolean>`
Delete a project and all related data.
```typescript
await projectsDB.deleteProject('proj-123');
```

---

### Project Clients Module (`projectClientsDB`)

#### `addClientToProject(projectId: string, clientId: string): Promise<boolean>`
Add a client to a project.
```typescript
await projectClientsDB.addClientToProject('proj-123', 'client-456');
```

#### `removeClientFromProject(projectId: string, clientId: string): Promise<boolean>`
Remove a client from a project.
```typescript
await projectClientsDB.removeClientFromProject('proj-123', 'client-456');
```

#### `getProjectClients(projectId: string): Promise<User[]>`
Fetch all clients associated with a project.
```typescript
const clients = await projectClientsDB.getProjectClients('proj-123');
```

---

### Documents Module (`documentsDB`)

#### `uploadDocument(document: Partial<Document>): Promise<Document | null>`
Register a project document (must have URL from Storage first).
```typescript
await documentsDB.uploadDocument({
  projectId: 'proj-123',
  phaseId: 1,
  name: 'Diagnóstico.pdf',
  url: 'https://supabase-storage-url/...',
  uploadedBy: 'consultant-01'
});
```

#### `listProjectDocuments(projectId: string): Promise<Document[]>`
Fetch all documents for a project.
```typescript
const docs = await documentsDB.listProjectDocuments('proj-123');
```

#### `listPhaseDocuments(projectId: string, phaseId: number): Promise<Document[]>`
Fetch documents for a specific phase.
```typescript
const phaseDocs = await documentsDB.listPhaseDocuments('proj-123', 1);
```

#### `deleteDocument(documentId: string): Promise<boolean>`
Soft-delete a document (marks as deprecated).
```typescript
await documentsDB.deleteDocument('doc-789');
```

---

### Tasks Module (`tasksDB`)

#### `createTask(task: Partial<Task>): Promise<Task | null>`
Create a new task in a phase.
```typescript
await tasksDB.createTask({
  projectId: 'proj-123',
  phaseId: 1,
  description: 'Reunião com cliente',
  createdBy: 'consultant-01',
  assigneeId: 'user-456'
});
```

#### `listProjectTasks(projectId: string): Promise<Task[]>`
Fetch all tasks for a project.
```typescript
const tasks = await tasksDB.listProjectTasks('proj-123');
```

#### `listPhaseTasks(projectId: string, phaseId: number): Promise<Task[]>`
Fetch tasks for a specific phase.
```typescript
const phaseTasks = await tasksDB.listPhaseTasks('proj-123', 1);
```

#### `updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null>`
Update task status or assignee.
```typescript
await tasksDB.updateTask('task-123', {
  status: 'completed',
  assigneeId: 'user-789'
});
```

#### `deleteTask(taskId: string): Promise<boolean>`
Delete a task.
```typescript
await tasksDB.deleteTask('task-123');
```

---

### Chat Module (`chatDB`)

#### `sendMessage(projectId: string, chatType: 'client' | 'internal', message: ChatMessage): Promise<ChatMessage | null>`
Send a message to project chat.
```typescript
await chatDB.sendMessage('proj-123', 'client', {
  id: 'msg-123',
  authorId: 'user-456',
  authorName: 'João Silva',
  authorRole: 'client',
  content: 'Tudo certo com a documentação',
  timestamp: new Date().toISOString()
});
```

#### `getMessages(projectId: string, chatType: 'client' | 'internal'): Promise<ChatMessage[]>`
Fetch all messages for a chat.
```typescript
const messages = await chatDB.getMessages('proj-123', 'client');
```

---

### Activity Logs Module (`activityLogsDB`)

#### `addLogEntry(projectId: string, actorId: string, action: string): Promise<boolean>`
Log a project action.
```typescript
await activityLogsDB.addLogEntry('proj-123', 'consultant-01', 'avançou o projeto para a Fase 2.');
```

#### `getActivityLog(projectId: string): Promise<LogEntry[]>`
Fetch activity log for a project.
```typescript
const log = await activityLogsDB.getActivityLog('proj-123');
```

---

### Phase Data Module (`phaseDataDB`)

#### `getPhase1Data(projectId: string): Promise<Phase1Data | null>`
#### `updatePhase1Data(projectId: string, phaseData: Partial<Phase1Data>): Promise<boolean>`
#### `getPhase2Data(projectId: string): Promise<Phase2Data | null>`
#### `updatePhase2Data(projectId: string, phaseData: Partial<Phase2Data>): Promise<boolean>`
#### `getPhase3Data(projectId: string): Promise<Phase3Data | null>`
#### `updatePhase3Data(projectId: string, phaseData: Partial<Phase3Data>): Promise<boolean>`

Example usage:
```typescript
await phaseDataDB.updatePhase1Data('proj-123', {
  objectives: 'Proteção patrimonial',
  familyComposition: 'João, Maria, Pedro, Ana'
});

const phase1 = await phaseDataDB.getPhase1Data('proj-123');
```

---

### Assets Module (`assetsDB`)

#### `createAsset(projectId: string, asset: Partial<Asset>): Promise<Asset | null>`
Add an asset to phase 3.
```typescript
await assetsDB.createAsset('proj-123', {
  ownerPartnerId: 'client-456',
  type: 'property',
  description: 'Apartamento em Ipanema',
  value: 800000
});
```

#### `updateAsset(assetId: string, updates: Partial<Asset>): Promise<Asset | null>`
#### `deleteAsset(assetId: string): Promise<boolean>`
#### `getAssetsByPhase(projectId: string): Promise<Asset[]>`

---

### Notifications Module (`notificationsDB`)

#### `createNotification(notification: any): Promise<boolean>`
Send a notification to a user.
```typescript
await notificationsDB.createNotification({
  recipientId: 'user-123',
  title: 'Novo comentário',
  message: 'Diego adicionou um comentário na Fase 1',
  link: '/project/proj-123/phase/1'
});
```

#### `getUserNotifications(userId: string): Promise<any[]>`
Fetch unread notifications for a user.
```typescript
const notifications = await notificationsDB.getUserNotifications('user-123');
```

#### `markNotificationAsRead(notificationId: string): Promise<boolean>`

---

## Key Features

### Error Handling
All functions return `null` or `false` on error and log the error to console. Check return values:

```typescript
const user = await usersDB.getUser('user-123');
if (user) {
  // Success
} else {
  // Error or not found
}
```

### Data Mapping
The mapping functions automatically transform database snake_case to camelCase:
- `partner_qualification_data` → `qualificationData`
- `avatar_url` → `avatarUrl`
- `created_at` → `createdAt`

### Automatic Relationships
When fetching a user, it automatically includes:
- Qualification data
- User documents

When fetching a project, it automatically includes:
- Client list
- Chat messages (internal and client)
- Activity log

---

## What's Next

Step 2 will expand `services/supabaseAuth.ts` with complete authentication flows (sign up, sign in, password reset). This layer will handle all auth state management and session persistence.

---

## Troubleshooting

**Q: Why does `getUser` return null?**
A: The user doesn't exist or you don't have permission (RLS policy). Check the console for the specific error.

**Q: How do I know which fields are required?**
A: Check the TypeScript types in `types.ts`. Required fields are not marked as optional (no `?`).

**Q: Can I call multiple database operations in parallel?**
A: Yes, use `Promise.all()`:
```typescript
const [users, projects] = await Promise.all([
  usersDB.listUsers(),
  projectsDB.listProjects()
]);
```

---

## Migration Notes

- Removed all hardcoded data from constants.ts (will be done in Step 6)
- No changes to React components yet (Step 5)
- This layer is ready for use but relies on Supabase being fully set up with tables and RLS policies

---

**Status**: ✅ Complete and ready for Step 2 (Authentication Service Enhancement)
