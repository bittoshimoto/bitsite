const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;
const fontSize = 22;
const columns = Math.floor(w / fontSize);
const drops = Array(columns).fill(1);
const matrixChar = '777';

let lastTime = 0;
const fpsLimit = 30; 

function matrix(currentTime) {
  requestAnimationFrame(matrix);
  
  if (currentTime - lastTime < 1000 / fpsLimit) return;
  lastTime = currentTime;
  
  ctx.fillStyle = 'rgba(4,4,4,0.22)';
  ctx.fillRect(0, 0, w, h);
  ctx.font = fontSize + 'px Ubuntu, monospace';
  ctx.fillStyle = '#FFA500';
  
  for (let i = 0; i < drops.length; i++) {
    let faded = Math.random() > 0.96 ? '#eaa75a' : '#FFA500';
    ctx.fillStyle = faded;
    ctx.fillText(matrixChar, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > h && Math.random() > 0.95) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

requestAnimationFrame(matrix);

window.addEventListener('resize', () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
});

let fetchSuccessful = false;
async function fetchPrice() {
   fetchSuccessful = false;

  try {
    
    const response = await fetch('https://b1texplorer.com/ext/getcurrentprice', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors' 
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    const priceElement = document.getElementById('currentPrice');
    if (priceElement && data && data.last_price_usd) {
      priceElement.textContent = '$' + parseFloat(data.last_price_usd).toFixed(2);
      fetchSuccessful = true;
    }
  } catch (error) {
    console.error('Direkte Preisabfrage fehlgeschlagen:', error);
  }

  if (!fetchSuccessful) {
    try {

      const corsProxyUrl = 'https://corsproxy.io/?';
      const targetUrl = encodeURIComponent('https://b1texplorer.com/ext/getcurrentprice');
      
      const proxyResponse = await fetch(corsProxyUrl + targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!proxyResponse.ok) {
        throw new Error('Proxy response was not ok');
      }
      
      const proxyData = await proxyResponse.json();
      
      const priceElement = document.getElementById('currentPrice');
      if (priceElement && proxyData && proxyData.last_price_usd) {
        priceElement.textContent = '$' + parseFloat(proxyData.last_price_usd).toFixed(2);
        fetchSuccessful = true;
      }
    } catch (proxyError) {
      console.error('Proxy-Preisabfrage fehlgeschlagen:', proxyError);
    }
  }
}

fetchPrice();

setInterval(fetchPrice, 60000);

const logoContainer = document.getElementById('logoAnimPlaceholder');
const rabbitLogoSrc = 'rabbit-logo.png';
const bitLogoSrc = 'bit-logo.png';
const morphDuration = 2000; 

const headline = document.getElementById('headlineBit');
const originalText = "#FollowThe<span class='white-text'>WhiteRabbit</span>";
const finalText = "<span class='white-text'>#FollowThe</span>";
const bitHighlight = "<span class='bit'>Bit</span>";
let currentTextAnimation = "";
let isDeleting = false;
let charIndex = 0;

const typingDelay = 20; 
const deletingDelay = 30; 
const pauseDelay = 500; 


window.addEventListener('load', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (headline) {
    headline.innerHTML = originalText;
    setTimeout(textAnimation, 300);
  }

  const rabbitLogo = document.getElementById('rabbitLogo');
  if (rabbitLogo.complete) {
    morphLogo();
  } else {
    rabbitLogo.onload = morphLogo;
  }

  const faqQuestions = document.querySelectorAll('.faq-q');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const arrow = question.querySelector('.faq-arrow');

      const isActive = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';

      document.querySelectorAll('.faq-a').forEach(item => {
        if (item !== answer) {
          item.style.maxHeight = '0px';
          item.style.padding = '0 15px';

          const itemArrow = item.previousElementSibling.querySelector('.faq-arrow');
          if (itemArrow) itemArrow.textContent = '▼';
        }
      });

      if (isActive) {
        answer.style.maxHeight = '0px';
        answer.style.padding = '0 15px';
        if (arrow) arrow.textContent = '▼';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        answer.style.padding = '15px';
        if (arrow) arrow.textContent = '▲';
      }
    });
  });
});


