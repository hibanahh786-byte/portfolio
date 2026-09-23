document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksList = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Optional: Animate hamburger into X
        hamburger.classList.toggle('toggle');
    });

    // Close menu when a link is clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // 2. Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Offset for fixed header
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once faded in to keep it visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // 4. Contact Form Submission Mock
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Visual feedback
            btn.innerHTML = 'Sent Successfully! <i class="fas fa-check"></i>';
            btn.classList.add('btn-success');
            
            // Reset form
            contactForm.reset();
            
            // Revert button after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
            }, 3000);
        });
    }

});

    // 5. Projects Modal & Image Gallery Logic
    const projectsData = {
        "bakeease": {
            title: "BakeEase",
            description: "BakeEase is a comprehensive digital solution designed specifically for baking businesses and bakery management. It helps streamline orders, manage stock, and track sales, making it easier to run a bakery efficiently.",
            images: [
                "images/bakeease-4.png",
                "images/bakeease-3.png",
                "images/bakeease-1.png",
                "images/bakeease-5.png",
                "images/bakeease-2.png"
            ],
            technologies: [
                "Flutter",
                "Django",
                "MySQL"
            ],
            features: [
                "Customer: Browsed bakery products, placed customized cake orders, managed cart/wishlist, and made online payments.",
                "Baker: Managed products, orders, inventory, expenses, FSSAI details, delivery tracking, and sales reports.",
                "Delivery Person: Viewed assigned deliveries, updated delivery status, and tracked order completion.",
                "Admin: Managed users, bakers, delivery personnel, products, orders, payments, and overall system operations."
            ],
            github: "https://github.com/Hibanahh786-byte/BakeEase",
            demo: "" // Empty if no live demo
        }
    };

    const modal = document.getElementById("project-modal");
    const closeModal = document.querySelector(".close-modal");
    const viewButtons = document.querySelectorAll(".view-project-btn");
    
    // Modal Elements
    const mTitle = document.getElementById("modal-title");
    const mDesc = document.getElementById("modal-desc");
    const mTech = document.getElementById("modal-tech");
    const mFeatures = document.getElementById("modal-features");
    const mGithub = document.getElementById("modal-github");
    const mDemo = document.getElementById("modal-demo");
    const mainImage = document.getElementById("main-image");
    const thumbContainer = document.getElementById("thumbnail-container");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentImages = [];
    let currentIndex = 0;

    // Open Modal
    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const projectId = btn.getAttribute("data-project");
            const data = projectsData[projectId];
            if (!data) return;

            // Populate text data
            mTitle.textContent = data.title;
            mDesc.textContent = data.description;
            
            mTech.innerHTML = data.technologies.map(t => `<li>${t}</li>`).join("");
            mFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join("");
            
            if (data.github) {
                mGithub.style.display = "inline-flex";
                mGithub.href = data.github;
            } else {
                mGithub.style.display = "none";
            }
            
            if (data.demo) {
                mDemo.style.display = "inline-flex";
                mDemo.href = data.demo;
            } else {
                mDemo.style.display = "none";
            }

            // Populate Gallery
            currentImages = data.images;
            currentIndex = 0;
            updateGallery();

            // Create Thumbnails
            thumbContainer.innerHTML = "";
            currentImages.forEach((src, index) => {
                const img = document.createElement("img");
                img.src = src;
                img.className = index === 0 ? "thumbnail active" : "thumbnail";
                img.alt = `Thumbnail ${index + 1}`;
                
                // Add fallback for missing local images during testing
                img.onerror = function() {
                    this.src = `https://via.placeholder.com/600x400?text=Upload+Screenshot+${index + 1}`;
                };

                img.addEventListener("click", () => {
                    currentIndex = index;
                    updateGallery();
                });
                thumbContainer.appendChild(img);
            });

            // Show modal
            document.body.style.overflow = "hidden"; // Prevent background scrolling
            modal.classList.add("show");
        });
    });

    // Close Modal
    closeModal.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });

    // Gallery Navigation
    function updateGallery() {
        if (currentImages.length === 0) return;
        
        mainImage.src = currentImages[currentIndex];
        
        // Fallback for main image
        mainImage.onerror = function() {
            this.src = `https://via.placeholder.com/600x400?text=Upload+Screenshot+${currentIndex + 1}`;
        };

        const thumbs = thumbContainer.querySelectorAll(".thumbnail");
        thumbs.forEach((t, i) => {
            t.classList.toggle("active", i === currentIndex);
        });
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
        updateGallery();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex < currentImages.length - 1) ? currentIndex + 1 : 0;
        updateGallery();
    });

    // 6. Lightbox Logic
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.querySelector(".close-lightbox");

    mainImage.addEventListener("click", () => {
        lightboxImg.src = mainImage.src;
        lightbox.classList.add("show");
    });

    closeLightbox.addEventListener("click", () => {
        lightbox.classList.remove("show");
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("show");
        }
    });

