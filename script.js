// script.js - Purely Frontend Codebase (Interactive Search Added)

document.addEventListener('DOMContentLoaded', () => {
    // --- Utility Functions ---
    const initIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // --- 1. Theme Toggle Logic (Unchanged) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function setTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i data-lucide="sun"></i>';
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.innerHTML = '<i data-lucide="moon"></i>';
        }
        initIcons();
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(!body.classList.contains('dark-theme'));
        });
    }

    // --- 2. Navigation & Testimonial Carousel (Unchanged) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
            if (window.innerWidth <= 992) navLinks.classList.remove('active');
        }));
    }

    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((card, i) => {
            card.style.display = (i === index) ? 'block' : 'none';
        });
    }
    if (testimonials.length > 0 && prevButton && nextButton) {
        showTestimonial(currentIndex);
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        });
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        });
    }


    // --- 3. Newsletter Subscription Handler (Unchanged - relies on PHP) ---
    const newsletterForm = document.getElementById('newsletter-form');
    const subscribeMessage = document.getElementById('subscribe-message');

    if (newsletterForm && subscribeMessage) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';
            if (!email) {
                subscribeMessage.textContent = 'Please enter a valid email.';
                subscribeMessage.style.color = 'red';
                return;
            }
            try {
                // This AJAX call remains, assuming subscribe.php is the backend goal.
                const response = await fetch('subscribe.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
                const data = await response.json();
                
                if (data.success) {
                    subscribeMessage.textContent = data.message;
                    subscribeMessage.style.color = 'green';
                    emailInput.value = '';
                } else {
                    subscribeMessage.textContent = data.message;
                    subscribeMessage.style.color = 'orange';
                }
            } catch (error) {
                console.error('Subscription error: PHP endpoint unreachable.', error);
                subscribeMessage.textContent = 'Subscription service unavailable (PHP server required).';
                subscribeMessage.style.color = 'red';
            }
        });
    }

    // ==========================================================
    // --- 4. Interactive Client-Side Search Logic (courses.html) ---
    // ==========================================================
    
    const searchForm = document.getElementById('course-search-form');
    const searchInput = document.getElementById('search-input');
    const courseGrid = document.getElementById('course-results');

    if (searchForm && courseGrid) {
        /**
         * Filters static course cards based on the search term.
         */
        const filterCourses = (searchTerm) => {
            const normalizedSearch = searchTerm.trim().toLowerCase();
            let resultsFound = false;

            // Select all direct children (the course cards) of the main grid
            const cards = courseGrid.querySelectorAll('.course-card');
            
            cards.forEach(card => {
                // Get text content from the whole card (title, mentor name, etc.)
                const cardText = card.textContent.toLowerCase();

                if (cardText.includes(normalizedSearch)) {
                    card.style.display = 'flex'; // Show the card (assuming it's a flex item)
                    resultsFound = true;
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });

            // Update the display to show if no results were found
            const noResultsMsg = document.getElementById('no-results-message');
            if (!resultsFound) {
                if (!noResultsMsg) {
                    const msg = document.createElement('p');
                    msg.id = 'no-results-message';
                    msg.style.gridColumn = '1 / -1';
                    msg.style.textAlign = 'center';
                    msg.style.marginTop = '20px';
                    msg.textContent = `No courses found matching "${searchTerm}".`;
                    courseGrid.parentNode.appendChild(msg);
                } else {
                    noResultsMsg.textContent = `No courses found matching "${searchTerm}".`;
                    noResultsMsg.style.display = 'block';
                }
            } else if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        };

        // Handle search form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterCourses(searchInput.value);
        });

        // Optional: Add real-time search on keyup for a better experience
        searchInput.addEventListener('keyup', () => {
            filterCourses(searchInput.value);
        });

        // Handle category chip filtering (simplified version)
        document.querySelectorAll('.category-chips .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                // Deactivate all chips
                document.querySelectorAll('.category-chips .chip').forEach(c => c.classList.remove('active'));
                // Activate the clicked chip
                chip.classList.add('active');
                
                const category = chip.getAttribute('data-category');
                
                // For a purely static demo, we just search the category name
                // If category is empty (All), it searches for nothing, showing all.
                filterCourses(category); 
            });
        });
    }

    // Final initialization of all icons
    initIcons();
});