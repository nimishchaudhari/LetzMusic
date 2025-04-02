# LetzMusic

LetzMusic is an interactive music theory learning application designed to demonstrate how musical elements gain meaning through their relationships to each other.

## Project Overview

Rather than teaching isolated music theory facts, LetzMusic focuses on helping users understand the connections between notes, intervals, scales, and chords, making music theory intuitive and practical. The application provides interactive visualizations and audio examples to create a multi-sensory learning experience.

## Key Features

- **Interactive Tools**: Visual and audio-based tools for exploring musical concepts
- **Personalized Learning Paths**: Tailored learning experiences based on user background and goals
- **Multi-sensory Learning**: See and hear musical relationships simultaneously
- **Progress Tracking**: Built-in system to track concept mastery and learning progress

## Interactive Components

1. **Note Explorer**: Demonstrates how a single note functions differently in various musical contexts
2. **Interval Demonstrator**: Shows how intervals create relationships between notes
3. **Scale Laboratory**: Allows users to build and experiment with different scales and modes
4. **Chord Function Visualizer**: Illustrates how chords derive meaning from their relationship to a key center
5. **Relative Major/Minor Explorer**: Demonstrates the relationship between relative major and minor keys
6. **Circle of Fifths Navigator**: Interactive visualization of key relationships
7. **Mode Transformer**: Shows how modes are transformations of the same set of notes

## Technologies Used

- **React**: Frontend library for building the user interface
- **Tone.js**: Audio framework for synthesis and playback
- **LocalStorage**: Client-side persistence for saving user progress
- **SVG/Canvas**: Interactive musical visualizations
- **GitHub Pages**: Hosting platform for the application

## Learning Paths

The application offers three different learning paths based on user experience level:

1. **Complete Beginners**: Build a foundation with basics of notes, intervals, scales, and chords
2. **Instrument Players**: Connect theory to practice with focus on practical applications
3. **Theory Basics**: Deepen understanding with advanced concepts and relationships

## Development Phases

The project is being implemented in five phases:

1. **Foundation and Core Components** (4-6 weeks): Project setup, audio engine, base visualizations
2. **Interactive Tools Development** (6-8 weeks): Implementation of the seven key components
3. **Content Development** (4-6 weeks): Comprehensive explanations and learning paths
4. **User Experience and Polish** (3-4 weeks): Onboarding, dashboard, progress tracking
5. **Testing and Deployment** (2-3 weeks): Cross-browser testing and GitHub Pages setup

## Installation and Setup

To run the project locally:

1. Clone the repository:
   ```
   git clone https://github.com/nimishchaudhari/LetzMusic.git
   ```

2. Navigate to the project directory:
   ```
   cd LetzMusic
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch, using the GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

## License

This project is available under the MIT License.
