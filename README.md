# WZRDROBE - AI Virtual Try-On Studio

![WZRDROBE Logo Placeholder](public/placeholder-logo.png) <!-- Replace with actual logo if available -->

WZRDROBE is a web application showcasing the power of AI for virtual clothing try-on. Users can upload a photo of themselves and an image of a garment to generate a realistic visualization of how the item would look on them. It leverages Fal.ai's platform, specifically the **Kling Kolors Virtual Try-On** model for image generation and the **Luma Ray 2 Flash** model for adding subtle motion to the generated image.

The application features a modern, interactive UI built with Next.js, TypeScript, and Tailwind CSS, including a Matrix-style intro animation and a mouse-reactive background effect.

<!-- Add a GIF/Screenshot here showing the main UI and result -->
<!-- ![WZRDROBE Demo GIF](link/to/your/demo.gif) -->

## ✨ Features

*   **AI Virtual Try-On:** Upload a person's photo and a garment photo to generate a try-on image using Kling Kolors.
*   **Image-to-Video Animation:** Add subtle, realistic motion to the generated try-on image using Luma Ray 2 Flash.
*   **User-Friendly Interface:** Simple drag-and-drop UI for image uploads.
*   **Image Compression:** Client-side image compression before upload for faster processing.
*   **Interactive Design:**
    *   Matrix-style loading animation on first visit (session-based).
    *   Subtle mouse-following gradient background effect.
    *   3D card hover effect on the main input panel.
*   **Responsive:** Designed to work on various screen sizes.
*   **Notifications:** User feedback via toasts for uploads and generation status.

## 🚀 Tech Stack

