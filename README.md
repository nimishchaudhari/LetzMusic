# LetzMusic

LetzMusic is an interactive web application designed to make learning music theory intuitive and engaging. The application demonstrates how musical elements gain meaning through their relationships to each other, providing a holistic understanding of music theory concepts.

## Live Demo

Visit [https://nimishchaudhari.github.io/LetzMusic](https://nimishchaudhari.github.io/LetzMusic) to see the application in action.

## Project Overview

LetzMusic helps users understand music theory concepts through interactive visualizations and audio examples. The application is designed for:

- Beginners with no prior music theory knowledge
- Instrument players looking to deepen their theoretical understanding
- Students with basic theory knowledge seeking more advanced concepts

## Features

### Note Explorer
Demonstrates how a single note functions differently in various musical contexts. Helps users understand how notes gain meaning through their relationship to a key center.

### Interval Demonstrator
Shows how intervals create relationships between notes with visual and audio feedback. Users can see and hear the distance between notes and understand concepts like consonance and dissonance.

### Scale Lab
Interactive tool showing how scales are built from specific interval patterns. Users can explore scale construction, step patterns, and scale characteristics.

### Relative Explorer
Demonstrates the relationship between relative major and minor keys. Users can see how these scales share the same notes but create different emotional feelings.

### Circle of Fifths
Interactive visualization of key relationships through the circle of fifths. Allows users to explore key signatures, related keys, and modulation concepts.

### Chord Visualizer
Demonstrates how chords derive meaning from their relationship to a key center. Users can see and hear triads built on scale degrees, understand chord function, and explore chord progressions.

### Mode Transformer
Shows how modes are transformations of the same set of notes from different starting positions. Users can explore the unique sound and character of each mode through visual and audio examples.

## Technical Implementation

Built with:
- React.js for the user interface
- Tone.js for audio synthesis and playback
- SVG/Canvas for interactive visualizations
- React Router for navigation
- Context API for state management
- Vite for fast builds and modern development experience

## Project Structure

```
letz-music/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CircleOfFifths/
│   │   ├── ChordVisualizer/
│   │   ├── IntervalDemonstrator/
│   │   ├── ModeTransformer/
│   │   ├── Navigation/
│   │   ├── NoteExplorer/
│   │   ├── RelativeExplorer/
│   │   ├── ScaleLab/
│   │   └── common/
│   ├── contexts/
│   │   ├── AudioContext.jsx
│   │   ├── PlaybackContext.jsx
│   │   ├── ProgressionContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── UserProgressContext.jsx
│   ├── pages/
│   ├── utils/
│   │   ├── audio-engine.js
│   │   ├── music-theory.js
│   │   ├── visualizations.js
│   │   └── index.js
│   ├── App.jsx
│   └── index.jsx
├── vite.config.js
└── package.json
```

## Development

1. Clone the repository
```bash
git clone https://github.com/nimishchaudhari/LetzMusic.git
cd LetzMusic
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

5. Deploy to GitHub Pages
```bash
npm run deploy
```

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

## License

This project is open source and available under the MIT License.

## Acknowledgments

Special thanks to all music theory educators and resources that have inspired this project. This application aims to make these concepts more accessible and interactive for a wide audience.