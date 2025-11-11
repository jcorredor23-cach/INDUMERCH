# **App Name**: SteelFlow

## Core Features:

- Material Stock Tracking: Monitor stock levels of raw materials like steel scrap, manganese, and molding sand.
- Production Order Management: Create, track, and manage production orders (coladas) from creation to completion, including priority, client, and target week.
- Real-Time Status Updates: Update production order status in real time (Pending, In Process, Critical, Terminated).
- Material Consumption Tracking: Track raw material consumption for each production order and validate that there's enough inventory available for consumption, using the system as a tool.
- Exception logging: Log operational exceptions during colada creation or while in progress. Correlate those incidents with existing coladas. Provides reports regarding exceptions. Uses the description to extract the impacted party.
- Kanban Board View: Visualize production orders in a Kanban board format for easy drag-and-drop management across different stages.
- Time Tracking: Track estimated vs. actual start and end times for each production order to analyze time management and efficiency.
- Data Persistence: Store and retrieve real-time data, authentication credentials, and user profile information

## Style Guidelines:

- Primary color: Indigo (#4F46E5) to reflect the industrial process with a modern touch.
- Background color: Light gray (#F0F4F8) for a clean and modern interface.
- Accent color: Amber (#FFC107) to highlight critical actions and alerts.
- Body and headline font: 'Inter', a sans-serif font, for a clean and modern UI.
- Code font: 'Source Code Pro' for displaying code snippets.
- Feather icons for a consistent and clean user interface.
- A responsive grid layout to support various screen sizes, using Tailwind CSS.