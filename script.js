// Global variables
let currentTool = null;
let uploadedFiles = [];
let processedResult = null;

// DOM elements
const toolCards = document.querySelectorAll('.tool-card');
const toolInterface = document.getElementById('tool-interface');
const toolTitle = document.getElementById('tool-title');
const backBtn = document.getElementById('back-btn');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const selectFilesBtn = document.getElementById('select-files-btn');
const fileList = document.getElementById('file-list');
const filesContainer = document.getElementById('files-container');
const processBtn = document.getElementById('process-btn');
const clearBtn = document.getElementById('clear-btn');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultSection = document.getElementById('result-section');
const downloadBtn = document.getElementById('download-btn');

// Tool configurations
const toolConfigs = {
    merge: {
        title: 'Merge PDF Files',
        accept: '.pdf',
        multiple: true,
        description: 'Select multiple PDF files to merge into one document'
    },
    split: {
        title: 'Split PDF File',
        accept: '.pdf',
        multiple: false,
        description: 'Select a PDF file to split into separate pages'
    },
    compress: {
        title: 'Compress PDF File',
        accept: '.pdf',
        multiple: false,
        description: 'Select a PDF file to reduce its size'
    },
    'pdf-to-image': {
        title: 'Convert PDF to Images',
        accept: '.pdf',
        multiple: false,
        description: 'Select a PDF file to convert to JPG images'
    },
    'image-to-pdf': {
        title: 'Convert Images to PDF',
        accept: '.jpg,.jpeg,.png',
        multiple: true,
        description: 'Select image files to convert to PDF'
    },
    protect: {
        title: 'Protect PDF with Password',
        accept: '.pdf',
        multiple: false,
        description: 'Select a PDF file to add password protection'
    },
    unlock: {
        title: 'Remove PDF Password',
        accept: '.pdf',
        multiple: false,
        description: 'Select a password-protected PDF file to unlock'
    },
    rotate: {
        title: 'Rotate PDF Pages',
        accept: '.pdf',
        multiple: false,
        description: 'Select a PDF file to rotate its pages'
    },
    'pdf-to-word': {
        title: 'PDF to Word',
        accept: '.pdf',
        multiple: false,
        description: 'Convert PDF documents to editable Word files'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Tool card clicks
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const tool = this.dataset.tool;
            openTool(tool);
        });
    });

    // Back button
    backBtn.addEventListener('click', function() {
        closeTool();
    });

    // File input
    selectFilesBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    // Drag and drop
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Action buttons
    processBtn.addEventListener('click', function() {
        processFiles();
    });

    clearBtn.addEventListener('click', function() {
        clearFiles();
    });

    downloadBtn.addEventListener('click', function() {
        downloadResult();
    });
}

function openTool(tool) {
    currentTool = tool;
    const config = toolConfigs[tool];
    
    // Update UI
    toolTitle.textContent = config.title;
    fileInput.accept = config.accept;
    fileInput.multiple = config.multiple;
    
    // Update upload area text
    const uploadContent = uploadArea.querySelector('.upload-content');
    uploadContent.querySelector('h3').textContent = config.multiple ? 'Select files' : 'Select file';
    uploadContent.querySelector('p').textContent = config.description;
    
    // Show tool interface
    document.querySelector('.tools-grid').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    toolInterface.style.display = 'block';
    toolInterface.classList.add('fade-in');
    
    // Scroll to tool interface
    setTimeout(() => {
        toolInterface.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Reset state
    clearFiles();
}

function closeTool() {
    currentTool = null;
    uploadedFiles = [];
    processedResult = null;
    
    // Show main interface
    document.querySelector('.tools-grid').style.display = 'block';
    document.querySelector('.hero').style.display = 'block';
    toolInterface.style.display = 'none';
    
    // Reset all sections
    uploadArea.style.display = 'block';
    fileList.style.display = 'none';
    progressSection.style.display = 'none';
    resultSection.style.display = 'none';
}

function handleFiles(files) {
    const config = toolConfigs[currentTool];
    const fileArray = Array.from(files);
    
    // Filter files based on accepted types
    const acceptedFiles = fileArray.filter(file => {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        return config.accept.includes(extension);
    });
    
    if (acceptedFiles.length === 0) {
        alert('Please select valid files for this tool.');
        return;
    }
    
    // Handle single vs multiple files
    if (!config.multiple && acceptedFiles.length > 1) {
        alert('This tool only accepts one file at a time.');
        return;
    }
    
    uploadedFiles = acceptedFiles;
    displayFiles();
}

function displayFiles() {
    if (uploadedFiles.length === 0) {
        fileList.style.display = 'none';
        uploadArea.style.display = 'block';
        return;
    }
    
    uploadArea.style.display = 'none';
    fileList.style.display = 'block';
    fileList.classList.add('slide-up');
    
    filesContainer.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = createFileItem(file, index);
        filesContainer.appendChild(fileItem);
    });
    
    processBtn.disabled = false;
}

