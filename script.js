/**
 * Shri Swami Samarth Engineering Work
 * Wireframe Interaction & Layout Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. High-Performance Smooth Momentum Scrolling (Lenis Engine)
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.15,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenis;
  }

  // Smooth scroll helper with sticky header offset
  function smoothScrollTo(target, offset = -78) {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: offset, duration: 1.2 });
    } else {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  }

  // Intercept all internal anchor navigation for silky smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        smoothScrollTo(targetElement, -78);
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // Scroll Progress Bar & Floating Back-To-Top Button & ScrollSpy
  const scrollProgressBar = document.getElementById('header-scroll-progress');
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link:not(.nav-cta)');

  function onScrollHandler() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // 1. Update Golden Progress Bar on header
    if (scrollProgressBar && maxScroll > 0) {
      const percentage = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      scrollProgressBar.style.width = `${percentage}%`;
    }

    // 2. Show / Hide Back to Top button
    if (scrollToTopBtn) {
      if (scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // 3. ScrollSpy: Highlight active section in navigation
    let activeId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        activeId = section.getAttribute('id');
      }
    });

    if (activeId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  if (lenis) {
    lenis.on('scroll', onScrollHandler);
  } else {
    window.addEventListener('scroll', onScrollHandler, { passive: true });
  }

  // Back to Top button listener
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      smoothScrollTo('#hero', 0);
    });
  }

  // 1. Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking any navigation link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 2. Gallery Filter Tabs
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-grid .gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Technical Drawing File Upload Display
  const fileInput = document.getElementById('drawing-upload');
  const fileNameDisplay = document.getElementById('file-selected-name');
  const fileDropzone = document.getElementById('file-dropzone');

  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileSizeKb = (file.size / 1024).toFixed(1);
        fileNameDisplay.textContent = `Selected: ${file.name} (${fileSizeKb} KB)`;
      } else {
        fileNameDisplay.textContent = 'No file chosen';
      }
    });

    // Drag and Drop styling
    if (fileDropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        fileDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          fileDropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        fileDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          fileDropzone.classList.remove('dragover');
        });
      });
    }
  }

  // 4. Request for Quote / Enquiry Form Submission -> Direct WhatsApp Forwarding
  const rfqForm = document.getElementById('rfq-form');
  const formFeedback = document.getElementById('form-feedback');

  if (rfqForm && formFeedback) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim() || '';
      const company = document.getElementById('contact-company')?.value.trim() || '';
      const phone = document.getElementById('contact-phone')?.value.trim() || '';
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const serviceSelect = document.getElementById('service-type');
      const serviceText = serviceSelect && serviceSelect.selectedIndex >= 0 && serviceSelect.value
        ? serviceSelect.options[serviceSelect.selectedIndex].text
        : 'General Job Work';
      const quantity = document.getElementById('component-quantity')?.value.trim() || '';
      const material = document.getElementById('target-material')?.value.trim() || '';
      const description = document.getElementById('project-description')?.value.trim() || '';

      // Build structured, easy-to-read WhatsApp message
      let message = `*NEW ENQUIRY / RFQ*\n`;
      message += `*Shri Swami Samarth Engineering Work*\n`;
      message += `──────────────────────\n`;
      message += `👤 *Client Name:* ${name}\n`;
      message += `🏢 *Company:* ${company}\n`;
      message += `📞 *Phone:* ${phone}\n`;
      message += `✉️ *Email:* ${email}\n`;
      message += `⚙️ *Service Required:* ${serviceText}\n`;
      if (quantity) {
        message += `📦 *Est. Quantity:* ${quantity}\n`;
      }
      if (material) {
        message += `🔩 *Material Spec:* ${material}\n`;
      }
      message += `📝 *Requirement Details:*\n${description}\n`;
      message += `──────────────────────\n`;
      message += `_Sent via sssengineeringworks.com_`;

      const whatsappNumber = '919970697776';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Display clean, reassuring feedback card
      formFeedback.className = 'form-feedback success';
      formFeedback.style.display = 'block';
      formFeedback.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem; text-align: left;">
          <span style="font-size: 1.4rem; line-height: 1.2;">💬</span>
          <div>
            <strong style="color: #065f46; font-size: 0.95rem;">Enquiry Ready for WhatsApp!</strong>
            <p style="margin: 0.35rem 0 0.55rem; color: #047857; font-size: 0.88rem; line-height: 1.45;">
              Thank you, <strong>${name}</strong>. Opening WhatsApp so you can send your requirements directly to <strong>+91 99706 97776</strong>.
            </p>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; background: #25D366; color: #ffffff; border-radius: 6px; font-weight: 700; font-size: 0.84rem; text-decoration: none; box-shadow: 0 2px 6px rgba(37, 211, 102, 0.35); transition: opacity 0.2s;">
              <span>Open WhatsApp Directly</span> &rarr;
            </a>
          </div>
        </div>
      `;

      // Open WhatsApp in a new tab
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.error('Popup blocked:', err);
      }

      smoothScrollTo(formFeedback, -120);
    });
  }

  // 5. Hero Carousel Controller (Horizontal Sliding Track & GPU Transitions)
  const track = document.getElementById('hero-carousel-track');
  const slides = document.querySelectorAll('.hero-slide');
  const indicatorBtns = document.querySelectorAll('.hero-carousel-controls .indicator-btn');
  const prevBtn = document.getElementById('hero-carousel-prev');
  const nextBtn = document.getElementById('hero-carousel-next');
  const counterCurrent = document.getElementById('carousel-counter-current');
  const playToggleBtn = document.getElementById('carousel-play-toggle');

  if (track && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideDuration = 5000; // 5 seconds per slide
    let timer = null;
    let isPlaying = true;

    function formatNumber(num) {
      return String(num + 1).padStart(2, '0');
    }

    function updateCarousel() {
      // 1. Move track horizontally across screen
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      // 2. Update active class on slides for depth/parallax & text reveal
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // 3. Update indicators & trigger smooth CSS progress bar
      indicatorBtns.forEach((btn, idx) => {
        const bar = btn.querySelector('.indicator-progress');
        if (idx === currentSlide) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            void bar.offsetWidth; // Force CSS reflow
            if (isPlaying) {
              bar.style.transition = `width ${slideDuration}ms linear`;
              bar.style.width = '100%';
            }
          }
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
          if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0%';
          }
        }
      });

      // 4. Update numeric slide counter
      if (counterCurrent) {
        counterCurrent.textContent = formatNumber(currentSlide);
      }
    }

    function startTimer() {
      stopTimer();
      if (!isPlaying) return;
      timer = setTimeout(() => {
        nextSlide();
      }, slideDuration);
    }

    function stopTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateCarousel();
      startTimer();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    // Toggle Play/Pause
    function togglePlayPause() {
      isPlaying = !isPlaying;
      const pauseIcon = playToggleBtn?.querySelector('.icon-pause');
      const playIcon = playToggleBtn?.querySelector('.icon-play');

      if (isPlaying) {
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
        playToggleBtn?.setAttribute('aria-label', 'Pause Auto-Play');
        goToSlide(currentSlide);
      } else {
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
        playToggleBtn?.setAttribute('aria-label', 'Resume Auto-Play');
        stopTimer();
        const activeBar = indicatorBtns[currentSlide]?.querySelector('.indicator-progress');
        if (activeBar) {
          activeBar.style.transition = 'none';
        }
      }
    }

    if (playToggleBtn) {
      playToggleBtn.addEventListener('click', togglePlayPause);
    }

    // Prev / Next button listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
      });
    }

    // Indicator pill listeners
    indicatorBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        goToSlide(idx);
      });
    });

    // Touch Swipe support for smartphones and tablets
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    // Keyboard support (Left / Right Arrow)
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Pause briefly when hovering directly over arrow buttons or indicator tabs
    const interactiveControls = document.querySelectorAll('.carousel-arrow, .indicator-btn');
    interactiveControls.forEach(control => {
      control.addEventListener('mouseenter', () => {
        stopTimer();
      });
      control.addEventListener('mouseleave', () => {
        if (isPlaying) startTimer();
      });
    });

    // Initial launch
    updateCarousel();
    startTimer();
  }

  // ==========================================================================
  // Interactive Work Gallery Lightbox with Autoslide & Controls
  // ==========================================================================
  const WORK_GALLERIES = {
    shafts: {
      title: "Precision Machined Shafts",
      items: [
        {
          src: "images/job-shaft-1.jpg",
          alt: "Precision CNC Turned & Splined Step Shaft - Profile 1",
          caption: "Precision CNC Turned & Splined Step Shaft"
        },
        {
          src: "images/job-shaft-2.jpg",
          alt: "Multi-Diameter Concentric Stepped Shaft - Profile 2",
          caption: "Multi-Diameter Concentric Stepped Shaft"
        },
        {
          src: "images/job-shaft-3.jpg",
          alt: "Precision Splined Shaft with Keyway and Threading - Profile 3",
          caption: "Precision Splined Shaft with Keyway and Threading"
        },
        {
          src: "images/job-shaft-4.jpg",
          alt: "Flanged & Threaded Spindle Drive Shaft - Profile 4",
          caption: "Flanged & Threaded Spindle Drive Shaft"
        }
      ]
    },
    bushes: {
      title: "Precision Machined Bushes",
      items: [
        {
          src: "images/job-bush-1.jpg",
          alt: "Precision Turned Bush - Profile 1",
          caption: "Precision Turned Bearing Bush"
        },
        {
          src: "images/job-bush-2.jpg",
          alt: "Flanged Bush Component - Profile 2",
          caption: "Flanged Bush – CNC Turned"
        },
        {
          src: "images/job-bush-3.jpg",
          alt: "Stepped Bush with Bore - Profile 3",
          caption: "Stepped Bush with Precision Bore"
        },
        {
          src: "images/job-bush-4.jpg",
          alt: "Hardened & Ground Bush - Profile 4",
          caption: "Hardened & Ground Bush"
        }
      ]
    },
    sleeves: {
      title: "Precision Machined Sleeves",
      items: [
        {
          src: "images/job-sleeve-1.jpg",
          alt: "Threaded Sleeve with Flanged Base - Profile 1",
          caption: "Threaded Sleeve with Flanged Base"
        },
        {
          src: "images/job-sleeve-2.jpg",
          alt: "Step Bore Sleeve with Retaining Groove - Profile 2",
          caption: "Step Bore Sleeve with Retaining Groove"
        },
        {
          src: "images/job-sleeve-3.jpg",
          alt: "Slotted Flanged Sleeve - Profile 3",
          caption: "Slotted Flanged Sleeve – CNC Turned"
        }
      ]
    },
    spacers: {
      title: "Precision Machined Spacers",
      items: [
        {
          src: "images/job-spacer-1.jpg",
          alt: "Assorted Precision Turned Spacer Components",
          caption: "Precision Turned Spacer Components"
        }
      ]
    },
    threaded: {
      title: "Threaded Components",
      items: [
        {
          src: "images/job-threaded-1.jpg",
          alt: "Precision Threaded Studs, Bolts & Fittings",
          caption: "Precision Threaded Studs, Bolts & Fittings"
        }
      ]
    },
    grooved: {
      title: "Grooved / Splined Components",
      items: [
        {
          src: "images/job-grooved-1.jpg",
          alt: "CNC Turned Grooved and Splined Components",
          caption: "CNC Turned Grooved & Splined Components"
        }
      ]
    }
  };

  const galleryModal = document.getElementById('work-gallery-modal');
  const galleryBackdrop = document.getElementById('work-gallery-backdrop');
  const galleryCloseBtn = document.getElementById('work-gallery-close-btn');
  const galleryTitleEl = document.getElementById('work-gallery-title');
  const galleryCounterEl = document.getElementById('work-gallery-counter');
  const galleryMainImg = document.getElementById('work-gallery-main-img');
  const galleryPrevBtn = document.getElementById('work-gallery-prev');
  const galleryNextBtn = document.getElementById('work-gallery-next');
  const galleryThumbnails = document.getElementById('work-gallery-thumbnails');
  const galleryProgressBar = document.getElementById('work-gallery-progress-bar');
  const galleryPlayBtn = document.getElementById('work-gallery-play-btn');
  const galleryViewport = document.getElementById('work-gallery-viewport');

  if (galleryModal && galleryMainImg) {
    let currentGalleryId = 'shafts';
    let currentIndex = 0;
    let autoSlideTimer = null;
    let isAutoPlaying = true;
    let isTransitioning = false;
    const SLIDE_DURATION = 3500; // 3.5s per slide

    function getActiveItems() {
      return WORK_GALLERIES[currentGalleryId]?.items || [];
    }

    function openGallery(galleryId, startIndex = 0) {
      if (!WORK_GALLERIES[galleryId]) return;
      currentGalleryId = galleryId;
      currentIndex = startIndex;
      isAutoPlaying = true;

      const gallery = WORK_GALLERIES[galleryId];
      if (galleryTitleEl) {
        galleryTitleEl.textContent = gallery.title || 'Component Gallery';
      }

      // Render Thumbnails
      if (galleryThumbnails) {
        galleryThumbnails.innerHTML = '';
        gallery.items.forEach((item, idx) => {
          const thumbBtn = document.createElement('button');
          thumbBtn.className = `work-gallery-thumb ${idx === currentIndex ? 'active' : ''}`;
          thumbBtn.setAttribute('type', 'button');
          thumbBtn.setAttribute('aria-label', `View photo ${idx + 1}`);
          thumbBtn.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy" />`;
          thumbBtn.addEventListener('click', () => {
            goToSlide(idx);
          });
          galleryThumbnails.appendChild(thumbBtn);
        });
      }

      // Open Modal
      galleryModal.classList.add('is-open');
      galleryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();

      showSlide(currentIndex, false);
      startAutoSlide();
    }

    function closeGallery() {
      galleryModal.classList.remove('is-open');
      galleryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
      stopAutoSlide();
    }

    function showSlide(index, animate = true) {
      const items = getActiveItems();
      if (!items.length) return;

      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;

      const item = items[currentIndex];

      // Update counter
      if (galleryCounterEl) {
        const cur = String(currentIndex + 1).padStart(2, '0');
        const tot = String(items.length).padStart(2, '0');
        galleryCounterEl.textContent = `${cur} / ${tot}`;
      }

      // Update active thumbnail
      if (galleryThumbnails) {
        const thumbs = galleryThumbnails.querySelectorAll('.work-gallery-thumb');
        thumbs.forEach((th, idx) => {
          if (idx === currentIndex) {
            th.classList.add('active');
            th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } else {
            th.classList.remove('active');
          }
        });
      }

      // Transition image
      if (animate) {
        isTransitioning = true;
        galleryMainImg.classList.add('fade-out');
        setTimeout(() => {
          galleryMainImg.src = item.src;
          galleryMainImg.alt = item.alt;
          galleryMainImg.classList.remove('fade-out');
          galleryMainImg.classList.add('fade-in');
          setTimeout(() => {
            galleryMainImg.classList.remove('fade-in');
            isTransitioning = false;
          }, 300);
        }, 200);
      } else {
        galleryMainImg.src = item.src;
        galleryMainImg.alt = item.alt;
      }

      // Reset progress bar
      resetProgressBar();
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function goToSlide(idx) {
      if (idx === currentIndex) return;
      showSlide(idx);
    }

    function resetProgressBar() {
      if (!galleryProgressBar) return;
      galleryProgressBar.style.transition = 'none';
      galleryProgressBar.style.width = '0%';
      if (isAutoPlaying) {
        setTimeout(() => {
          galleryProgressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
          galleryProgressBar.style.width = '100%';
        }, 30);
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      if (!isAutoPlaying) return;
      resetProgressBar();
      autoSlideTimer = setTimeout(() => {
        nextSlide();
        startAutoSlide();
      }, SLIDE_DURATION);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearTimeout(autoSlideTimer);
        autoSlideTimer = null;
      }
      if (galleryProgressBar) {
        galleryProgressBar.style.transition = 'none';
        galleryProgressBar.style.width = '0%';
      }
    }

    function togglePlay() {
      isAutoPlaying = !isAutoPlaying;
      if (galleryPlayBtn) {
        const pauseIcon = galleryPlayBtn.querySelector('.icon-pause');
        const playIcon = galleryPlayBtn.querySelector('.icon-play');
        if (pauseIcon && playIcon) {
          pauseIcon.style.display = isAutoPlaying ? 'block' : 'none';
          playIcon.style.display = isAutoPlaying ? 'none' : 'block';
        }
      }
      if (isAutoPlaying) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    }

    // Event Listeners
    if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', closeGallery);
    if (galleryBackdrop) galleryBackdrop.addEventListener('click', closeGallery);
    if (galleryNextBtn) {
      galleryNextBtn.addEventListener('click', () => {
        nextSlide();
        if (isAutoPlaying) startAutoSlide();
      });
    }
    if (galleryPrevBtn) {
      galleryPrevBtn.addEventListener('click', () => {
        prevSlide();
        if (isAutoPlaying) startAutoSlide();
      });
    }
    if (galleryPlayBtn) galleryPlayBtn.addEventListener('click', togglePlay);

    // Pause on mouse hover in the viewport stage
    if (galleryViewport) {
      galleryViewport.addEventListener('mouseenter', () => {
        if (isAutoPlaying) stopAutoSlide();
      });
      galleryViewport.addEventListener('mouseleave', () => {
        if (isAutoPlaying) startAutoSlide();
      });

      // Touch swipe in viewport
      let touchStartX = 0;
      let touchEndX = 0;
      galleryViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      galleryViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          if (isAutoPlaying) startAutoSlide();
        }
      }, { passive: true });
    }

    // Keyboard support: Escape closes, Arrow keys navigate
    document.addEventListener('keydown', (e) => {
      if (!galleryModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') {
        nextSlide();
        if (isAutoPlaying) startAutoSlide();
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
        if (isAutoPlaying) startAutoSlide();
      }
    });

    // Attach click listeners to cards that have [data-gallery-id]
    document.querySelectorAll('.job-card[data-gallery-id]').forEach(card => {
      const galleryId = card.getAttribute('data-gallery-id');
      card.addEventListener('click', () => {
        openGallery(galleryId, 0);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGallery(galleryId, 0);
        }
      });
    });
  }
});
