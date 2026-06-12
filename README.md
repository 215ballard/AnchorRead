# AnchorRead Focus Reading App

AnchorRead is a modern focus reading web application designed to help with readability, formatting, and text interaction (specifically tailored to assist with reading focus, dyslexia, and comprehension).

## Features

- **Visual Aids**: Interactive highlights, customizable font sizing, high-contrast layouts, and focusing lines.
- **Vite-powered Dev Server**: Fast loading and smooth local development.
- **AnchorRead Control Panel**: A user-friendly tool to manage the application server and view logs without needing to use terminal commands directly.

---

## Getting Started

To run AnchorRead on your computer, follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation & Run

1. **Clone the Repository**:
   Clone this project to your desired directory:
   ```bash
   git clone <your-repository-url>
   ```

2. **Install Dependencies**:
   Open a terminal in the project directory and run:
   ```bash
   npm install
   ```

3. **Start the Control Panel**:
   - Double-click `AnchorRead Control Panel.bat` at the root of the project.
   - Choose **[1] Start Server (Background)** to spin up the local server.
   - Choose **[5] Open App in Web Browser** to view it (or navigate to `http://localhost:5173`).
   - You can also choose **[7] Create Desktop Shortcut** to place a convenient shortcut directly on your desktop!

---

## File Structure

- `AnchorRead Control Panel.bat`: Main portable control script.
- `start-server.ps1`: Background server startup script (runs portably on any Windows machine).
- `src/`: React source code of the web application.
- `public/`: Static assets.
