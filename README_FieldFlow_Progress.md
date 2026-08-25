# FieldFlow

FieldFlow is a field service management system developed as the final project for the CCA Full-Stack Developer eight-week internship.

## Project Status

This README records the work completed so far and the current development approach.

## Work Completed So Far

### 1. Project Foundation
- Created the Next.js application using TypeScript.
- Set up the project structure and development environment.
- Added Tailwind CSS and the required project dependencies.
- Created and connected the PostgreSQL database hosted on Neon.
- Configured Prisma ORM and database migrations.

### 2. Authentication and Role-Based Access
- Implemented authentication using Better Auth.
- Added email/password sign-in and sign-out.
- Added the three required project roles:
  - Admin
  - Dispatcher
  - Technician
- Added protected pages and server-side role checks.
- Added role-aware navigation.
- Verified that users are restricted from unauthorized areas.

### 3. Users
- Added user management functionality for the Admin role.
- Created and tested users for the required roles.
- Connected technician profiles with user accounts.

### 4. Customers
- Implemented customer management.
- Added customer create, view, edit and search functionality.
- Added form validation and duplicate-email handling.
- Added customer detail pages and related work-order area.

### 5. Technicians
- Implemented technician management.
- Added technician create, view, edit and search/filter functionality.
- Added technician skills and availability/status.
- Connected technician records to user accounts.
- Added the foundation for displaying assigned work orders.

### 6. Work Orders
- Implemented the main work-order management flow.
- Added work-order creation and detail pages.
- Added customer and technician selection.
- Added technician assignment.
- Added priority and status.
- Added work-order filtering.
- Added server-side authorization for protected work-order actions.
- Tested the work-order flow and fixed issues encountered during development.

## GitHub / Version Control

The project is currently maintained in **one GitHub repository**, as specified in the project brief.

So far, development has been done by committing and pushing changes directly to the repository's main branch. Feature branches and pull requests have not been used yet.

The project brief describes a team workflow using:

1. Choose a task
2. Create a branch
3. Build and test
4. Open a pull request
5. Review and merge

The existing commits have not been rewritten. Going forward, feature branches and pull requests can be introduced where appropriate so that the development workflow more closely follows the project brief.

## Current Development Approach

The project is being developed incrementally. Each major feature is implemented, tested and verified before moving to the next feature.

Current major areas completed:
- Authentication
- Role-based access
- Users
- Customers
- Technicians
- Work Orders

## Next Work

The remaining work will continue according to the project brief, including:
- Completing the technician workflow and My Jobs experience
- Dashboard improvements and business-rule verification
- Validation, responsive UI and quality improvements
- Playwright testing
- Deployment
- Final README/documentation updates
- Final report and presentation preparation

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Neon
- Prisma
- Better Auth
- Zod
- Vitest
- Playwright
- Vercel

## Project Brief

The project requirements and submission expectations are based on the CCA Full-Stack Developer Internship Project Brief.