*   **Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with Shadcn/ui components
*   **AI Platform:** [Fal.ai](https://fal.ai/)
    *   Virtual Try-On: Kling Kolors (`fal-ai/kling/v1-5/kolors-virtual-try-on`)
    *   Image-to-Video: Luma Ray 2 Flash (`fal-ai/luma-dream-machine/ray-2-flash/image-to-video`)
*   **Package Manager:** pnpm
*   **UI Components:** Shadcn/ui
*   **File Handling:** react-dropzone, Fal.ai Client Storage

## ⚙️ Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   pnpm (Install via `npm install -g pnpm`)
*   Fal.ai API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root of the project and add your Fal.ai API key:
    ```.env.local
    FAL_KEY="YOUR_FAL_API_KEY"
    ```
    *Replace `YOUR_FAL_API_KEY` with your actual key.*

### Running the Development Server

1.  Start the development server:
    ```bash
    pnpm dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

1.  Build the application:
    ```bash
    pnpm build
    ```
2.  Start the production server:
    ```bash
    pnpm start
    ```

## 📂 Project Structure


.
├── app/ # Next.js App Router
│ ├── api/ # API Routes
│ │ ├── generate/ # Kling Kolors Try-On API endpoint
│ │ │ └── route.ts
│ │ └── generate-video/ # Luma Ray 2 Video API endpoint
│ │ └── route.ts
│ ├── layout.tsx # Root Layout (includes background, intro)
│ ├── page.tsx # Main Page Component
│ └── globals.css # Global Styles
├── components/ # React Components
│ ├── ui/ # Shadcn/ui Components
│ ├── KlingKolorsGenerator.tsx # Main Try-On UI Logic
│ ├── MatrixIntro.tsx # Intro Animation
│ ├── InteractiveBackground.tsx # Mouse-following Background
│ ├── ImageDisplay.tsx # Component to display generated images
│ ├── Logo.tsx # App Logo
│ └── ... # Other UI components
├── hooks/ # Custom React Hooks
│ └── use3DCard.ts # Hook for card hover effect
│ └── use-toast.ts # Toast hook implementation
├── lib/ # Utility functions / Libraries config
│ └── utils.ts # General utility functions (e.g., cn)
├── public/ # Static Assets (images, gifs)
├── styles/ # Additional Styles (if needed beyond globals)
├── types/ # TypeScript Definitions
│ └── kling-kolors.ts # Types for Kling Kolors API
├── utils/ # Standalone Utility Scripts
│ └── imageCompression.ts # Client-side image compression logic
├── next.config.mjs # Next.js Configuration
├── package.json # Project Dependencies & Scripts
├── pnpm-lock.yaml # Dependency Lockfile
├── tailwind.config.ts # Tailwind CSS Configuration
└── tsconfig.json # TypeScript Configuration

## 🔌 API Endpoints

1.  **`/api/generate` (POST)**
    *   **Purpose:** Handles Kling Kolors virtual try-on generation.
    *   **Input:** `FormData` containing:
        *   `referenceImage`: File (Image of the person)
        *   `garmentImage`: File (Image of the garment)
    *   **Output:** JSON object containing the generated `image` data from Fal.ai (`{ image: { url, width, height, ... } }`).
    *   **Authentication:** Requires `FAL_KEY` set on the server.

2.  **`/api/generate-video` (POST)**
    *   **Purpose:** Handles Luma Ray 2 Flash image-to-video generation.
    *   **Input:** JSON body containing:
        *   `imageUrl`: string (URL of the image generated by Kling Kolors)
        *   `prompt`: string (Prompt to guide the animation, e.g., "subtle natural movement")
        *   `aspect_ratio` (Optional): string (e.g., "9:16")
        *   `resolution` (Optional): string (e.g., "720p")
        *   `duration` (Optional): string (e.g., "5s")
    *   **Output:** JSON object containing the `videoUrl` (`{ videoUrl: "..." }`).
    *   **Authentication:** Requires `FAL_KEY` set on the server.

## 🔑 Environment Variables

*   `FAL_KEY`: **Required**. Your secret API key from Fal.ai. Store this in `.env.local`.

## 🤝 Contributing

Contributions are welcome! Please follow standard Git workflow: fork the repository, create a feature branch, commit your changes, and open a Pull Request. Ensure code is formatted and linted.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details. (Note: Add a LICENSE file if one doesn't exist).
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
WZRDROBE - Business Model & Pitch

Project Name: WZRDROBE

Tagline: Dress the Future. Virtually.

1. The Problem:

High E-commerce Return Rates: The inability to accurately visualize how clothes fit and look leads to high return rates (often 20-40%) in online fashion retail, costing businesses billions in logistics and lost revenue.

Shopper Uncertainty: Consumers lack confidence when buying clothes online, leading to hesitation, cart abandonment, and dissatisfaction upon receiving items that don't meet expectations.

Static Shopping Experience: Traditional online shopping lacks engagement and the experiential element of in-store try-ons.

2. Our Solution: WZRDROBE

WZRDROBE is an AI-powered virtual try-on platform that allows users to realistically visualize clothing items on their own photos before purchasing. By integrating cutting-edge AI models (Kling Kolors for static try-on, Luma Ray 2 for optional animation), we provide:

Realistic Visualization: High-fidelity generation showing how a specific garment drapes and fits on an individual's body shape from their photo.

Engaging Experience: An optional "Add Motion" feature animates the try-on, bringing the visualization to life and increasing user engagement.

Seamless Integration: Designed to be potentially integrated into existing e-commerce platforms or used as a standalone tool.

3. Technology:

Core AI: Leverages Fal.ai's scalable infrastructure, utilizing Kling Kolors for state-of-the-art image-based virtual try-on and Luma Ray 2 Flash for high-quality image-to-video animation.

Platform: Modern web application built with Next.js, React, TypeScript, ensuring performance and maintainability.

4. Value Proposition:

For Online Retailers:

Reduce Return Rates: Increase shopper confidence, leading to fewer returns due to poor fit or appearance.

Increase Conversion Rates: Overcome purchase hesitation by providing a clear visualization.

Enhance Customer Engagement: Offer an innovative, interactive, and memorable shopping experience.

Strengthen Brand Image: Position the brand as tech-forward and customer-centric.

Potential Data Insights: Gather anonymized data on popular try-ons and potential sizing mismatches.

For Consumers:

Buy with Confidence: See how clothes actually look before buying.

Reduce Hassle: Minimize the need for returns and exchanges.

Personalized Experience: Visualize items on your body, not just a standard model.

Fun & Engaging: A novel way to explore fashion online.

5. Target Market:

Primary: Online fashion retailers (Apparel, Accessories) - from SMBs using platforms like Shopify to large enterprises with custom e-commerce sites.

Secondary: E-commerce platform providers (potential integration partners), fashion marketplaces, personal stylists, bespoke tailors.

6. Business Model (Potential Avenues):

B2B SaaS Subscription: Tiered monthly/annual plans for retailers based on:

Number of API calls (try-ons generated per month).

Number of SKUs enabled for virtual try-on.

Inclusion of premium features (video animation, analytics dashboard).

API Licensing: Offer the WZRDROBE try-on functionality as a documented API for businesses to integrate deeply into their own systems. Priced per API call or tiered access.

White-Label Solution: Provide a customizable, branded version of the WZRDROBE platform for large retailers.

Usage-Based Pricing: Pay-per-try-on model, suitable for smaller businesses or specific campaigns.

7. Competitive Advantage:

Cutting-Edge AI: Utilizes high-quality, specialized AI models (Kling Kolors known for realism).

Motion Feature: The optional Luma-powered animation adds a unique, engaging differentiator.

User Experience: Focus on a simple, intuitive interface for both consumers and retailer integration.

Scalability: Built on Fal.ai, allowing for easy scaling to handle demand.

8. Go-to-Market Strategy:

Direct Outreach: Target e-commerce managers and innovation leads at fashion retailers.

Platform Partnerships: Develop integrations/apps for major e-commerce platforms (Shopify, BigCommerce, Magento).

Content Marketing: Showcase compelling before/after visuals and case studies demonstrating ROI (return reduction, conversion lift).

Pilot Programs: Offer limited-time trials or pilot programs to initial retail partners to gather data and testimonials.

Industry Events: Participate in e-commerce and fashion tech conferences.

9. Team (Placeholder):

[Your Name/Team Name] brings expertise in Full Stack Development, AI Integration, UI/UX Design, and Business Operations, perfectly positioned to build and scale WZRDROBE.

10. Ask / Call to Action:

Seeking: [e.g., Seed funding of $XXX,XXX to finalize product development, scale infrastructure, and initiate sales/marketing efforts.]

Or Seeking: [e.g., Pilot partners in the online fashion retail space to validate the platform and demonstrate ROI.]

Or Seeking: [e.g., Strategic advisors with experience in e-commerce SaaS and fashion tech.]

WZRDROBE isn't just about trying on clothes; it's about building confidence, reducing waste, and revolutionizing the online fashion experience.

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/grats-projects/v0-pulidgen3-feuhs89yaou)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/FeuhS89YaOU)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/grats-projects/v0-pulidgen3-feuhs89yaou](https://vercel.com/grats-projects/v0-pulidgen3-feuhs89yaou)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/FeuhS89YaOU](https://v0.dev/chat/projects/FeuhS89YaOU)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
