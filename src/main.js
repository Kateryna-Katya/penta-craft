document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       0. ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК
    ============================================== */
    // Иконки Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ==============================================
       1. МОБИЛЬНОЕ МЕНЮ И ХЕДЕР
    ============================================== */
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');
    const body = document.body;

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
            body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                burger.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(11, 15, 25, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(11, 15, 25, 0.85)';
                header.style.boxShadow = 'none';
            }
        });
    }

    /* ==============================================
       2. АНИМАЦИИ (GSAP)
    ============================================== */
    if (typeof gsap !== 'undefined') {
        
        // Hero Section
        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            gsap.set(heroContent, { opacity: 0, y: 30 });
            
            heroTl.to(heroContent, { opacity: 1, y: 0, duration: 1, delay: 0.2 })
                  .from('.hero__badge', { y: 20, opacity: 0, duration: 0.8 }, '-=0.7')
                  .from('.hero__title', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
                  .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
                  .from('.hero__actions', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
                  .from('.hero__stats', { opacity: 0, duration: 1 }, '-=0.4');
            
            gsap.from('.hero__background', { opacity: 0, duration: 2, ease: 'power2.out' }, 0);
        }

        // Общая анимация секций
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if(section.classList.contains('career')) return;

            gsap.fromTo(section.children, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        });

        // Анимация Timeline
        const timeline = document.querySelector('.timeline');
        const progressLine = document.querySelector('.timeline__progress');
        const timelineItems = document.querySelectorAll('.timeline__item');

        if (timeline && progressLine) {
            gsap.to(progressLine, {
                height: '100%',
                scrollTrigger: {
                    trigger: timeline,
                    start: 'top 60%',
                    end: 'bottom 60%',
                    scrub: 0.5,
                },
                ease: 'none'
            });

            timelineItems.forEach((item) => {
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 65%',
                    onEnter: () => item.classList.add('active'),
                    onLeaveBack: () => item.classList.remove('active')
                });

                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                    },
                    opacity: 0,
                    x: window.innerWidth > 768 ? (item.matches(':nth-child(even)') ? 50 : -50) : 0,
                    y: window.innerWidth <= 768 ? 30 : 0,
                    duration: 0.6
                });
            });
        }
    }

    /* ==============================================
       3. 3D TILT EFFECT
    ============================================== */
    const tiltCards = document.querySelectorAll('.js-tilt');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7; 
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ==============================================
       4. ФОРМА КОНТАКТОВ (ВАЖНОЕ ИСПРАВЛЕНИЕ)
    ============================================== */
    const contactForm = document.getElementById('contactForm'); // Убедись, что в HTML <form id="contactForm">
    const phoneInput = document.getElementById('phone');        // Убедись, что в HTML <input id="phone">
    const formStatus = document.getElementById('formStatus');
    
    // Капча
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captchaInput');
    let captchaNum1, captchaNum2, captchaResult;

    function generateCaptcha() {
        if(!captchaLabel) return;
        captchaNum1 = Math.floor(Math.random() * 10);
        captchaNum2 = Math.floor(Math.random() * 10);
        captchaResult = captchaNum1 + captchaNum2;
        captchaLabel.textContent = `Сколько будет ${captchaNum1} + ${captchaNum2}?`;
    }

    // Проверяем, существует ли форма на странице
    if (contactForm) {
        generateCaptcha();

        // 1. ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ)
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Заменяем все не-цифры (\D) на пустоту
                this.value = this.value.replace(/\D/g, '');
            });
        }

        // 2. ОБРАБОТКА ОТПРАВКИ
        contactForm.addEventListener('submit', function(e) {
            // !!! ГЛАВНАЯ СТРОКА: ОТМЕНЯЕТ ПЕРЕЗАГРУЗКУ !!!
            e.preventDefault(); 
            
            console.log('Form submit intercepted'); // Для проверки в консоли

            // Проверка капчи
            if (captchaInput && parseInt(captchaInput.value) !== captchaResult) {
                formStatus.textContent = 'Ошибка: Неверный ответ!';
                formStatus.className = 'form-status status-error';
                generateCaptcha();
                captchaInput.value = '';
                return;
            }

            // Имитация отправки
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = btn.textContent;
            
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalBtnText;
                btn.disabled = false;
                
                formStatus.textContent = 'Успешно! Данные отправлены.';
                formStatus.className = 'form-status status-success';
                
                contactForm.reset();
                generateCaptcha();
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1500);
        });
    }

    /* ==============================================
       5. COOKIE POPUP
    ============================================== */
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookieBtn = document.getElementById('acceptCookie');

    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);

        acceptCookieBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('show');
        });
    }
});