function textAnimation() {
  if (headline.style.opacity === "0") return;

  if (!isDeleting && charIndex === 0) {
    charIndex = originalText.length;
    setTimeout(() => {
      isDeleting = true;
      textAnimation();
    }, pauseDelay);
  }
  else if (isDeleting && charIndex > 0) {
    charIndex--;
    const visibleText = originalText.replace(/<[^>]*>/g, "");
    const charsToKeep = visibleText.substring(0, charIndex);
    if (charIndex > 9) { 
      headline.innerHTML = "#FollowThe<span class='white-text'>" + 
                          charsToKeep.substring(10) + "</span>";
    } else {
      headline.innerHTML = charsToKeep;
    }
    setTimeout(textAnimation, deletingDelay);
  }
  else if (isDeleting && charIndex === 0) {
    headline.innerHTML = "";
    isDeleting = false;
    setTimeout(() => {
      writeHeadline();
    }, pauseDelay);
  }
}

function writeHeadline() {
  let newIndex = 0;
  const finalLength = finalText.length;
  const writeInterval = setInterval(() => {
    newIndex++;
    if (newIndex <= finalLength) {
      headline.innerHTML = finalText;
    } else {
      headline.innerHTML = finalText + bitHighlight;
      clearInterval(writeInterval);
    }
  }, typingDelay);
}

function morphLogo() {
  const rabbitLogo = document.getElementById('rabbitLogo');
  if (!rabbitLogo) {
    console.error("Logo nicht gefunden!");
    return;
  }
  
  
  logoContainer.style.position = 'relative';
  logoContainer.style.width = rabbitLogo.offsetWidth + 'px';
  logoContainer.style.height = rabbitLogo.offsetHeight + 'px';
  
  const bitImage = document.createElement('img');
  bitImage.src = bitLogoSrc;
  bitImage.alt = 'Bit Logo';
  bitImage.id = 'bitLogo';
  bitImage.style.position = 'absolute';
  bitImage.style.top = '0';
  bitImage.style.left = '0';
  bitImage.style.width = '100%';
  bitImage.style.height = '100%';
  bitImage.style.borderRadius = '50%';
  bitImage.style.opacity = '0'; 
  bitImage.style.transition = 'opacity 0.5s ease';
  bitImage.style.boxShadow = '0 0 44px rgba(255, 165, 0, 0.5)';
  
  logoContainer.appendChild(bitImage);
  
  rabbitLogo.style.transition = 'transform 1s ease, opacity 0.5s ease';
  
  setTimeout(() => {
    rabbitLogo.style.transform = 'rotateY(90deg)';
    rabbitLogo.style.opacity = '0';
    
    setTimeout(() => {
      rabbitLogo.style.display = 'none';
      
      bitImage.style.transform = 'rotateY(-90deg)';
      bitImage.style.display = 'block';
      bitImage.style.opacity = '0';
      
      setTimeout(() => {
        bitImage.style.transition = 'transform 1s ease, opacity 0.5s ease';
        bitImage.style.transform = 'rotateY(0deg)';
        bitImage.style.opacity = '1';
      }, 50);
    }, 500); 
  }, 300);
}

const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.topnav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
    
    if (window.pageYOffset < 100 && link.getAttribute('href') === '#home') {
      link.classList.add('active');
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-q');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const arrow = question.querySelector('.faq-arrow');
      
      const isActive = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
      
      document.querySelectorAll('.faq-a').forEach(item => {
        if (item !== answer) {
          item.style.maxHeight = '0px';
          item.style.padding = '0 15px';
          
          const itemArrow = item.previousElementSibling.querySelector('.faq-arrow');
          if (itemArrow) itemArrow.textContent = '▼';
        }
      });
      
      if (isActive) {
        answer.style.maxHeight = '0px';
        answer.style.padding = '0 15px';
        if (arrow) arrow.textContent = '▼';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        answer.style.padding = '15px';
        if (arrow) arrow.textContent = '▲';
      }
    });
  });
});
