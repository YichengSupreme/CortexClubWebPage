# Cortex Club Website

A modern, artistic website for Cortex Club - Oxford University's Neuroscience Society.

## Features

- 🎨 **Artistic Minimalism** - Dark blue and white design with typewriter aesthetic
- 📱 **Fully Responsive** - Auto-adapts to all screen sizes
- ⚡ **Typewriter Animation** - Dynamic hero text with blinking cursor
- 🎯 **Modular Structure** - Separate subpages for each section
- 📅 **Dynamic Events** - JSON-based event management system

## Adding New Events

To add a new event:

1. Create a new JSON file in the `events/` folder (e.g., `event_1.json`)
2. Add the event data:
   ```json
   {
     "title": "Event Title",
     "date": "2024-12-25",
     "description": "Event description here"
   }
   ```
3. Add the filename to `events/index.json`:
   ```json
   {
     "events": [
       "event_1.json",
       "event_2.json",
       "event_3.json"
     ]
   }
   ```
4. Events will automatically sort into Upcoming/Past based on the current date

## Getting Started

### Local Testing

Run the included server script:

```bash
python3 server.py
```

This will automatically open your browser to `http://localhost:8000`

### Without Server (Limited)

You can open `index.html` directly, but events won't load due to CORS restrictions. The rest of the site will work fine.

### GitHub Pages

Once pushed to GitHub Pages, all features work perfectly including dynamic event loading!

### Pointer
- use https://tinypng.com/ to compress images

## License

MIT License - Feel free to use this template for your own projects!
