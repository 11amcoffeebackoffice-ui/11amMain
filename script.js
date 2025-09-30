	  // Mobile menu toggle functionality
	  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
	  const navMenu = document.getElementById('navMenu');

	  mobileMenuBtn.addEventListener('click', () => {
		navMenu.classList.toggle('active');
		// Change icon based on menu state
		const icon = mobileMenuBtn.querySelector('i');
		if (navMenu.classList.contains('active')) {
		  icon.classList.remove('fa-bars');
		  icon.classList.add('fa-times');
		} else {
		  icon.classList.remove('fa-times');
		  icon.classList.add('fa-bars');
		}
	  });

	  // Close menu when clicking a nav link or nav button
	  const navItems = document.querySelectorAll('#navMenu .nav-link, #navMenu .icon-btn');
	  navItems.forEach(item => {
		item.addEventListener('click', () => {
		  navMenu.classList.remove('active');
		  const icon = mobileMenuBtn.querySelector('i');
		  icon.classList.remove('fa-times');
		  icon.classList.add('fa-bars');
		});
	  });

	  // Close menu when clicking outside
	  document.addEventListener('click', (e) => {
		if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
		  navMenu.classList.remove('active');
		  const icon = mobileMenuBtn.querySelector('i');
		  icon.classList.remove('fa-times');
		  icon.classList.add('fa-bars');
		}
	  });
		
      document.querySelectorAll('input[type="checkbox"][name^="package"]').forEach(cb => {
        cb.addEventListener('change', () => {
          const qtySelect = cb.closest('.package').querySelector('select');
          if (cb.checked) {
            if (qtySelect.value === "0") {
              qtySelect.value = "1"; // ✅ default 1 when selected
            }
          } else {
            qtySelect.value = "0"; // ✅ reset back when unselected
          }
        });
      });     
      // Helper functions for buttons
      function printOrder() {
        // For a real implementation, you would use a library like html2canvas
        // This is a simplified version for demonstration
        if (isMobileDevice()) {
          // Mobile devices - show alert with instructions
          alert("To save your receipt:\n1. Take a screenshot of this page\n2. Save the image to your photos\n3. You can print it later from your device");
          // Highlight the receipt area
          const receipt = document.getElementById("successSection");
          receipt.style.boxShadow = "0 0 0 4px #2196F3";
          setTimeout(() => {
            receipt.style.boxShadow = "";
          }, 2000);
        } else {
          // Desktop - use print dialog
          window.print();
        }
      }
      // Check if device is mobile
      function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }	  
	  
	// feedback-pagination.js
class FeedbackPagination {
    constructor() {
        this.feedbackCollection = db.collection('CustomerFeedback');
        this.feedbackContainer = document.getElementById('feedbackCards');
        this.loadingElement = document.getElementById('feedbackLoading');
        this.errorElement = document.getElementById('feedbackError');
        this.ratingSummary = document.getElementById('ratingSummary');
        this.averageRating = document.getElementById('averageRating');
        this.ratingStars = document.getElementById('ratingStars');
        this.reviewCount = document.getElementById('reviewCount');
        this.paginationControls = document.getElementById('paginationControls');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInfo = document.getElementById('pageInfo');
        
        // Pagination settings
        this.currentPage = 1;
        this.itemsPerPage = 3;
        this.totalPages = 1;
        this.allFeedbackData = [];
        
        this.init();
    }

    init() {
        this.loadFeedback();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Retry button
        document.getElementById('retryLoadFeedback').addEventListener('click', () => {
            this.loadFeedback();
        });
        
        // Pagination buttons
        this.prevBtn.addEventListener('click', () => {
            this.previousPage();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextPage();
        });
    }

    async loadFeedback() {
        try {
            this.showLoading();
            this.hideError();
            this.hideFeedback();
            this.hidePagination();

            // Get all approved feedback, ordered by timestamp (newest first)
			// ✅ Query: only approved feedback, newest first
			const snapshot = await this.feedbackCollection
			  .orderBy('CreateTime', 'desc')   // Use your existing field name
			  .get();

            if (snapshot.empty) {
                this.showNoReviews();
                return;
            }

            this.allFeedbackData = [];
            let totalRating = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                this.allFeedbackData.push(data);
                totalRating += data.Rating || 0;
            });

            // Calculate total pages
            this.totalPages = Math.ceil(this.allFeedbackData.length / this.itemsPerPage);
            this.currentPage = 1;

