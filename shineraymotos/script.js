document.addEventListener('DOMContentLoaded', function () {
    // --- CMS & DYNAMIC RENDERING ---

    // Set minimum date to today (prevent past dates)
    const tdDateInput = document.getElementById('td-date');
    if (tdDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        tdDateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // --- STATIC DATA RENDERING ---

    const modelsGrid = document.querySelector('.models-grid');

    // Load data directly from data.js (initialBikes)
    let bikes = [];
    if (typeof initialBikes !== 'undefined') {
        bikes = JSON.parse(JSON.stringify(initialBikes));
    } else {
        console.error('initialBikes not found in data.js');
    }

    // Initial Render
    updateNavigationMenu();
    renderBikes();


    // 2. Update Navigation Menu Dynamically
    function updateNavigationMenu() {
        const menuList = document.querySelector('.model-list-horizontal');
        if (!menuList) return;

        menuList.innerHTML = ''; // Clear existing

        bikes.forEach(bike => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${bike.id}`;
            a.textContent = bike.name;
            li.appendChild(a);
            menuList.appendChild(li);
        });
    }

    // 3. Render Bikes
    function renderBikes() {
        if (!modelsGrid) return;
        modelsGrid.innerHTML = ''; // Clear existing

        bikes.forEach(bike => {
            const card = document.createElement('div');
            card.className = 'model-card';
            card.id = bike.id;

            // Safe access to start property
            const startMethod = (typeof bike.start === 'string') ? bike.start.split('/')[0] : 'Elétrica';

            card.innerHTML = `
                <div class="model-image">
                    <img src="${bike.img}" alt="${bike.name}">
                </div>
                <div class="model-info">
                    <h4>${bike.name}</h4>
                    <p class="model-desc">${bike.desc}</p>

                    <div class="model-specs-preview">
                        <span class="spec-chip">${bike.cc}</span>
                        <span class="spec-chip">Partida ${startMethod}</span>
                        <span class="spec-chip">Freio ${bike.brake}</span>
                    </div>

                    <button class="model-btn open-modal-btn">Ver Detalhes</button>
                </div>
            `;
            modelsGrid.appendChild(card);
        });

        // Re-attach event listeners to new buttons
        attachModalListeners();
    }

    // 4. Modal Logic
    const modal = document.getElementById('bike-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    // Elements to populate
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalCc = document.getElementById('modal-cc');
    const modalPower = document.getElementById('modal-power');
    const modalStart = document.getElementById('modal-start');
    const modalBrake = document.getElementById('modal-brake');
    const modalFuel = document.getElementById('modal-fuel');
    const modalDiff = document.getElementById('modal-diff');
    const modalAudience = document.getElementById('modal-audience');
    const modalWhatsapp = document.getElementById('modal-whatsapp');

    function attachModalListeners() {
        const openModalBtns = document.querySelectorAll('.open-modal-btn');
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                try {
                    console.log('Button clicked');
                    const card = this.closest('.model-card');
                    if (!card) throw new Error('Card not found');

                    const bikeId = card.id;
                    const bike = bikes.find(b => b.id === bikeId);

                    if (!bike) {
                        console.error('Bike not found for ID:', bikeId);
                        return;
                    }

                    console.log('Bike data found:', bike);

                    // Populate modal
                    if (modalTitle) modalTitle.textContent = bike.name || 'Nome não disponível';
                    if (modalDesc) modalDesc.textContent = bike.desc || 'Descrição não disponível';
                    if (modalImg) {
                        modalImg.src = bike.img || '';
                        modalImg.alt = bike.name || 'Imagem da moto';
                    }
                    if (modalCc) modalCc.textContent = bike.cc || '-';
                    if (modalPower) modalPower.textContent = bike.power || '-';
                    if (modalStart) modalStart.textContent = bike.start || '-';
                    if (modalBrake) modalBrake.textContent = bike.brake || '-';
                    if (modalFuel) modalFuel.textContent = bike.fuel || '-';
                    if (modalDiff) modalDiff.textContent = bike.diff || '-';
                    if (modalAudience) modalAudience.textContent = bike.audience || '-';

                    // Populate Colors
                    const colorsContainer = document.getElementById('modal-colors');
                    if (colorsContainer) {
                        colorsContainer.innerHTML = ''; // Clear previous

                        // Safe check for colorCodes
                        const codes = Array.isArray(bike.colorCodes) ? bike.colorCodes : [["#000000"]];

                        codes.forEach(colors => {
                            const colorDot = document.createElement('div');
                            colorDot.className = 'color-dot';

                            if (colors.length === 1) {
                                colorDot.style.backgroundColor = colors[0];
                            } else if (colors.length > 1) {
                                colorDot.style.background = `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`;
                            }
                            colorsContainer.appendChild(colorDot);
                        });
                    }

                    // Show/Hide Video Button
                    const videoContainer = document.getElementById('modal-video-container');
                    const videoLink = document.getElementById('modal-video-link');
                    if (bike.videoUrl && bike.videoUrl.trim() !== '') {
                        if (videoContainer) videoContainer.style.display = 'block';
                        if (videoLink) videoLink.href = bike.videoUrl;
                    } else {
                        if (videoContainer) videoContainer.style.display = 'none';
                    }

                    // Update WhatsApp Link
                    if (modalWhatsapp) {
                        const message = `Olá, tenho interesse na moto ${bike.name}. Poderia, por favor, me passar a simulação de financiamento?`;
                        modalWhatsapp.href = `https://wa.me/558591216306?text=${encodeURIComponent(message)}`;
                    }

                    // Pre-fill test drive model dropdown
                    const tdModel = document.getElementById('td-model');
                    if (tdModel) {
                        tdModel.value = bike.name;
                    }

                    // Show modal
                    if (modal) {
                        console.log('Showing modal');
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden'; // Prevent scrolling
                    } else {
                        console.error('Modal element not found');
                    }
                } catch (error) {
                    console.error('Error in modal click handler:', error);
                    alert('Ocorreu um erro ao abrir os detalhes. Por favor, recarregue a página.');
                }
            });
        });
    }

    // Close Modal Function
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Close Modal Events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // 'Agendar Test Drive' button inside modal
    const modalTestDriveBtn = document.getElementById('modal-testdrive-btn');
    if (modalTestDriveBtn) {
        modalTestDriveBtn.addEventListener('click', () => {
            closeModal();
            const section = document.getElementById('test-drive');
            if (section) {
                const headerOffset = 80;
                const top = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    }

    // Test Drive Form Submit
    const testDriveForm = document.getElementById('test-drive-form');
    if (testDriveForm) {
        testDriveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('td-name').value.trim();
            const model = document.getElementById('td-model').value;
            const date = document.getElementById('td-date').value;
            const turn = document.getElementById('td-turn').value;

            // Validate name: only letters (including accented), spaces, hyphens, apostrophes
            const nameRegex = /^[A-Za-zÀ-ÿ\s'\-]+$/;
            if (!nameRegex.test(name)) {
                alert('Por favor, insira um nome válido (apenas letras e espaços, sem números ou símbolos).');
                document.getElementById('td-name').focus();
                return;
            }

            // Validate date is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const chosen = new Date(date + 'T00:00:00');
            if (chosen < today) {
                alert('Por favor, selecione uma data a partir de hoje.');
                document.getElementById('td-date').focus();
                return;
            }

            // Format date to dd/mm/yyyy
            let dateFormatted = date;
            if (date) {
                const [y, m, d] = date.split('-');
                dateFormatted = `${d}/${m}/${y}`;
            }

            const msg = `Olá! Gostaria de agendar um Test Drive.%0ANome: ${encodeURIComponent(name)}%0AModelo: ${encodeURIComponent(model)}%0AData: ${dateFormatted}%0ATurno: ${encodeURIComponent(turn)}`;
            window.open(`https://wa.me/558591216306?text=${msg}`, '_blank');
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Handle mega menu toggle on mobile
        const megaMenuParent = document.querySelector('.has-mega-menu');
        if (megaMenuParent) {
            megaMenuParent.addEventListener('click', function (e) {
                // Only on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.classList.toggle('menu-open');
                }
            });
        }

        // Close menu when clicking on a link (except mega menu parent)
        const navItems = navLinks.querySelectorAll('a:not(.has-mega-menu > a)');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Close all menus
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                // Close mega menu if open
                if (megaMenuParent) {
                    megaMenuParent.classList.remove('menu-open');
                }

                // Handle smooth scroll for anchor links
                const href = item.getAttribute('href');
                if (href && href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // Calculate offset for sticky header (approximately 80px)
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
});

// Escape key to close
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('bike-modal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// --- HERO CAROUSEL LOGIC ---
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const slideInterval = 5000; // 5 seconds
let slideTimer;

function showSlide(index) {
    // Wrap around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Update slides
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlideTimer() {
    stopSlideTimer(); // Clear existing to avoid multiples
    slideTimer = setInterval(nextSlide, slideInterval);
}

function stopSlideTimer() {
    clearInterval(slideTimer);
}

// Event Listeners
if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideTimer(); // Reset timer on manual interaction
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideTimer();
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', function () {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        showSlide(slideIndex);
        startSlideTimer();
    });
});

// Start auto-play
if (slides.length > 0) {
    startSlideTimer();
}
