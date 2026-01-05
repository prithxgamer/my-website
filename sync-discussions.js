/**
 * Discussions Sync Helper
 * 
 * To sync discussions across all browsers:
 * 1. Run this command in your browser console on the contact page:
 *    exportDiscussionsToFile()
 * 2. Copy the output to discussions-data.json
 * 3. Commit the changes to GitHub
 * 4. All browsers will see the updated discussions
 */

function exportDiscussionsToFile() {
  const stored = localStorage.getItem('prithvi_discussions');
  const discussions = stored ? JSON.parse(stored) : [];
  
  const dataToExport = {
    discussions: discussions,
    lastUpdated: new Date().toISOString()
  };
  
  const jsonString = JSON.stringify(dataToExport, null, 2);
  console.log('Copy this JSON and paste it into discussions-data.json:');
  console.log(jsonString);
  
  // Also copy to clipboard if possible
  try {
    navigator.clipboard.writeText(jsonString);
    console.log('✓ JSON copied to clipboard!');
  } catch (err) {
    console.log('Could not auto-copy to clipboard. Please copy manually from above.');
  }
  
  return jsonString;
}

function importDiscussionsFromFile() {
  fetch('discussions-data.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('prithvi_discussions', JSON.stringify(data.discussions || []));
      console.log('✓ Discussions imported from file!');
      location.reload();
    })
    .catch(error => {
      console.error('Could not import from file:', error);
    });
}

// Make functions globally available
window.exportDiscussionsToFile = exportDiscussionsToFile;
window.importDiscussionsFromFile = importDiscussionsFromFile;
