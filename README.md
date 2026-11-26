# Nartstudio Academy

Self-paced creative learning for aspiring artists, illustrators, storytellers, designers and independent creators. The Academy is part of the Nartstudio ecosystem and remains useful to Pylothouse creators without being limited to comics.

## Pages

- `/` - Academy overview, guides, featured courses and plans
- `/courses` and `/courses/[slug]` - searchable course library and lessons
- `/plans` - free and proposed Premium plans
- `/sign-up`, `/sign-in` and `/account` - email-confirmed password accounts and saved progress
- `/mentorship` - private, authenticated mentorship requests
- `/guides` and `/guides/[slug]` - practical creator guides
- `/tracks` and `/tracks/[slug]` - self-paced learning paths
- `/worksheet` - chapter planner with local save and text export

## Connect to the Nartstudio Supabase project

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the existing Nartstudio Supabase project. The browser anon/publishable key is expected to be public; **never put a service-role key in this app or any `NEXT_PUBLIC_` variable**.
2. In the Supabase SQL Editor, run `../supabase/migrations/20261126183400_academy_learning_platform.sql` from the workspace root.
3. Then run `../supabase/seeds/academy-courses.sql`. It adds 20 original, structured courses (10 complete free mini-courses and 10 premium full courses), further-reading links, local procedural artwork seeds, and plan details. The seed can be run again safely.
4. In Supabase Auth settings, enable email confirmations for the Email provider. In URL Configuration, allow the Academy's local and deployed URLs, including `/sign-in?confirmed=1` as the email confirmation redirect destination.
5. Install and start the Academy:

```bash
npm install
npm run dev
```

Free course descriptions and sample lessons are public. Premium course metadata is visible to everyone, but only preview lessons are public until an active membership is recorded. Supabase Row Level Security protects course lessons, memberships, progress and private forms. Users can read and write only their own progress and requests; membership changes are reserved for trusted server-side billing/admin operations.

## Free and Premium

The suggested launch model is **Free** (10 complete mini-courses and public guides) plus **Premium** (all 10 deeper project-based courses, with suggested pricing of **US$9/month** or **US$79/year**). Those amounts are planning recommendations, not researched market guarantees. The current UI collects optional Premium early-access interest only: checkout and recurring billing are deliberately **not live**, and no payment is taken.

Stripe's subscription guidance notes that subscription changes arrive asynchronously and recommends a server-side webhook that verifies incoming events. When billing is approved, use hosted Checkout and a verified webhook (or equivalent provider flow) to update `academy_memberships`; never let browser code grant its own Premium access. See the [Stripe Checkout guide](https://docs.stripe.com/checkout/quickstart) and [subscription webhook guide](https://docs.stripe.com/billing/subscriptions/webhooks). A payment provider account, keys, webhook deployment and confirmation of pricing are still required before launch.

Mentorship requests require a free account and are stored privately for manual review. Submission does not promise mentor availability, book a session or start a paid service.

## Content sources and usage

Course exercises and explanations are original. Each course links to selected further reading from educational and primary sources (including W3C WAI, Adobe, Khan Academy/Pixar, Google Search Central, Blender, Creative Commons and the US Copyright Office). Links are references, not reproduced course material; copyright and licensing lessons are educational and are not legal advice. Course cover illustrations are generated as local SVG graphics, so no remote image service is required.

The chapter planner keeps its draft in this browser and does not upload it. Account progress and submitted requests use Supabase. If local browser storage is unavailable, the planner remains usable for the current visit and reports the limitation.
