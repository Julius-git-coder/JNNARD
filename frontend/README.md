# JNARD Code Guide

This guide helps you find the code for each screen in the application. We have organized the folders to match the website's pages.

## 📂 Folder Structure

### 1. **Design System (The Building Blocks)**
`frontend/components/ui/`
> Contains all the small reusable pieces like Buttons, Inputs, Cards, and Icons. If you want to change how a button looks *everywhere*, look here.

### 2. **Pages & Screens**
The code for each page is located inside `frontend/app/`.

#### 🏠 **Dashboard (Home)**
- **Folder**: `frontend/app/(dashboard)/`
- **Main Page**: `page.tsx` (This is the layout you see)
- **Components**: `_components/` (Charts, Team Section specific to dashboard)

#### 📂 **Projects Page**
- **Folder**: `frontend/app/(dashboard)/projects/`
- **Main Page**: `page.tsx` (The list of projects)
- **Components**: `_components/` (Project Cards)

#### ✅ **Tasks Pages**
- **Folder**: `frontend/app/(dashboard)/tasks/`
- **Create Task**: `new/page.tsx` (The form to create a task)

#### 🔐 **Login Page**
- **Folder**: `frontend/app/(auth)/login/`
- **Main Page**: `page.tsx`

## 🛠 How to Make Changes

 **To change the text on the Login screen:**
   Go to `frontend/app/(auth)/login/page.tsx`.

 **To change the columns in the Project List:**
   Go to `frontend/app/(dashboard)/projects/_components/project-card.tsx`.

 **To change the colors:**
   Go to `frontend/app/globals.css`.

   
kill -9 $(lsof -ti :3000)
yhh
