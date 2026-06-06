import { PrismaClient, Status, Priority } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL

async function main() {
  if (!SEED_USER_EMAIL) {
    throw new Error('SEED_USER_EMAIL environment variable is required')
  }

  const user = await prisma.user.findUnique({ where: { email: SEED_USER_EMAIL } })

  if (!user) {
    throw new Error(`User not found for email: ${SEED_USER_EMAIL}`)
  }

  console.log(`Seeding data for user: ${user.name ?? user.email}`)

  await prisma.task.deleteMany({ where: { userId: user.id } })
  await prisma.project.deleteMany({ where: { userId: user.id } })

  console.log('Cleared existing projects and tasks.')

  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000)

  const marketingProject = await prisma.project.create({
    data: {
      name: 'Marketing Website Redesign',
      description: 'Full redesign of the company marketing site with new brand identity, improved performance, and mobile-first approach.',
      tags: ['design', 'frontend'],
      userId: user.id,
    },
  })

  const mobileProject = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'Cross-platform mobile application for iOS and Android using React Native, targeting the core user journey.',
      tags: ['mobile', 'react-native'],
      userId: user.id,
    },
  })

  const apiProject = await prisma.project.create({
    data: {
      name: 'API Integration',
      description: 'Third-party API integrations for payment processing, email delivery, and analytics data pipeline.',
      tags: ['backend', 'api'],
      userId: user.id,
    },
  })

  console.log('Created 3 projects.')

  const tasks = [
    // Marketing Website Redesign
    {
      title: 'Define new brand color palette',
      description: 'Work with design team to finalize primary, secondary, and accent colors for the rebrand.',
      status: Status.DONE,
      priority: Priority.HIGH,
      tags: ['design', 'branding'],
      projectId: marketingProject.id,
      dueDate: daysAgo(10),
    },
    {
      title: 'Create wireframes for homepage',
      description: 'Low-fidelity wireframes covering hero section, features, testimonials, and CTA blocks.',
      status: Status.DONE,
      priority: Priority.HIGH,
      tags: ['design', 'ux'],
      projectId: marketingProject.id,
      dueDate: daysAgo(5),
    },
    {
      title: 'Implement responsive navigation',
      description: 'Build mobile-first navigation with hamburger menu, mega-menu for desktop, and accessibility support.',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      tags: ['frontend', 'accessibility'],
      projectId: marketingProject.id,
      dueDate: daysFromNow(3),
    },
    {
      title: 'Optimize images for Core Web Vitals',
      description: 'Convert all images to WebP, add lazy loading, and ensure LCP score stays under 2.5s.',
      status: Status.IN_PROGRESS,
      priority: Priority.MEDIUM,
      tags: ['performance', 'seo'],
      projectId: marketingProject.id,
      dueDate: daysAgo(2),
    },
    {
      title: 'Write copy for About page',
      description: 'Collaborate with marketing to produce compelling brand story and team section content.',
      status: Status.TODO,
      priority: Priority.LOW,
      tags: ['content'],
      projectId: marketingProject.id,
      dueDate: daysFromNow(7),
    },
    {
      title: 'Set up analytics and conversion tracking',
      description: 'Integrate Google Analytics 4 and Meta Pixel, configure goal funnels and heatmaps.',
      status: Status.TODO,
      priority: Priority.MEDIUM,
      tags: ['analytics', 'marketing'],
      projectId: marketingProject.id,
      dueDate: daysFromNow(14),
    },

    // Mobile App MVP
    {
      title: 'Set up React Native project with Expo',
      description: 'Bootstrap the project, configure ESLint, Prettier, and absolute imports.',
      status: Status.DONE,
      priority: Priority.HIGH,
      tags: ['setup', 'react-native'],
      projectId: mobileProject.id,
      dueDate: daysAgo(14),
    },
    {
      title: 'Build authentication screens',
      description: 'Login, sign up, and forgot password screens with form validation and biometric support.',
      status: Status.DONE,
      priority: Priority.HIGH,
      tags: ['auth', 'mobile'],
      projectId: mobileProject.id,
      dueDate: daysAgo(7),
    },
    {
      title: 'Implement push notifications',
      description: 'Integrate Expo Notifications, handle permission flow, and wire up backend webhook.',
      status: Status.IN_PROGRESS,
      priority: Priority.MEDIUM,
      tags: ['mobile', 'notifications'],
      projectId: mobileProject.id,
      dueDate: daysAgo(1),
    },
    {
      title: 'Design onboarding flow',
      description: '3-step onboarding carousel explaining key features with skip and progress indicators.',
      status: Status.TODO,
      priority: Priority.MEDIUM,
      tags: ['ux', 'mobile'],
      projectId: mobileProject.id,
      dueDate: daysFromNow(5),
    },
    {
      title: 'Submit to App Store and Play Store',
      description: 'Prepare screenshots, descriptions, privacy policy, and submit both store listings for review.',
      status: Status.TODO,
      priority: Priority.HIGH,
      tags: ['release', 'mobile'],
      projectId: mobileProject.id,
      dueDate: daysFromNow(21),
    },

    // API Integration
    {
      title: 'Integrate Stripe payment gateway',
      description: 'Implement checkout sessions, webhooks for payment confirmation, and refund handling.',
      status: Status.DONE,
      priority: Priority.HIGH,
      tags: ['payments', 'backend'],
      projectId: apiProject.id,
      dueDate: daysAgo(8),
    },
    {
      title: 'Connect SendGrid email delivery',
      description: 'Set up transactional emails for welcome, password reset, and order confirmation using templates.',
      status: Status.IN_PROGRESS,
      priority: Priority.MEDIUM,
      tags: ['email', 'backend'],
      projectId: apiProject.id,
      dueDate: daysAgo(3),
    },
    {
      title: 'Build data pipeline to analytics warehouse',
      description: 'Stream user events to BigQuery via Pub/Sub for downstream reporting dashboards.',
      status: Status.TODO,
      priority: Priority.LOW,
      tags: ['data', 'backend', 'api'],
      projectId: apiProject.id,
      dueDate: daysFromNow(10),
    },
    {
      title: 'Write API integration tests',
      description: 'Cover happy path and error cases for all third-party endpoints using mocked responses.',
      status: Status.TODO,
      priority: Priority.HIGH,
      tags: ['testing', 'backend'],
      projectId: apiProject.id,
      dueDate: daysAgo(4),
    },
  ]

  await prisma.task.createMany({
    data: tasks.map((t) => ({ ...t, userId: user.id })),
  })

  console.log(`Created ${tasks.length} tasks.`)
  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
