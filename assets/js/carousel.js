document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('clients-carousel');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!carousel) return;
  
  const items = carousel.querySelectorAll('.clients-item');
  const itemCount = items.length;
  
  const gap = 20; // Espaço entre itens (correspondendo com CSS)
  
  // Calcular quantos itens são visíveis ao mesmo tempo
  function getVisibleItemCount() {
    const carouselWidth = carousel.clientWidth;
    const itemWidth = items[0].offsetWidth + gap;
    return Math.floor(carouselWidth / itemWidth);
  }
  
  
  let currentIndex = 0;
  let intervalId = null;
  const autoPlayDelay = 3000;
  
  // Calcular o número real de slides
  function getMaxSlideIndex() {
    const visibleItems = getVisibleItemCount();
    return Math.max(0, itemCount - visibleItems);
  }
  
  // Criar indicadores de pontos
  function createDots() {
    dotsContainer.innerHTML = '';
    const maxSlides = getMaxSlideIndex() + 1;
    for (let i = 0; i < maxSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      
      dotsContainer.appendChild(dot);
    }
  }
  
  // Mostra sempre os pontos ativos
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Ir para um slide específico
  function goToSlide(index) {
    const maxIndex = getMaxSlideIndex();
    
    if (index < 0) {
      index = maxIndex;
    } else if (index > maxIndex) {
      index = 0;
    }
    
    currentIndex = index;
    const itemWidth = items[0].offsetWidth;
    let offset;
    
    if (index >= maxIndex - 1) {
      const safeScrollMax = carousel.scrollWidth - carousel.clientWidth - 20; // -20px de margem de segurança
      
      if (index === maxIndex) {
        offset = safeScrollMax;
      } else if (index === maxIndex - 1) {
        offset = safeScrollMax - ((itemWidth + gap) / 2);
      } else {
        offset = index * (itemWidth + gap);
      }
    } else {
      offset = index * (itemWidth + gap);
    }
    

    offset = Math.max(0, Math.min(offset, carousel.scrollWidth - carousel.clientWidth));
    

    carousel.scrollTo({
      left: offset,
      behavior: 'smooth'
    });
    
    updateDots();
  }
  
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }
  
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }
  
  function startAutoPlay() {
    if (intervalId === null) {
      intervalId = setInterval(nextSlide, autoPlayDelay);
    }
  }
  
  function stopAutoPlay() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }
  
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
  
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
  
  // Parar autoplay quando o usuário interage com o carrossel
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);
  carousel.addEventListener('touchstart', stopAutoPlay);
  carousel.addEventListener('touchend', startAutoPlay);
  
  // Detectar quando o carrossel para de rolar
  carousel.addEventListener('scroll', function() {
    clearTimeout(carousel.scrollEndTimer);
    carousel.scrollEndTimer = setTimeout(function() {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = items[0].offsetWidth;
      // Item mais próximo da posição atual
      const nearestIndex = Math.round(scrollLeft / (itemWidth + gap));
      const maxIndex = getMaxSlideIndex();
      const boundedIndex = Math.min(Math.max(0, nearestIndex), maxIndex);
      
      if (currentIndex !== boundedIndex) {
        currentIndex = boundedIndex;
        updateDots();
      }
    }, 150);
  });
  
  window.addEventListener('resize', function() {
    setTimeout(() => {
      createDots();
      const maxIndex = getMaxSlideIndex();
      if (currentIndex > maxIndex) {
        goToSlide(maxIndex);
      } else {
        goToSlide(currentIndex);
      }
    }, 200);
  });
  
  // Após o carregamento completo das imagens, inicializar o carrossel
  window.addEventListener('load', function() {
    createDots();
    startAutoPlay();
  });
  
  // Inicialização
  createDots();
  startAutoPlay();
}); 