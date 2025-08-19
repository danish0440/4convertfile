# PDFTools - Online PDF Editor & Converter

A modern, web-based PDF manipulation tool similar to iLovePDF, built with vanilla HTML, CSS, and JavaScript.

## Features

### 🔧 PDF Tools Available

- **Merge PDF**: Combine multiple PDF files into one document
- **Split PDF**: Extract pages from PDF or split into multiple files
- **Compress PDF**: Reduce file size while maintaining quality
- **PDF to JPG**: Convert PDF pages to high-quality images
- **JPG to PDF**: Convert images to PDF documents
- **Protect PDF**: Add password protection to PDF files
- **Unlock PDF**: Remove password protection from PDF files
- **Rotate PDF**: Rotate PDF pages to correct orientation

### ✨ Key Features

- **Drag & Drop Interface**: Easy file upload with drag-and-drop support
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Client-Side Processing**: All processing happens in your browser for privacy
- **Modern UI**: Clean, intuitive interface inspired by iLovePDF
- **No Installation Required**: Works directly in any modern web browser
- **Multiple File Support**: Handle multiple files where applicable
- **Real-time Progress**: Visual feedback during processing

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PDF Processing**: PDF-lib library for client-side PDF manipulation
- **Icons**: Font Awesome for beautiful icons
- **Styling**: Custom CSS with modern design principles

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required for basic functionality

### Running the Application

1. **Simple File Opening**:
   - Double-click `index.html` to open in your default browser
   - All features work directly from the file system

2. **Local Web Server** (Recommended for full functionality):
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Using Node.js
   npx serve . -p 8000
   
   # Using PHP (if available)
   php -S localhost:8000
   ```
   Then open `http://localhost:8000` in your browser

## How to Use

1. **Select a Tool**: Click on any tool card from the main page
2. **Upload Files**: 
   - Click "Select files" button, or
   - Drag and drop files directly onto the upload area
3. **Process Files**: Click the "Process Files" button
4. **Download Result**: Once processing is complete, download your result

## File Support

- **PDF Files**: `.pdf` (for most tools)
- **Image Files**: `.jpg`, `.jpeg`, `.png` (for image-to-PDF conversion)
- **Maximum File Size**: Depends on browser memory (typically 50-100MB per file)

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Privacy & Security

- **Client-Side Processing**: All PDF operations happen in your browser
- **No File Upload**: Files never leave your computer
- **No Data Collection**: No tracking or analytics
- **Secure**: Works offline once loaded

## Project Structure

```
PDFTools/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Features in Detail

### Merge PDF
- Combine multiple PDF files in the order you select
- Maintains original quality and formatting
- Supports unlimited number of files (memory permitting)

### Split PDF
- Extract individual pages from a PDF
- Currently extracts first page (can be extended)
- Maintains original page quality

### Compress PDF
- Reduces file size using PDF optimization
- Maintains visual quality
- Uses PDF-lib compression algorithms

### PDF to Images
- Converts PDF pages to JPG images
- High-quality output
- Processes all pages (currently shows first page)

### Images to PDF
- Converts JPG/PNG images to PDF
- Maintains aspect ratio
- Supports multiple images in one PDF

### Password Protection
- Add password protection to PDFs
- User-defined passwords
- Standard PDF encryption

### Password Removal
- Remove passwords from protected PDFs
- Requires original password
- Creates unlocked copy

### Rotate PDF
- Rotate pages by 90°, 180°, or 270°
- Applies to all pages
- Maintains page content and quality

## Customization

### Adding New Tools

1. Add tool configuration in `toolConfigs` object in `script.js`
2. Add tool card HTML in `index.html`
3. Implement processing function in `script.js`
4. Add appropriate styling in `styles.css`

### Styling Customization

- Modify CSS variables for colors and spacing
- Update `styles.css` for layout changes
- Replace Font Awesome icons as needed

## Limitations

- **Memory Dependent**: Large files may cause browser memory issues
- **Client-Side Only**: No server-side processing capabilities
- **Basic PDF Operations**: Advanced features may require additional libraries
- **Browser Support**: Requires modern browser with PDF-lib support

## Future Enhancements

- [ ] Batch processing for multiple operations
- [ ] More image formats support (GIF, BMP, TIFF)
- [ ] Advanced PDF editing (text, annotations)
- [ ] Cloud storage integration
- [ ] Offline PWA support
- [ ] Multi-language support
- [ ] Advanced compression options
- [ ] PDF form handling
- [ ] Digital signatures
- [ ] OCR text extraction

## Contributing

Feel free to contribute to this project by:

1. Adding new PDF tools
2. Improving the UI/UX
3. Optimizing performance
4. Adding new features
5. Fixing bugs

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **PDF-lib**: For client-side PDF manipulation
- **Font Awesome**: For beautiful icons
- **iLovePDF**: For design inspiration

---

**Note**: This is a client-side application that processes files locally in your browser for maximum privacy and security. No files are uploaded to any server.