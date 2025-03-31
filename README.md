# Orbital 🚀

<div align="center">
  <img src="/public/orbital-icon.svg" alt="Orbital Logo" width="120" height="120" />
  <h3>A powerful, modern task management application</h3>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-black?style=flat-square" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Redux-latest-764ABC?style=flat-square&logo=redux" alt="Redux" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#additional-info">Additional Info</a>
</p>

## ✨ Features

Orbital is a sophisticated task management platform built with the modern web stack, offering:

- **Intuitive Dashboard**: Visualize your workflow with interactive charts and key metrics
- **Dual-View Task Management**: Switch seamlessly between Table and Kanban views
- **Infinite Scroll**: Smooth scrolling experience with optimized data loading
- **Advanced Filtering & Sorting**: Find what you need, when you need it
- **Drag & Drop Interface**: Easy task organization with intuitive controls
- **Dark/Light Mode**: Work comfortably in any environment
- **Responsive Design**: Perfect experience on any device
- **Real-time Updates**: Task statuses update instantly across the application
- **Global Search**: Find any task quickly with ⌘+K shortcuts
- **Task Comments**: Collaborate effectively with integrated comments
- **Customizable UI**: Drag and rearrange columns to your preference

## 🛠️ Tech Stack

Orbital leverages cutting-edge technologies:

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Visualization**: [Recharts](https://recharts.org/en-US/)
- **Drag & Drop**: [React DnD](https://react-dnd.github.io/react-dnd/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/orbital.git
cd orbital
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=your_api_url_here
```

## 📂 Project Structure

```
orbital/
├── public/               # Static assets and images
├── src/
│   ├── app/              # Next.js app router
│   │   ├── (root)/       # Root routes (dashboard, tasks)
│   ├── components/       # Reusable components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── global/       # Global components (navbar, sidebar)
│   │   ├── tasks/        # Task-specific components
│   │   └── ui/           # UI components (shadcn/ui)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and constants
│   ├── provider/         # Context providers
│   ├── store/            # Redux store configuration
│   │   ├── features/     # Redux slices
│   └── types/            # TypeScript type definitions
├── .eslintrc.js          # ESLint configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 📷 Screenshots

<div align="center">
  <img src="/public/app-screenshot.png" alt="Orbital Dashboard" width="90%" />
</div>

## ⚙️ Development

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running Tests

```bash
npm run test
# or
yarn test
```

## 🔗 Additional Info

### Browser Support

Orbital supports all modern browsers including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### API Integration

The application is designed to work with RESTful APIs. For development purposes, mock data is used to simulate backend functionality.

### Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the Udit Garg</p>
</div>
