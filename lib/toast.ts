// Simple toast implementation
export function showToast(message: string) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'fixed top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
