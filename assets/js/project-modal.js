/**
 * Project Modal Control
 */

document.addEventListener('DOMContentLoaded', function() {
  const modalContainer = document.querySelector('[data-project-modal-container]');
  const overlay = document.querySelector('[data-project-overlay]');
  const projectModals = document.querySelectorAll('[data-project-modal]');
  const projectDetailBtns = document.querySelectorAll('.project-detail-btn');
  const modalCloseBtns = document.querySelectorAll('[data-project-modal-close]');
  projectModals.forEach(modal => {
    modal.style.display = 'none';
  });

  // Função para abrir o modal
  const openProjectModal = function(projectId) {
    const targetModal = document.querySelector(`[data-project-modal="${projectId}"]`);
    
    if (!targetModal) return;
    
    modalContainer.classList.add('active');
    overlay.classList.add('active');
    
    
    projectModals.forEach(modal => {
      modal.style.display = 'none';
    });
    
    // Mostrar o modal específico
    targetModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  // Função para fechar qualquer modal aberto
  const closeProjectModal = function() {
    modalContainer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  // Botões de detalhes
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = this.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeProjectModal);
  });

  overlay.addEventListener('click', closeProjectModal);

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
      closeProjectModal();
    }
  });
}); 