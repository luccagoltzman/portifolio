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
  
  // Em dispositivos móveis, garantir que o cursor nativo esteja ativo
  if (isMobile) {
    document.body.style.cursor = 'auto';
    // Remover qualquer cursor personalizado que possa existir
    const existingCursor = document.querySelector('.custom-cursor');
    const existingTrail = document.querySelector('.cursor-trail');
    if (existingCursor) existingCursor.remove();
    if (existingTrail) existingTrail.remove();
    
    // Adicionar efeito de toque
    initMobileTouchEffect();
  } else {
    // Versão desktop normal
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

// Efeito de cursor personalizado para desktop
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

// Efeito de toque para dispositivos móveis com desaparecimento suave
function initMobileTouchEffect() {
  // Verificar se já existe um cursor personalizado para evitar duplicação
  if (document.querySelector('.mobile-touch-effect')) return;
  
  // Criar o elemento de cursor personalizado para dispositivos móveis
  const touchEffect = document.createElement('div');
  touchEffect.classList.add('mobile-touch-effect');
  document.body.appendChild(touchEffect);
  
  // Adicionar evento de toque na tela
  document.addEventListener('touchstart', (e) => {
    // Verificar se o toque foi em um elemento interativo onde não queremos o efeito
    const target = e.target;
    const skipElements = ['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'];
    
    // Verifique se o elemento alvo é um dos elementos que queremos ignorar
    if (skipElements.includes(target.tagName) || 
        target.classList.contains('navbar-link') || 
        target.closest('.service-item') || 
        target.closest('.project-item') ||
        target.closest('.social-link')) {
      // Não mostrar o efeito em elementos clicáveis/interativos
      return;
    }
    
    const touch = e.touches[0];
    
    // Posicionar o efeito no local do toque
    touchEffect.style.left = `${touch.clientX}px`;
    touchEffect.style.top = `${touch.clientY}px`;
    
    // Remover animação anterior e reset
    touchEffect.style.animation = 'none';
    touchEffect.offsetHeight; // Força reflow
    
    // Aplicar nova animação
    touchEffect.style.opacity = '1';
    touchEffect.style.animation = 'touchRipple 0.8s ease-out forwards';
  });
  
  // Eventos opcionais para movimento do toque (arrastar)
  document.addEventListener('touchmove', (e) => {
    // Não fazemos nada durante o movimento para evitar problemas de desempenho
  });
  
  // Garantir que a animação é limpa ao final
  document.addEventListener('touchend', () => {
    // A animação já cuida do desaparecimento
  });
} 