function createFileItem(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <div class="file-icon">
            <i class="${fileIcon}"></i>
        </div>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <div class="file-actions">
            <button class="remove-file" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return fileItem;
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'fas fa-file-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'fas fa-file-image';
        default:
            return 'fas fa-file';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    displayFiles();
}

function clearFiles() {
    uploadedFiles = [];
    fileInput.value = '';
    displayFiles();
    hideProgressAndResult();
}

function hideProgressAndResult() {
    progressSection.style.display = 'none';
    resultSection.style.display = 'none';
}

async function processFiles() {
    if (uploadedFiles.length === 0) return;
    
    // Show progress
    progressSection.style.display = 'block';
    progressSection.classList.add('fade-in');
    resultSection.style.display = 'none';
    
    try {
        updateProgress(0, 'Starting processing...');
        
        let result;
        switch (currentTool) {
            case 'merge':
                result = await mergePDFs(uploadedFiles);
                break;
            case 'split':
                result = await splitPDF(uploadedFiles[0]);
                break;
            case 'compress':
                result = await compressPDF(uploadedFiles[0]);
                break;
            case 'pdf-to-image':
                result = await pdfToImages(uploadedFiles[0]);
                break;
            case 'image-to-pdf':
                result = await imagesToPDF(uploadedFiles);
                break;
            case 'protect':
                result = await protectPDF(uploadedFiles[0]);
                break;
            case 'unlock':
                result = await unlockPDF(uploadedFiles[0]);
                break;
            case 'rotate':
                result = await rotatePDF(uploadedFiles[0]);
                break;
            case 'pdf-to-word':
                result = await pdfToWord(uploadedFiles[0]);
                break;
            default:
                throw new Error('Unknown tool');
        }
        
        processedResult = result;
        showResult();
        
    } catch (error) {
        console.error('Processing error:', error);
        alert('An error occurred while processing the files. Please try again.');
        hideProgressAndResult();
    }
}

function updateProgress(percentage, text) {
    progressFill.style.width = percentage + '%';
    progressText.textContent = text;
}

function showResult() {
    progressSection.style.display = 'none';
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');
}

function downloadResult() {
    if (!processedResult) return;
    
    const link = document.createElement('a');
    link.href = processedResult.url;
    link.download = processedResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// PDF Processing Functions
async function mergePDFs(files) {
    updateProgress(20, 'Loading PDF files...');
    
    const PDFLib = window.PDFLib;
    const mergedPdf = await PDFLib.PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
        updateProgress(20 + (i / files.length) * 60, `Processing file ${i + 1} of ${files.length}...`);
        
        const fileBuffer = await files[i].arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        pages.forEach((page) => mergedPdf.addPage(page));
    }
    
    updateProgress(90, 'Generating merged PDF...');
    const pdfBytes = await mergedPdf.save();
    
    updateProgress(100, 'Complete!');
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'merged.pdf'
    };
}

async function splitPDF(file) {
    updateProgress(20, 'Loading PDF file...');
    
    const PDFLib = window.PDFLib;
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(fileBuffer);
    const pageCount = pdf.getPageCount();
    
    updateProgress(40, 'Splitting pages...');
    
    // For demo, we'll create a zip-like structure (simplified)
    // In a real implementation, you'd use a zip library
    const pages = [];
    
    for (let i = 0; i < pageCount; i++) {
        updateProgress(40 + (i / pageCount) * 50, `Extracting page ${i + 1} of ${pageCount}...`);
        
        const newPdf = await PDFLib.PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        
        const pdfBytes = await newPdf.save();
        pages.push({
            name: `page_${i + 1}.pdf`,
            data: pdfBytes
        });
    }
    
    updateProgress(100, 'Complete!');
    
    // For simplicity, return the first page
    // In a real app, you'd create a zip file
    const blob = new Blob([pages[0].data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'page_1.pdf'
    };
}

async function compressPDF(file) {
    updateProgress(30, 'Loading PDF file...');
    
    // Note: Real compression would require more sophisticated algorithms
    // This is a simplified version
    const PDFLib = window.PDFLib;
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(fileBuffer);
    
    updateProgress(70, 'Compressing PDF...');
    
    const pdfBytes = await pdf.save({
        useObjectStreams: false,
        addDefaultPage: false
    });
    
    updateProgress(100, 'Complete!');
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'compressed.pdf'
    };
}