            // Display first page
            this.displayCurrentPage();
            this.calculateAndDisplayRatings(totalRating);
            
        } catch (error) {
            console.error('Error loading feedback:', error);
            this.showError();
        }
    }

    displayCurrentPage() {
        // Calculate start and end index for current page
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageData = this.allFeedbackData.slice(startIndex, endIndex);

        this.feedbackContainer.innerHTML = '';
        
        currentPageData.forEach((feedback, index) => {
            const card = this.createFeedbackCard(feedback, index);
            this.feedbackContainer.appendChild(card);
        });

        this.updatePaginationControls();
        this.hideLoading();
        this.showFeedback();
        
        // Show pagination only if there are multiple pages
        if (this.totalPages > 1) {
            this.showPagination();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayCurrentPage();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.displayCurrentPage();
        }
    }

    updatePaginationControls() {
        // Update page info text
        this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        
        // Update button states
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages;
    }

    createFeedbackCard(feedback, index) {
        const card = document.createElement('div');
        card.className = 'menu-item'; // Using your existing menu-item class for consistency
        card.style.animationDelay = `${index * 0.1}s`;

        const stars = this.generateStarRating(feedback.Rating);
        
        card.innerHTML = `
            <div class="customer-info">
                <div class="customer-details">
                    <h4>${this.escapeHtml(feedback.CustName || 'Anonymous')}</h4>
                    <div class="rating">
                        ${stars}
                    </div>
                </div>
            </div>
            <p class="feedback-text">"${this.escapeHtml(feedback.Content)}"</p>
            <div class="feedback-meta">
                <small class="feedback-date">${this.formatDate(feedback.CreateTime)}</small>
            </div>
        `;

        return card;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        // Half star
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        // Empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    calculateAndDisplayRatings(totalRating) {
        const averageRating = totalRating / this.allFeedbackData.length;
        const roundedAverage = Math.round(averageRating * 10) / 10;

        // Update average rating
        this.averageRating.textContent = roundedAverage.toFixed(1);

        // Update star display
        this.ratingStars.innerHTML = this.generateStarRating(roundedAverage);

        // Update review count
        this.reviewCount.textContent = `Based on ${this.allFeedbackData.length} reviews`;

        this.showRatingSummary();
    }

    formatDate(timestamp) {
        if (!timestamp) return '';
        
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show/hide methods
    showLoading() {
        this.loadingElement.style.display = 'block';
    }

    hideLoading() {
        this.loadingElement.style.display = 'none';
    }

    showError() {
        this.errorElement.style.display = 'block';
        this.hideLoading();
    }

    hideError() {
        this.errorElement.style.display = 'none';
    }

    showFeedback() {
        this.feedbackContainer.style.display = 'grid';
    }

    hideFeedback() {
        this.feedbackContainer.style.display = 'none';
    }

    showPagination() {
        this.paginationControls.style.display = 'flex';
    }

    hidePagination() {
        this.paginationControls.style.display = 'none';
    }

    showRatingSummary() {
        this.ratingSummary.style.display = 'block';
    }

    showNoReviews() {
        this.hideLoading();
        this.feedbackContainer.innerHTML = `
            <div class="no-reviews" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7a5c44;">
                <i class="fas fa-comment-slash" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience with 11am Coffee!</p>
            </div>
        `;
        this.showFeedback();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeedbackPagination();
});
	
	// feedback-form.js
	class FeedbackForm {
	  constructor() {
		this.form = document.getElementById('customerFeedbackForm');
		this.submitBtn = this.form.querySelector('.submit-btn');
		this.btnText = this.submitBtn.querySelector('.btn-text');
		this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');
		this.formMessage = document.getElementById('formMessage');
		
		this.init();
	  }

	  init() {
		this.form.addEventListener('submit', (e) => this.handleSubmit(e));
	  }

	  async handleSubmit(e) {
		e.preventDefault();
		
		// Validate form
		if (!this.validateForm()) {
		  return;
		}

		this.setLoadingState(true);

		try {
		  const formData = this.getFormData();
		  await this.saveToFirebase(formData);
		  this.showSuccess('Thank you for your feedback! Your review has been submitted.');
		  this.form.reset();
		} catch (error) {
		  console.error('Error submitting feedback:', error);
		  this.showError('Sorry, there was an error submitting your feedback. Please try again.');
		} finally {
		  this.setLoadingState(false);
		}
	  }

	  validateForm() {
		const requiredFields = this.form.querySelectorAll('[required]');
		let isValid = true;

		requiredFields.forEach(field => {
		  if (!field.value.trim()) {
			this.markInvalid(field);
			isValid = false;
		  } else {
			this.markValid(field);
		  }
		});

		// Check if rating is selected
		const ratingSelected = this.form.querySelector('input[name="rating"]:checked');
		if (!ratingSelected) {
		  this.showError('Please select a rating.');
		  isValid = false;
		}

		return isValid;
	  }

	  markInvalid(field) {
		field.style.borderColor = '#dc3545';
	  }

	  markValid(field) {
		field.style.borderColor = '#28a745';
	  }

	  getFormData() {
		const formData = new FormData(this.form);
		return {
		  CustName: formData.get('customerName'),
		  CustEmail: formData.get('customerEmail') || '',
		  OrderId: formData.get('orderId') || '',
		  Rating: parseInt(formData.get('rating')),
		  Content: formData.get('feedbackText'),
		  CreateTime: new Date().toISOString(),
		  Approved: false // Admin must approve before showing publicly
		};
	  }

	  async saveToFirebase(feedbackData) {
		// Make sure db is available from your firebase-config.js
		const docRef = await db.collection('CustomerFeedback').add(feedbackData);
		console.log('Feedback saved with ID: ', docRef.id);
		return docRef;
	  }

	  setLoadingState(isLoading) {
		if (isLoading) {
		  this.btnText.style.display = 'none';
		  this.loadingSpinner.style.display = 'block';
		  this.submitBtn.disabled = true;
		} else {
		  this.btnText.style.display = 'block';
		  this.loadingSpinner.style.display = 'none';
		  this.submitBtn.disabled = false;
		}
	  }

	  showSuccess(message) {
		this.formMessage.textContent = message;
		this.formMessage.className = 'form-message success';
		this.formMessage.style.display = 'block';
		
		setTimeout(() => {
		  this.formMessage.style.display = 'none';
		}, 5000);
	  }

	  showError(message) {
		this.formMessage.textContent = message;
		this.formMessage.className = 'form-message error';
		this.formMessage.style.display = 'block';
	  }
	}

	// Initialize when DOM is loaded
	document.addEventListener('DOMContentLoaded', () => {
	  new FeedbackForm();
	});
	  