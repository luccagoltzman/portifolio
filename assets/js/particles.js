'use strict';

// Classe de Partícula
class Particle {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Opções padrão
    this.x = options.x || Math.random() * canvas.width;
    this.y = options.y || Math.random() * canvas.height;
    this.size = options.size || Math.random() * 3 + 1;
    this.speedX = options.speedX || (Math.random() - 0.5) * 0.5;
    this.speedY = options.speedY || (Math.random() - 0.5) * 0.5;
    this.color = options.color || this.getRandomColor();
    this.opacity = options.opacity || Math.random() * 0.5 + 0.2;
    this.linkDistance = options.linkDistance || 150;
    this.linkWidth = options.linkWidth || 0.5;
  }
  
  // Método para obter uma cor aleatória em tons dourados e amarelos
  getRandomColor() {
    const colors = [
      'rgba(255, 215, 0, 0.6)',  // Dourado (mais opaco)
      'rgba(234, 171, 0, 0.6)',  // Amarelo escuro (mais opaco)
      'rgba(255, 235, 153, 0.6)', // Amarelo claro (mais opaco)
      'rgba(255, 195, 0, 0.6)'    // Âmbar (mais opaco)
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Atualiza a posição da partícula
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Verifica os limites do canvas
    if (this.x > this.canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    
    if (this.y > this.canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }
  
  // Desenha a partícula
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
  
  // Conecta com outras partículas próximas
  connect(particles) {
    for (let i = 0; i < particles.length; i++) {
      const dx = this.x - particles[i].x;
      const dy = this.y - particles[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.linkDistance) {
        // Quanto mais perto, mais opaca a linha
        const opacity = 1 - (distance / this.linkDistance);
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(234, 171, 0, ${opacity * 0.3})`;
        this.ctx.lineWidth = this.linkWidth * 1.5;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(particles[i].x, particles[i].y);
        this.ctx.stroke();
      }
    }
  }
}

// Classe principal para gerenciar o efeito de partículas
class ParticleEffect {
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'particleCanvas';
    this.particleCount = options.particleCount || 100;
    this.linkParticles = options.linkParticles !== undefined ? options.linkParticles : true;
    this.responsive = options.responsive !== undefined ? options.responsive : true;
    this.mouseInteraction = options.mouseInteraction !== undefined ? options.mouseInteraction : true;
    this.mobileOptimize = options.mobileOptimize !== undefined ? options.mobileOptimize : true;
    this.preventScrollIssues = options.preventScrollIssues !== undefined ? options.preventScrollIssues : true;
    
    // Verifica se é dispositivo móvel
    this.isMobile = window.innerWidth < 768;
    
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.mouse = {
      x: null,
      y: null,
      radius: this.isMobile ? 50 : 100 // Raio menor para dispositivos móveis
    };
    
    this.init();
  }
  
  // Inicializa o efeito
  init() {
    // Cria o canvas e adiciona ao DOM
    this.createCanvas();
    
    // Ajusta para dispositivos móveis
    if (this.isMobile && this.mobileOptimize) {
      this.particleCount = Math.min(this.particleCount, 40);
      this.linkParticles = false;
    }
    
    // Inicializa as partículas
    this.createParticles();
    
    // Inicia a animação
    this.animate();
    
    // Adiciona listeners para eventos
    this.addEventListeners();
  }
  
  // Cria o elemento canvas e o adiciona ao body
  createCanvas() {
    // Verifica se o canvas já existe
    let canvas = document.getElementById(this.canvasId);
    
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = this.canvasId;
      document.body.prepend(canvas);
    }
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Configurações de estilo
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none'; // Garante que eventos de mouse passem pelo canvas
    
    // Para dispositivos com problemas de rolagem
    if (this.preventScrollIssues) {
      this.canvas.style.touchAction = 'none'; // Evita problemas com rolagem em touch
      
      // Se estiver em dispositivo móvel, mantém boa opacidade para visibilidade
      if (this.isMobile) {
        this.canvas.style.opacity = '0.8'; // Aumentado de 0.5 para 0.8
      }
      
      // Adiciona uma classe ao body para facilitar soluções de CSS
      document.body.classList.add('has-particle-canvas');
    }
    
    // Define tamanho do canvas
    this.resizeCanvas();
  }
  
  // Redimensiona o canvas para o tamanho da janela
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Recria as partículas quando o canvas é redimensionado
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }
  
  // Cria as partículas
  createParticles() {
    this.particles = [];
    
    // Determina o número de partículas com base no tamanho da tela
    let count = this.particleCount;
    
    if (this.responsive) {
      const area = this.canvas.width * this.canvas.height;
      const baseArea = 1920 * 1080;
      count = Math.floor(this.particleCount * (area / baseArea));
      
      // Limita mais em dispositivos móveis para melhor desempenho
      const minCount = this.isMobile ? 20 : 40;
      const maxCount = this.isMobile ? 50 : 150;
      count = Math.max(minCount, Math.min(count, maxCount));
    }
    
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas, {
        // Partículas maiores em geral
        size: this.isMobile ? Math.random() * 3 + 1.5 : Math.random() * 4 + 1.5,
        // Movimento um pouco mais lento para melhor conectividade
        speedX: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.4),
        speedY: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.4),
        // Aumenta a distância de ligação para conectar mais partículas
        linkDistance: this.isMobile ? 120 : 180,
        // Aumenta a opacidade para melhor visualização
        opacity: Math.random() * 0.6 + 0.3
      }));
    }
  }
  
  // Adiciona eventos de interação
  addEventListeners() {
    // Evento de redimensionamento da janela
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
    
    // Evento de movimento do mouse
    if (this.mouseInteraction) {
      window.addEventListener('mousemove', (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });
      
      // Reseta a posição do mouse quando sai da janela
      window.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }
  }
  
  // Loop de animação
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Limpa o canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Atualiza e desenha cada partícula
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      // Atualiza a posição
      particle.update();
      
      // Desenha a partícula
      particle.draw();
      
      // Conecta com outras partículas se a opção estiver ativada
      if (this.linkParticles && (!this.isMobile || !this.mobileOptimize)) {
        particle.connect(this.particles.slice(i));
      }
      
      // Interação com o mouse
      if (this.mouseInteraction && this.mouse.x !== null && this.mouse.y !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          // Afasta a partícula do mouse
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          
          const directionX = forceDirectionX * force * 2;
          const directionY = forceDirectionY * force * 2;
          
          particle.x += directionX;
          particle.y += directionY;
        }
      }
    }
  }
  
  // Pausa a animação
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  // Retoma a animação
  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }
  
  // Remove o canvas e cancela a animação
  destroy() {
    this.pause();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Inicializa o efeito quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Inicia o efeito de partículas
  window.particleEffect = new ParticleEffect({
    particleCount: 100,
    linkParticles: true,
    responsive: true,
    mouseInteraction: true,
    mobileOptimize: true,
    preventScrollIssues: true
  });
  
  // Remover o efeito de partículas se causar problemas de desempenho
  let lastScrollY = window.scrollY;
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    // Detectar problemas de rolagem - se o scroll não funcionar corretamente
    if (scrollTimeout) clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const scrollAttempted = Math.abs(lastScrollY - currentScrollY) < 10;
      
      // Se tentar rolar mas não conseguir, pode ser problema com as partículas
      if (scrollAttempted && window.innerWidth < 768) {
        if (window.particleEffect) {
          window.particleEffect.destroy();
          window.particleEffect = null;
        }
      }
      
      lastScrollY = currentScrollY;
    }, 100);
  });
}); 