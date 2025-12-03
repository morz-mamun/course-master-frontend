# Installation Instructions

## Install Axios

You need to install axios in the **frontend directory**. Please run:

```bash
cd course-master-frontend
pnpm add axios
```

Or if you prefer npm:

```bash
cd course-master-frontend
npm install axios
```

## Why This is Needed

The axios package was installed in the parent `course-master` directory, but it needs to be installed in the `course-master-frontend` directory where the frontend code is located.

## After Installation

Once axios is installed, the TypeScript error "Cannot find module 'axios'" should disappear. You may need to:

1. Restart your TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
2. Or simply close and reopen VS Code

## Fixed Issues

✅ **Navbar Error**: Fixed by adding `isStudent` to the `useAuth()` destructuring on line 16
❌ **Axios Error**: Needs manual installation in the frontend directory (see above)
