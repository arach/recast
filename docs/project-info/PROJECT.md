# ReFlow: Programmatic Logo Generator

## What We've Built

ReFlow is a web-based programmatic logo generator that transforms mathematical wave functions into unique, dynamic visual identities. Built with Next.js and TypeScript, the application provides an interactive design studio where users can generate logos through code rather than traditional design tools. The core concept is "Identity as Code" - instead of static image files, brands are defined by mathematical parameters and algorithms that can generate consistent yet adaptable visual representations.

## Key Features

The application offers multiple visualization modes including Wave Lines (flowing sine waves), Audio Bars (vertical bars resembling audio waveforms), and Wave Bars (bars that follow a wave envelope). Users control their designs through intuitive sliders for parameters like frequency, amplitude, complexity, chaos, and damping. Each design is deterministically generated from a seed value, functioning as a digital signature that ensures the same seed always produces the same logo. The built-in code editor allows users to view the source code of any visualization, clone and customize existing modes, or write entirely new visualization algorithms using the exposed Canvas API and wave generation utilities.

## Technical Implementation

At its heart, ReFlow uses a custom WaveGenerator class that creates mathematical wave patterns with support for harmonics, noise, and multi-layer composition. The visualization engine renders these waves in real-time to an HTML5 canvas, with options to export designs as PNG or SVG files. The code editor integration, powered by CodeMirror, bridges the gap between visual design and programming, allowing users to see and modify the actual JavaScript code generating their logos. This approach makes ReFlow both a practical tool for creating unique brand identities and an educational platform for understanding generative design principles.