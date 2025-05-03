// Matrix 777 Background Animation
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

// Performance-Optimierung für Matrix-Animation
let lastTime = 0;
const fpsLimit = 30; // Begrenze FPS für bessere Performance

function matrix(currentTime) {
  requestAnimationFrame(matrix);
  
  // FPS-Begrenzung
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

// Starte Matrix-Animation
requestAnimationFrame(matrix);

window.addEventListener('resize', () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
});

let fetchSuccessful = false;
// Preisanzeige abrufen
async function fetchPrice() {
  // Wir versuchen mehrere Methoden, um den Preis zu erhalten
   fetchSuccessful = false;

  try {
    // Methode 1: Direkter Zugriff - kann wegen CORS fehlschlagen
    const response = await fetch('https://b1texplorer.com/ext/getcurrentprice', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'  // CORS-Modus bleibt, aber wir haben Fallbacks
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
    // Wir versuchen die nächste Methode
  }

  // Wenn die direkte Abfrage nicht funktioniert, versuchen wir es mit einem CORS-Proxy
  if (!fetchSuccessful) {
    try {
      // Methode 2: Über einen öffentlichen CORS-Proxy
      // Hinweis: Diese öffentlichen Proxies können Ratenbegrenzungen haben oder nicht immer verfügbar sein
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
      // Wir versuchen die letzte Fallback-Methode
    }
  }
}

// Versuche, den Preis zu laden
fetchPrice();

// Preis-Update-Intervall
setInterval(fetchPrice, 60000);

// Verbesserte Logo-Animation: 3D Münzen-Flip
const logoContainer = document.getElementById('logoAnimPlaceholder');
const rabbitLogoSrc = 'rabbit-logo.png';
const bitLogoSrc = 'bit-logo.png';
const morphDuration = 2000; // Längere Dauer für den Flip-Effekt

// Text-Animation direkt in der Hauptüberschrift
const headline = document.getElementById('headlineBit');
const originalText = "#FollowThe<span class='white-text'>WhiteRabbit</span>";
const finalText = "<span class='white-text'>#FollowThe</span>";
const bitHighlight = "<span class='bit'>Bit</span>";
let currentTextAnimation = "";
let isDeleting = false;
let charIndex = 0;

// Schreibgeschwindigkeit in ms (schneller gemacht)
const typingDelay = 20; // von 150 auf 100 reduziert
const deletingDelay = 30; // von 50 auf 30 reduziert
const pauseDelay = 500; // von 800 auf 500 reduziert

// Starte direkt mit der Textanimation
document.addEventListener('DOMContentLoaded', function() {
  if (headline) {
    headline.innerHTML = originalText;
    setTimeout(textAnimation, 300); // von 500 auf 300 reduziert
  }
  
  // Starte Logo-Animation nach kurzer Verzögerung
  setTimeout(() => {
    morphLogo();
  }, 300); // von 500 auf 300 reduziert
});

function textAnimation() {
  // Wir animieren nur den Text, wenn die Headline sichtbar ist
  if (headline.style.opacity === "0") return;

  if (!isDeleting && charIndex === 0) {
    // Zeigt bereits den vollständigen originalen Text
    charIndex = originalText.length;
    setTimeout(() => {
      isDeleting = true;
      textAnimation();
    }, pauseDelay);
  }
  // Lösch-Phase
  else if (isDeleting && charIndex > 0) {
    charIndex--;
    // Wir müssen hier anders vorgehen, da wir HTML-Tags haben
    // Extrahiere nur den sichtbaren Text
    const visibleText = originalText.replace(/<[^>]*>/g, "");
    const charsToKeep = visibleText.substring(0, charIndex);
    if (charIndex > 9) { // "#FollowThe" ist 10 Zeichen
      headline.innerHTML = "#FollowThe<span class='white-text'>" + 
                          charsToKeep.substring(10) + "</span>";
    } else {
      headline.innerHTML = charsToKeep;
    }
    setTimeout(textAnimation, deletingDelay);
  }
  // Pause nach dem Löschen, vor dem Schreiben des neuen Textes
  else if (isDeleting && charIndex === 0) {
    headline.innerHTML = "";
    isDeleting = false;
    setTimeout(() => {
      // Schreibe den finalen Text mit farbigem "Bit"
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
      // Füge das hervorgehobene "Bit" hinzu
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
  
  // VEREINFACHTE UND ZUVERLÄSSIGERE LOGO-ANIMATION
  // Direkte Bildwechsel mit Dreheffekt statt komplexer 3D-Transformation
  
  // Container vorbereiten
  logoContainer.style.position = 'relative';
  logoContainer.style.width = rabbitLogo.offsetWidth + 'px';
  logoContainer.style.height = rabbitLogo.offsetHeight + 'px';
  
  // Bit-Logo erstellen, aber noch nicht anzeigen
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
  bitImage.style.opacity = '0'; // Zunächst unsichtbar
  bitImage.style.transition = 'opacity 0.5s ease';
  bitImage.style.boxShadow = '0 0 44px rgba(255, 165, 0, 0.5)';
  
  // Beide Logos dem Container hinzufügen
  logoContainer.appendChild(bitImage);
  
  // Animation für das Hasen-Logo
  rabbitLogo.style.transition = 'transform 1s ease, opacity 0.5s ease';
  
  // Flip-Animation: Das Hasen-Logo rausdrehen und das Bit-Logo reindrehen
  setTimeout(() => {
    // Hasen-Logo ausblenden mit Drehung
    rabbitLogo.style.transform = 'rotateY(90deg)';
    rabbitLogo.style.opacity = '0';
    
    // Nach halber Drehung das Bit-Logo einblenden
    setTimeout(() => {
      // Hasen-Logo komplett ausblenden
      rabbitLogo.style.display = 'none';
      
      // Bit-Logo vorbereiten und dann eindrehen
      bitImage.style.transform = 'rotateY(-90deg)';
      bitImage.style.display = 'block';
      bitImage.style.opacity = '0';
      
      // Kurze Verzögerung für visuellen Effekt
      setTimeout(() => {
        bitImage.style.transition = 'transform 1s ease, opacity 0.5s ease';
        bitImage.style.transform = 'rotateY(0deg)';
        bitImage.style.opacity = '1';
      }, 50);
    }, 500); // Halbe Animationszeit
  }, 300);
}

// Scroll-to-Top Button
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

// Navigation aktiv-Status basierend auf Scroll-Position
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
    
    // Home aktiv, wenn am Anfang der Seite
    if (window.pageYOffset < 100 && link.getAttribute('href') === '#home') {
      link.classList.add('active');
    }
  });
});

// Smooth Scroll für Navigation
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

// FAQ Akkordeon-Funktionalität
document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-q');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const arrow = question.querySelector('.faq-arrow');
      
      // Toggle aktive Klasse
      const isActive = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
      
      // Schließe alle anderen FAQs
      document.querySelectorAll('.faq-a').forEach(item => {
        if (item !== answer) {
          item.style.maxHeight = '0px';
          item.style.padding = '0 15px';
          
          // Reset Pfeil
          const itemArrow = item.previousElementSibling.querySelector('.faq-arrow');
          if (itemArrow) itemArrow.textContent = '▼';
        }
      });
      
      // Toggle aktuelles FAQ
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
