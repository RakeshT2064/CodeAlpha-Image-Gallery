document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const gallery = document.querySelector('.gallery');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update filtered items array for lightbox navigation
            filteredItems = [...galleryItems].filter(item => {
                return filter === 'all' || item.getAttribute('data-category') === filter;
            });
        });
    });
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Get only visible items for navigation
            filteredItems = [...galleryItems].filter(item => item.style.display !== 'none');
            currentIndex = filteredItems.indexOf(this);
            
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('.overlay span').textContent;
            
            openLightbox(imgSrc, caption);
        });
    });
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.style.display || lightbox.style.display === 'none') return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
            navigateImage('next');
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => navigateImage('prev'));
    nextBtn.addEventListener('click', () => navigateImage('next'));
    
    // Functions
    function openLightbox(imgSrc, caption) {
        lightbox.style.display = 'block';
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        
        // Fade in effect
        setTimeout(() => {
            lightboxImg.classList.add('show');
        }, 10);
        
        // Disable scrolling on body
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightboxImg.classList.remove('show');
        
        // Fade out effect
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    function navigateImage(direction) {
        // Remove show class for transition
        lightboxImg.classList.remove('show');
        
        setTimeout(() => {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % filteredItems.length;
            } else {
                currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
            }
            
            const newItem = filteredItems[currentIndex];
            const newImgSrc = newItem.querySelector('img').src;
            const newCaption = newItem.querySelector('.overlay span').textContent;
            
            lightboxImg.src = newImgSrc;
            lightboxCaption.textContent = newCaption;
            
            // Add show class back
            setTimeout(() => {
                lightboxImg.classList.add('show');
            }, 10);
        }, 300);
    }
});