export function showToast(message: string) {
  // TODO: Implementar con shadcn/ui toast component
  // Por ahora usaremos console.log para simular
  console.log(`Toast: ${message}`);
  
  // Crear elemento temporal para mostrar toast
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
