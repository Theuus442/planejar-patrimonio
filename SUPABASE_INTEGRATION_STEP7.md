# Step 7: Database Seeding & Testing - Complete Guide

## What Needs to Be Done

This step verifies that the complete Supabase integration works end-to-end by:
1. Initializing the database with test data
2. Testing login with multiple user roles
3. Verifying data persistence
4. Testing basic CRUD operations
5. Confirming RLS policies work

## Automatic Database Initialization

### How It Works

When you start the app for the first time:

```typescript
// In App.tsx useEffect
const dbStatus = await dataMigrationService.getStatus();
if (!dbStatus.isSeeded) {
  console.log('🚀 First time setup...');
  const result = await dataMigrationService.initializeDatabase();
  // Creates test users and projects
}
```

### Expected Startup Flow

```
[App Loads]
  ↓
[App.tsx useEffect runs]
  ├─→ Check: Is database empty?
  │   ├─→ If YES: Initialize
  │   │   ├─→ Create 5 test users
  │   │   ├─→ Create sample project
  │   │   ├─→ Link clients to project
  │   │   └─→ Seed Phase 1 data
  │   └─→ If NO: Skip
  ├─→ Try to restore session
  │   ├─→ If logged in: Load data
  │   └─→ If logged out: Show login screen
  ↓
[Ready for testing]
```

### Console Output

If everything works, you should see:

```
🚀 First time setup - initializing database...
🌱 Seeding test users...
  ✓ Created user: admin@planejar.com
  ✓ Created user: diego.garcia@grupociatos.com.br
  ✓ Created user: joao.completo@email.com
  ✓ Created user: maria.completo@email.com
  ✓ Created user: servicos@grupociatos.com.br
✅ Test users seeding complete

🌱 Seeding test project...
  ✓ Created project: Holding Família Completo
  ✓ Added João as client
  ✓ Added Maria as client
  ✓ Seeded Phase 1 data
  ✓ Added qualification data for João
  ✓ Added qualification data for Maria
✅ Test project seeding complete

🎉 Database initialization complete!

Test Credentials:
- Admin: admin@planejar.com / admin123
- Consultant: diego.garcia@grupociatos.com.br / 250500
- Client 1: joao.completo@email.com / 123
- Client 2: maria.completo@email.com / 123
- Auxiliary: servicos@grupociatos.com.br / 123456
```

## Test Scenarios

### Test 1: Admin Login

**Credentials:**
```
Email: admin@planejar.com
Password: admin123
```

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirected to admin dashboard
- ✅ Can see "Consultant Dashboard" (all projects)
- ✅ Can access admin menu items

**Steps:**
1. Go to login page
2. Enter credentials
3. Click "Entrar"
4. Verify you see the admin dashboard

---

### Test 2: Consultant Login

**Credentials:**
```
Email: diego.garcia@grupociatos.com.br
Password: 250500
```

**Expected Result:**
- ✅ Login succeeds
- ✅ See "Consultant Dashboard"
- ✅ Can see the test project "Holding Família Completo"
- ✅ Can view project details
- ✅ Can create new projects

**Steps:**
1. Clear cookies/logout from Test 1
2. Enter consultant credentials
3. Click "Entrar"
4. Verify you see consultant dashboard
5. Click on the project to view details

---

### Test 3: Client Login

**Credentials:**
```
Email: joao.completo@email.com
Password: 123
```

**Expected Result:**
- ✅ Login succeeds
- ✅ See "Client Dashboard"
- ✅ Only see the one project assigned to this client
- ✅ Can't see other clients' projects
- ✅ Can view Phase 1 data (their qualification info)

**Steps:**
1. Clear cookies/logout
2. Enter client credentials
3. Click "Entrar"
4. Verify you see only client dashboard with one project

---

### Test 4: Auxiliary Login

**Credentials:**
```
Email: servicos@grupociatos.com.br
Password: 123456
```

**Expected Result:**
- ✅ Login succeeds
- ✅ See "Auxiliary Dashboard"
- ✅ Can see all projects
- ✅ Can view tasks assigned to them
- ✅ Can't modify projects

**Steps:**
1. Clear cookies/logout
2. Enter auxiliary credentials
3. Click "Entrar"
4. Verify you see auxiliary dashboard

---

### Test 5: Data Persistence (Page Reload)

**Objective:** Verify data stays loaded after page refresh

**Steps:**
1. Login as consultant
2. Note the project name "Holding Família Completo"
3. Press F5 to refresh page
4. Verify you're still logged in
5. Verify the project is still visible

**Expected Result:**
- ✅ Session persists after reload
- ✅ Same projects are visible
- ✅ No re-login needed
- ✅ Data loads from Supabase correctly

---

### Test 6: Invalid Credentials

**Steps:**
1. Go to login page
2. Enter: `test@example.com` / `wrongpassword`
3. Click "Entrar"

**Expected Result:**
- ✅ Login fails
- ✅ Error message: "E-mail ou senha inválidos."
- ✅ Not redirected to dashboard
- ✅ Stay on login page

---

### Test 7: Password Reset (Optional)

**Steps:**
1. On login page, click "Esqueceu sua senha?"
2. Enter `diego.garcia@grupociatos.com.br`
3. Click OK

**Expected Result:**
- ✅ Shows message: "Se o e-mail estiver cadastrado..."
- ✅ Supabase sends reset email (check spam folder)
- ✅ Can click reset link in email
- ✅ Set new password
- ✅ Login with new password works

**Note:** Email sending requires Supabase email configuration.

---

### Test 8: Project Access Control (RLS)

**Objective:** Verify Row-Level Security prevents unauthorized access

