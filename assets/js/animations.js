'use strict';

// Função para aplicar animações em elementos quando eles entram no viewport
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se é um dispositivo móvel
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  // Garantir que a splash screen seja completamente removida após a animação
  ensureSplashScreenRemoval();
  
  // Adicionar efeito de paralaxe para fundo (apenas em desktop)
  if (!isMobile) {
    initParallaxEffect();
  }
  
  // Adicionar efeito de cursor personalizado (apenas em desktop)
  if (!isMobile) {
    initCustomCursor();
  }
});

// Função para garantir que a splash screen seja removida completamente
function ensureSplashScreenRemoval() {
  const splashScreen = document.querySelector('.splash-screen');
  if (!splashScreen) return;
  
  // Após o tempo da animação (2s) + delay (2.5s) + margem de segurança (0.5s) = 5s
  setTimeout(() => {
    if (splashScreen && splashScreen.parentNode) {
      splashScreen.parentNode.removeChild(splashScreen);
    }
  }, 5000);
  
  // Garante que o overflow do body é normal
  setTimeout(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, 2600); // Logo após o início do fade-out
}

// Efeito de paralaxe para o fundo
function initParallaxEffect() {
  document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
    
    document.querySelectorAll('.wave-bg').forEach(element => {
      element.style.backgroundPositionX = `calc(50% + ${moveX}px)`;
      element.style.backgroundPositionY = `calc(50% + ${moveY}px)`;
    });
  });
}

// Efeito de cursor personalizado
function initCustomCursor() {
  // Verificar se já existe um cursor personalizado para evitar duplicação
  if (document.querySelector('.custom-cursor')) return;
  
  // Criar o elemento de cursor personalizado
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  // Criar o elemento de cursor secundário (efeito de rastro)
  const cursorTrail = document.createElement('div');
  cursorTrail.classList.add('cursor-trail');
  document.body.appendChild(cursorTrail);
  
  // Atualizar posição do cursor
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Atualizar o cursor de rastro com um pequeno atraso
    setTimeout(() => {
      cursorTrail.style.left = `${e.clientX}px`;
      cursorTrail.style.top = `${e.clientY}px`;
    }, 50);
  });
  
  // Adicionar efeito hover em links e botões
  const linkElements = document.querySelectorAll('a, button, .navbar-link');
  linkElements.forEach(link => {
    link.addEventListener('mouseenter', () => {
      cursor.classList.add('link-hover');
    });
    link.addEventListener('mouseleave', () => {
      cursor.classList.remove('link-hover');
    });
  });
  
  // Esconder o cursor nativo apenas se não for dispositivo móvel
  document.body.style.cursor = 'none';
  
  // Restaurar cursor nativo quando sair da janela
  document.addEventListener('mouseleave', () => {
    document.body.style.cursor = 'auto';
    cursor.style.display = 'none';
    cursorTrail.style.display = 'none';
  });
  
  document.addEventListener('mouseenter', () => {
    document.body.style.cursor = 'none';
    cursor.style.display = 'block';
    cursorTrail.style.display = 'block';
  });
} 