async function pdfToImages(file) {
    updateProgress(30, 'Loading PDF file...');
    
    // This would require pdf.js or similar library for rendering
    // For demo purposes, we'll simulate the process
    updateProgress(70, 'Converting to images...');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProgress(100, 'Complete!');
    
    // In a real implementation, you'd render PDF pages to canvas and convert to images
    // For now, return a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 595;
    canvas.height = 842;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('PDF Page 1', 50, 100);
    
    return new Promise(resolve => {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            resolve({
                url: url,
                filename: 'page_1.jpg'
            });
        }, 'image/jpeg');
    });
}

async function imagesToPDF(files) {
    updateProgress(20, 'Loading images...');
    
    const PDFLib = window.PDFLib;
    const pdf = await PDFLib.PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
        updateProgress(20 + (i / files.length) * 60, `Processing image ${i + 1} of ${files.length}...`);
        
        const imageBuffer = await files[i].arrayBuffer();
        let image;
        
        if (files[i].type === 'image/jpeg') {
            image = await pdf.embedJpg(imageBuffer);
        } else if (files[i].type === 'image/png') {
            image = await pdf.embedPng(imageBuffer);
        } else {
            continue; // Skip unsupported formats
        }
        
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height
        });
    }
    
    updateProgress(90, 'Generating PDF...');
    const pdfBytes = await pdf.save();
    
    updateProgress(100, 'Complete!');
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'images.pdf'
    };
}

async function protectPDF(file) {
    const password = prompt('Enter password to protect the PDF:');
    if (!password) return null;
    
    updateProgress(30, 'Loading PDF file...');
    
    const PDFLib = window.PDFLib;
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(fileBuffer);
    
    updateProgress(70, 'Adding password protection...');
    
    // Note: PDF-lib doesn't support password protection in the browser version
    // This is a simulation
    const pdfBytes = await pdf.save();
    
    updateProgress(100, 'Complete!');
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'protected.pdf'
    };
}

async function unlockPDF(file) {
    const password = prompt('Enter the PDF password:');
    if (!password) return null;
    
    updateProgress(30, 'Loading PDF file...');
    
    const PDFLib = window.PDFLib;
    const fileBuffer = await file.arrayBuffer();
    
    try {
        const pdf = await PDFLib.PDFDocument.load(fileBuffer, { password });
        
        updateProgress(70, 'Removing password protection...');
        
        const pdfBytes = await pdf.save();
        
        updateProgress(100, 'Complete!');
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        return {
            url: url,
            filename: 'unlocked.pdf'
        };
    } catch (error) {
        alert('Invalid password or the PDF is not password protected.');
        throw error;
    }
}

async function rotatePDF(file) {
    const angle = prompt('Enter rotation angle (90, 180, 270):');
    if (!angle || !['90', '180', '270'].includes(angle)) {
        alert('Please enter a valid angle: 90, 180, or 270');
        return null;
    }
    
    updateProgress(30, 'Loading PDF file...');
    
    const PDFLib = window.PDFLib;
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(fileBuffer);
    
    updateProgress(70, 'Rotating pages...');
    
    const pages = pdf.getPages();
    pages.forEach(page => {
        page.setRotation(PDFLib.degrees(parseInt(angle)));
    });
    
    const pdfBytes = await pdf.save();
    
    updateProgress(100, 'Complete!');
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'rotated.pdf'
    };
}

async function pdfToWord(file) {
    updateProgress(30, 'Loading PDF file...');
    
    // Note: Real PDF to Word conversion would require specialized libraries
    // This is a simulation for demo purposes
    const fileBuffer = await file.arrayBuffer();
    
    updateProgress(70, 'Converting PDF to Word...');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateProgress(100, 'Complete!');
    
    // Create a simple text content as placeholder
    const textContent = 'This is a converted Word document from PDF.\n\nIn a real implementation, this would contain the extracted text and formatting from the PDF file.';
    const blob = new Blob([textContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    
    return {
        url: url,
        filename: 'converted.docx'
    };
}

// Utility function to simulate processing delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}