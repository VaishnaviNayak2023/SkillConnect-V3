document.addEventListener('DOMContentLoaded', () => {

    /**
     * Handles horizontal scrolling for course carousels.
     * @param {string} sectionId - The ID of the container holding the carousel.
     * @param {number} scrollAmount - The amount to scroll (positive for next, negative for prev).
     */
    function scrollCarousel(sectionId, scrollAmount) {
        const grid = document.querySelector(`#${sectionId} .course-card-grid`);
        if (grid) {
            grid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // Attach listeners to the navigation buttons
    document.querySelectorAll('.nav-arrows button').forEach(button => {
        button.addEventListener('click', (e) => {
            const section = e.target.closest('.course-section');
            if (!section) return;

            const sectionId = section.id;
            const direction = e.target.classList.contains('prev-btn') ? 'prev' : 'next';
            const scrollValue = 350; // Approximate width of one card + gap

            if (direction === 'next') {
                scrollCarousel(sectionId, scrollValue);
            } else {
                scrollCarousel(sectionId, -scrollValue);
            }
        });
    });

    // --- Placeholder for Dynamic Course Loading ---
    
    // In a real application, you would use PHP/MySQL to dynamically generate
    // the HTML for all course cards (e.g., using a foreach loop and an API call)
    
    function loadCourses() {
        // Example: Fetch courses from /api/get_courses.php?category=recommended
        // fetch('api/get_courses.php?category=recommended')
        //     .then(res => res.json())
        //     .then(data => {
        //         // Populate course-card-grid for 'recommended' section
        //     });
    }

    // loadCourses();
    
    console.log('Course Page Scripts Loaded.');
});