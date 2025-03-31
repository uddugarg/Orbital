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

- **Intuitive Dashboard**:

  - Interactive charts with real-time data visualization
  - Consistent filters matching table view filters
  - Key metric cards for quick insights

- **Advanced Task Management**:

  - Toggle between Table and Kanban views
  - Customizable columns via Settings panel
  - Drag-and-drop column reordering
  - Persistent column visibility settings
  - High-performance virtualized table for large datasets
  - Advanced filtering by status, priority, and keyword search

- **Task Details**:

  - Rich task detail view in slide-out drawer
  - Comment system for collaboration
  - Task status and priority management

- **UX Features**:
  - Global search with keyboard shortcut (⌘+K)
  - Dark/light theme toggle
  - Mobile-responsive design
  - Infinite scrolling for efficient data loading

## 🛠️ Tech Stack

Orbital leverages cutting-edge technologies:

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Visualization**: [Recharts](https://recharts.org/en-US/)
- **Drag & Drop**: [React DnD](https://react-dnd.github.io/react-dnd/)
- **Virtualization**: [react-window](https://github.com/bvaughn/react-window)
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
│   │   ├── settings/     # Settings components (column management)
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

## ⚙️ Performance Optimizations

Orbital includes several performance optimizations:

1. **Virtualized Table**:

   - Uses react-window for efficient rendering of large datasets
   - Only renders visible rows, reducing DOM elements and memory usage
   - Maintains smooth scrolling even with thousands of items

2. **Efficient State Management**:

   - Optimized Redux store with proper memoization
   - Normalized state structure for faster lookups
   - Selective component re-rendering

3. **Lazy Loading**:

   - Incremental data loading through infinite scroll
   - Route-based code splitting
   - Deferred component loading

4. **Resource Optimization**:
   - Optimized asset loading
   - Efficient data transformations
   - Local storage caching for user preferences

## 🔄 Column Management

The column management feature allows users to customize their table view:

1. **Column Visibility**:

   - Show/hide specific columns based on preference
   - Changes persist across sessions via localStorage

2. **Column Ordering**:

   - Drag-and-drop interface for reordering columns
   - Visual feedback during drag operations

3. **Reset Functionality**:

   - One-click reset to default column configuration
   - Accessible through Settings panel

4. **Integration**:
   - Settings accessible from the main navigation
   - Changes apply instantly to the table view

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
  <p>Made with ❤️ by the Orbital Team</p>
</div>
