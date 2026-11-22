# Product Specifications

## Purpose

Anywhere Fitness encourages healthy living by combining a fitness community with simple workout tracking. It was built for the Code Overflow 2023 hackathon, which asked how technology could encourage and promote healthy living, and placed third.

## Users

- People who want to share their fitness journey with others.
- People who want to plan gym workouts and personal fitness goals.

## Core Features

- **Accounts**: Users register with a name, username, email, and password, then sign in with their username. Sessions are stored in D1 and kept in an HTTP-only cookie. See [`src/lib/database/auth.ts`](src/lib/database/auth.ts).
- **Community Feed**: The home page lists posts with a message and an optional cover image. Authors can delete their own posts.
- **Advertisements**: Users publish listings with a title and description. Authors can delete their own listings.
- **Tracking**: The track page shows a Mapbox map and lets users pick an activity from [`src/data/activities.json`](src/data/activities.json).
- **Gym Workouts**: Users build a workout list from exercises in [`src/data/workouts.json`](src/data/workouts.json), grouped by muscle group with linked videos. The list is saved to their profile.
- **Goals**: Users add and remove personal goals, saved to their profile.
- **Settings**: Users change their name and avatar, and sign out.
- **Uploads**: Avatars and post covers are stored in R2 and served from `/api/files/` with a sandboxed content security policy.

## Scope

- Post and advertisement responses never expose author email addresses.
- Music and heart rate monitor actions on the track page are not implemented.
- Achievements, notifications, and profile statistics show static placeholder content.
- Activity tracking does not record routes, distance, or time.
