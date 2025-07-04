# Example URLs for ReFlow

Here are some example URLs you can use to quickly load specific templates and configurations:

## Letter Mark Examples

### Simple Letter A
```
http://localhost:3002/?template=letter-mark
```

### Letter B with Blue Theme
```
http://localhost:3002/?template=letter-mark&letter=B&fillColor=%230000ff
```

### Company Initial with Custom Colors
```
http://localhost:3002/?template=letter-mark&letter=M&fillColor=%23ff6b6b&backgroundColor=%23f8f9fa
```

## Wordmark Examples

### Basic Brand Name
```
http://localhost:3002/?template=wordmark&text=ACME
```

### Tech Company Style
```
http://localhost:3002/?template=wordmark&text=TechCorp&fillColor=%2300ff00&strokeColor=%23000000
```

### Startup with Ocean Colors
```
http://localhost:3002/?template=wordmark&text=WaveAI&fillColor=%230369a1&strokeColor=%230e7490&backgroundColor=%23f0f9ff
```

## Minimal Shape Examples

### Simple Circle
```
http://localhost:3002/?template=minimal-shape
```

### Microsoft-style Grid
```
http://localhost:3002/?template=minimal-shape&fillColor=%23f25022&strokeColor=%2300bcf2
```

## Prism Google Examples

### Classic Prism
```
http://localhost:3002/?template=prism-google
```

### Prism with Custom Colors
```
http://localhost:3002/?template=prism-google&fillColor=%234285f4&strokeColor=%23ea4335
```

## URL Parameters Reference

- `template` - The template ID (e.g., letter-mark, wordmark, minimal-shape, prism-google)
- `text` - Text content for wordmarks
- `letter` - Letter(s) for letter marks
- `fillColor` - Main fill color (hex format, URL encoded)
- `strokeColor` - Stroke/accent color (hex format, URL encoded)
- `backgroundColor` - Background color (hex format, URL encoded)

### Color Format
Colors need to be URL encoded:
- `#` becomes `%23`
- Example: `#0070f3` becomes `%230070f3`

### Tips
1. The URL updates automatically as you change parameters
2. Use the "Share" button to copy the current URL
3. Bookmark your favorite configurations
4. Share URLs with team members for quick access