document.addEventListener('DOMContentLoaded', () => {
    // Image Slider Functionality
    const slides = document.querySelectorAll('.slider img');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize the first slide
    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(nextSlide, 3000); // Change image every 3 seconds
    }

    // Active navigation link highlighting (optional)
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const currentPath = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Product filtering and search (for products.html)
    const categoryFilter = document.getElementById('category-filter');
    const searchBar = document.getElementById('search-bar');
    const productItems = document.querySelectorAll('.products-page .product-item');

    function filterProducts() {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const searchTerm = searchBar ? searchBar.value.toLowerCase() : '';

        productItems.forEach(item => {
            const productCategory = item.getAttribute('data-category');
            const productName = item.querySelector('h3').textContent.toLowerCase();
            const productDescription = item.querySelector('p').textContent.toLowerCase();

            const matchesCategory = (selectedCategory === 'all' || productCategory === selectedCategory);
            const matchesSearch = (productName.includes(searchTerm) || productDescription.includes(searchTerm));

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (searchBar) {
        searchBar.addEventListener('keyup', filterProducts);
    }
    // Initial filter on load for products page
    if (productItems.length > 0 && (categoryFilter || searchBar)) {
        filterProducts();
    }
});