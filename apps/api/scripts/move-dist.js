const fs = require('fs');
const path = require('path');

const distSrc = path.join(__dirname, '..', 'dist', 'src');
const dist = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distSrc)) {
  console.log('dist/src does not exist, build output may already be in dist/');
  process.exit(0);
}

function moveRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src);
    entries.forEach(entry => {
      moveRecursive(
        path.join(src, entry),
        path.join(dest, entry)
      );
    });
    
    // Remove empty directory
    try {
      fs.rmdirSync(src);
    } catch (e) {
      // Directory not empty, that's okay
    }
  } else {
    // Move file
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    fs.renameSync(src, dest);
  }
}

// Move all files from dist/src to dist
const entries = fs.readdirSync(distSrc);
entries.forEach(entry => {
  moveRecursive(
    path.join(distSrc, entry),
    path.join(dist, entry)
  );
});

// Remove dist/src if empty
try {
  fs.rmdirSync(distSrc);
} catch (e) {
  // Not empty or doesn't exist, that's okay
}

console.log('✓ Moved build output from dist/src to dist');