**Test 8a: Client sees only their project**
1. Login as João (joao.completo@email.com)
2. Should see 1 project: "Holding Família Completo"
3. Can't see projects from other consultants
4. Can't edit consultant-only fields

**Test 8b: Consultant sees all projects**
1. Login as Diego (diego.garcia@grupociatos.com.br)
2. Should see all projects (including any created by other consultants)
3. Can edit projects
4. Can view all clients

**Expected Result:**
- ✅ RLS policies enforce access control
- ✅ No SQL errors in console
- ✅ Appropriate data is returned based on role

---

### Test 9: Navigation & Views

**Objective:** Test that all views load correctly

**As Consultant:**
1. ✅ Dashboard loads
2. ✅ Click project → Project detail loads
3. ✅ Click "Criar Cliente" → Create client form loads
4. ✅ Click "Usuários" → Users list loads
5. ✅ Click "Documentos" → Documents view loads

**As Client:**
1. ✅ Dashboard shows project
2. ✅ Can navigate to phases
3. ✅ Can view "Meus Dados" (my data)
4. ✅ Can see qualification data

**Expected Result:**
- ✅ All views render without errors
- ✅ No blank pages
- ✅ Data loads correctly for each view
- ✅ Navigation works smoothly

---

### Test 10: Create and Update Project

**Objective:** Verify CRUD operations work

**Steps:**
1. Login as consultant
2. Click "Criar Cliente"
3. Fill in client name, email, password
4. Create a new client and project
5. Login as new client
6. Verify new project is visible

**Expected Result:**
- ✅ New user created in Supabase Auth
- ✅ New project created in database
- ✅ Client is linked to project
- ✅ New client can login and see their project
- ✅ Activity log shows project creation

---

## Manual Seeding (if automatic fails)

If the app doesn't automatically initialize the database:

### In Browser Console

```javascript
// Import the service
const { default: dataMigrationService } = await import('./services/dataMigration.ts');

// Check status
const status = await dataMigrationService.getStatus();
console.log('Database seeded?', status.isSeeded);
console.log('Users:', status.userCount);
console.log('Projects:', status.projectCount);

// Initialize if empty
if (!status.isSeeded) {
  const result = await dataMigrationService.initializeDatabase();
  console.log(result);
}
```

### Resetting Database (Dev Only)

```javascript
// ⚠️ WARNING: This deletes ALL data
const { default: dataMigrationService } = await import('./services/dataMigration.ts');

await dataMigrationService.clearDatabase();
const result = await dataMigrationService.initializeDatabase();
console.log(result);

// Reload app
window.location.reload();
```

---

## Testing Checklist

### Initial Setup
- [ ] App loads without errors
- [ ] Console shows initialization messages (or notes DB is already seeded)
- [ ] No "404" or missing resource errors

### Authentication
- [ ] Admin login works
- [ ] Consultant login works
- [ ] Client login works (2 different clients)
- [ ] Auxiliary login works
- [ ] Invalid credentials show error
- [ ] Wrong password shows error

### Data Loading
- [ ] Admin sees all projects
- [ ] Consultant sees their projects
- [ ] Client sees only their projects
- [ ] All users are visible to admin/consultant
- [ ] Client can see qualification data
- [ ] Project with sample Phase 1 data loads

### Navigation
- [ ] All sidebar menu items work
- [ ] Project detail page loads
- [ ] Phase pages load
- [ ] Modal dialogs open/close correctly
- [ ] Back buttons work

### Data Persistence
- [ ] Page refresh keeps user logged in
- [ ] Page refresh preserves selected project
- [ ] Data loads correctly after reload
- [ ] No data loss

### RLS & Security
- [ ] Client can only see their projects
- [ ] Client can only edit their own data
- [ ] Consultant can manage all projects
- [ ] Admin has full access
- [ ] No SQL errors in console

### CRUD Operations
- [ ] Create new client works
- [ ] Create new project works
- [ ] Update project phase works
- [ ] Create task works
- [ ] Send message works

---

## Troubleshooting

### "Database is empty" but should be seeded
**Solution:**
```javascript
const { default: d } = await import('./services/dataMigration.ts');
const result = await d.initializeDatabase();
console.log(result);
```

### Login fails even with correct credentials
**Check:**
1. User was actually created - check Supabase Auth
2. Email matches exactly (case-insensitive)
3. Password is correct
4. Check browser console for specific error

### Can't see projects as consultant
**Check:**
1. Are you logged in with correct role?
2. Check browser network tab for API calls
3. Are RLS policies blocking queries?
4. Check Supabase logs for errors

### Page shows loading forever
**Check:**
1. Open browser DevTools
2. Check network tab for failed requests
3. Check console for errors
4. Try refreshing page
5. Check Supabase status

### Role-based access not working
**Check:**
1. User has correct role in database
2. RLS policies are enabled
3. Policies have correct role checks
4. No console errors about permissions

---

## Success Criteria

All of the following must pass:

✅ Database initializes automatically on first load
✅ All 5 test users can login
✅ Users only see data they have access to (RLS works)
✅ Projects persist across page reloads
✅ Can navigate to all main views
✅ No "undefined" or broken features
✅ Console shows no errors
✅ App is ready for manual feature testing

---

## Next Steps

Once Step 7 passes:

1. **Step 8**: Create comprehensive final documentation
2. **Manual Testing**: Test all features end-to-end
3. **Performance**: Monitor API calls and database queries
4. **Real-time**: Consider adding subscriptions for live updates
5. **Production**: Configure Supabase for production environment

---

**Status**: Ready for testing. After tests pass, proceed to Step 8 (Final Documentation).
