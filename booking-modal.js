// UNIVERSAL BOOKING MODAL SYSTEM
// TRACKS ADVENTURE SAFARIS

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the booking modal system
    initBookingModal();
});

function initBookingModal() {
    // DOM Elements
    const bookingModal = document.getElementById('universalBookingModal');
    const closeModalBtn = document.getElementById('closeUniversalModal');
    const cancelBtn = document.getElementById('cancelUniversalBtn');
    const bookingForm = document.getElementById('universalBookingForm');
    const submitBtn = document.getElementById('submitUniversalBtn');
    const submitSpinner = document.getElementById('universalSubmitSpinner');
    
    // Seasonal pricing elements
    const seasonOptions = document.querySelectorAll('.season-option');
    const formSelectedSeason = document.getElementById('formSelectedSeason');
    const formPackagePrice = document.getElementById('formPackagePrice');
    
    // Form elements
    const firstNameInput = document.querySelector('input[name="first_name"]');
    const lastNameInput = document.querySelector('input[name="last_name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const countryInput = document.querySelector('input[name="country"]');
    const travelersSelect = document.getElementById('numberTravelersSelect');
    const monthSelect = document.querySelector('select[name="preferred_month"]');
    const yearSelect = document.querySelector('select[name="preferred_year"]');
    const termsCheckbox = document.getElementById('universalTermsAgreed');
    
    // Package details elements
    const modalSafariName = document.getElementById('modalSafariName');
    const modalSafariSubtitle = document.getElementById('modalSafariSubtitle');
    const summarySafariName = document.getElementById('summarySafariName');
    const summarySafariDuration = document.getElementById('summarySafariDuration');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryGroupSize = document.getElementById('summaryGroupSize');
    const summaryDifficulty = document.getElementById('summaryDifficulty');
    const summaryBestTime = document.getElementById('summaryBestTime');
    const summaryStartPoint = document.getElementById('summaryStartPoint');
    
    // Pricing elements
    const greenSeasonPrice = document.getElementById('greenSeasonPrice');
    const lowerSeasonPrice = document.getElementById('lowerSeasonPrice');
    const summaryGreenPrice = document.getElementById('summaryGreenPrice');
    const summaryLowerPrice = document.getElementById('summaryLowerPrice');
    
    // Deposit calculation elements
    const calcSeason = document.getElementById('calcSeason');
    const calcPricePerPerson = document.getElementById('calcPricePerPerson');
    const calcTravelersCount = document.getElementById('calcTravelersCount');
    const calcTotalCost = document.getElementById('calcTotalCost');
    const calcDepositAmount = document.getElementById('calcDepositAmount');
    const depositRequired = document.getElementById('depositRequired');
    
    // Hidden form fields
    const formSafariId = document.getElementById('formSafariId');
    const formSafariName = document.getElementById('formSafariName');
    const formSafariDuration = document.getElementById('formSafariDuration');
    
    // Current safari data
    let currentSafari = {
        id: '',
        name: '',
        priceGreen: 0,
        priceLower: 0,
        duration: '',
        groupSize: '',
        difficulty: '',
        bestTime: '',
        startPoint: ''
    };
    
    // ===== EVENT LISTENERS SETUP =====
    
    // Close modal buttons
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideBookingModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideBookingModal);
    }
    
    // Close modal when clicking outside
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                hideBookingModal();
            }
        });
    }
    
    // Escape key closes modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal.style.display === 'flex') {
            hideBookingModal();
        }
    });
    
    // Seasonal option selection
    if (seasonOptions) {
        seasonOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                seasonOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Update form values
                const season = this.getAttribute('data-season');
                const price = season === 'green' ? currentSafari.priceGreen : currentSafari.priceLower;
                
                formSelectedSeason.value = season;
                formPackagePrice.value = price;
                
                // Update season display in calculation
                if (calcSeason) {
                    calcSeason.textContent = season === 'green' ? 'Green Season' : 'Lower Season';
                }
                
                // Recalculate deposit
                calculateDeposit();
            });
        });
    }
    
    // Calculate deposit when travelers change
    if (travelersSelect) {
        travelersSelect.addEventListener('change', calculateDeposit);
    }
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitSpinner.style.display = 'block';
            submitBtn.innerHTML = '<div class="loading-spinner" id="universalSubmitSpinner"></div> Processing...';
            
            // Collect form data
            const formData = {
                safariId: formSafariId.value,
                safariName: formSafariName.value,
                firstName: document.querySelector('input[name="first_name"]').value,
                lastName: document.querySelector('input[name="last_name"]').value,
                email: document.querySelector('input[name="email"]').value,
                phone: document.querySelector('input[name="phone"]').value,
                country: document.querySelector('input[name="country"]').value,
                travelers: document.querySelector('select[name="number_travelers"]').value,
                season: formSelectedSeason.value,
                month: document.querySelector('select[name="preferred_month"]').value,
                year: document.querySelector('select[name="preferred_year"]').value,
                specialRequests: document.querySelector('textarea[name="special_requests"]').value,
                packagePrice: formPackagePrice.value,
                bookingDate: new Date().toISOString()
            };
            
            // Save form data to localStorage (for thank you page)
            localStorage.setItem('safariBookingData', JSON.stringify(formData));
            
            // Submit form to server
            setTimeout(() => {
                bookingForm.submit();
            }, 1500);
        });
    }
    
    // Real-time validation
    if (firstNameInput) firstNameInput.addEventListener('blur', validateField);
    if (lastNameInput) lastNameInput.addEventListener('blur', validateField);
    if (emailInput) emailInput.addEventListener('blur', validateField);
    if (phoneInput) phoneInput.addEventListener('blur', validateField);
    if (countryInput) countryInput.addEventListener('blur', validateField);
    if (travelersSelect) travelersSelect.addEventListener('change', validateField);
    if (monthSelect) monthSelect.addEventListener('change', validateField);
    if (yearSelect) yearSelect.addEventListener('change', validateField);
    if (termsCheckbox) termsCheckbox.addEventListener('change', validateField);
    
    // ===== UNIVERSAL BOOKING BUTTON HANDLER =====
    
    // Find ALL booking buttons on the page
    const bookingButtons = document.querySelectorAll('.book-safari-btn');
    
    // Attach click handlers to all booking buttons
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get safari data from data attributes
            const safariData = {
                id: this.getAttribute('data-safari-id') || '',
                name: this.getAttribute('data-safari-name') || 'Safari Package',
                priceGreen: parseFloat(this.getAttribute('data-price-green')) || 0,
                priceLower: parseFloat(this.getAttribute('data-price-lower')) || 0,
                duration: this.getAttribute('data-duration') || '',
                groupSize: this.getAttribute('data-group-size') || '',
                difficulty: this.getAttribute('data-difficulty') || '',
                bestTime: this.getAttribute('data-best-time') || '',
                startPoint: this.getAttribute('data-start-point') || ''
            };
            
            // Show modal with safari data
            showBookingModal(safariData);
        });
    });
    
    // ===== CORE FUNCTIONS =====
    
    // Show modal with safari data
    function showBookingModal(safariData) {
        if (!bookingModal) return;
        
        // Update current safari data
        currentSafari = { ...safariData };
        
        // Update modal content
        updateModalContent();
        
        // Show modal
        bookingModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            bookingModal.style.opacity = '1';
        }, 10);
        
        // Reset form
        resetForm();
        
        // Calculate initial deposit
        calculateDeposit();
    }
    
    // Hide modal
    function hideBookingModal() {
        if (!bookingModal) return;
        
        bookingModal.style.opacity = '0';
        setTimeout(() => {
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Update modal content with current safari data
    function updateModalContent() {
        // Update modal header
        if (modalSafariName) modalSafariName.textContent = `Book ${currentSafari.name}`;
        if (modalSafariSubtitle) modalSafariSubtitle.textContent = `Complete your booking for the ${currentSafari.name} safari`;
        
        // Update summary section
        if (summarySafariName) summarySafariName.textContent = currentSafari.name;
        if (summarySafariDuration) summarySafariDuration.textContent = currentSafari.duration;
        if (summaryDuration) summaryDuration.textContent = currentSafari.duration;
        if (summaryGroupSize) summaryGroupSize.textContent = currentSafari.groupSize;
        if (summaryDifficulty) summaryDifficulty.textContent = currentSafari.difficulty;
        if (summaryBestTime) summaryBestTime.textContent = currentSafari.bestTime;
        if (summaryStartPoint) summaryStartPoint.textContent = currentSafari.startPoint;
        
        // Update pricing
        if (greenSeasonPrice) greenSeasonPrice.textContent = `USD ${currentSafari.priceGreen}`;
        if (lowerSeasonPrice) lowerSeasonPrice.textContent = `USD ${currentSafari.priceLower}`;
        if (summaryGreenPrice) summaryGreenPrice.textContent = `USD ${currentSafari.priceGreen}`;
        if (summaryLowerPrice) summaryLowerPrice.textContent = `USD ${currentSafari.priceLower}`;
        
        // Update hidden form fields
        if (formSafariId) formSafariId.value = currentSafari.id;
        if (formSafariName) formSafariName.value = currentSafari.name;
        if (formSafariDuration) formSafariDuration.value = currentSafari.duration;
        
        // Set default price to green season
        if (formPackagePrice) formPackagePrice.value = currentSafari.priceGreen;
    }
    
    // Calculate deposit (25% of total)
    function calculateDeposit() {
        if (!travelersSelect) return;
        
        // Get selected season and price
        const selectedSeason = formSelectedSeason.value;
        const pricePerPerson = selectedSeason === 'green' ? currentSafari.priceGreen : currentSafari.priceLower;
        const travelers = parseInt(travelersSelect.value) || 2;
        const totalCost = pricePerPerson * travelers;
        const deposit = totalCost * 0.25;
        
        // Update calculation display
        if (calcSeason) {
            calcSeason.textContent = selectedSeason === 'green' ? 'Green Season' : 'Lower Season';
        }
        if (calcPricePerPerson) calcPricePerPerson.textContent = `USD ${pricePerPerson.toLocaleString()}`;
        if (calcTravelersCount) calcTravelersCount.textContent = travelers;
        if (calcTotalCost) calcTotalCost.textContent = `USD ${totalCost.toLocaleString()}`;
        if (calcDepositAmount) calcDepositAmount.textContent = `USD ${deposit.toLocaleString()}`;
        if (depositRequired) depositRequired.textContent = `USD ${deposit.toLocaleString()}`;
    }
    
    // Reset form to default state
    function resetForm() {
        if (bookingForm) {
            bookingForm.reset();
            
            // Set default values
            if (travelersSelect) travelersSelect.value = '2';
            if (yearSelect) yearSelect.value = '2026';
            
            // Reset seasonal selection to green
            if (seasonOptions) {
                seasonOptions.forEach(opt => opt.classList.remove('selected'));
                const greenOption = document.querySelector('.season-option.green');
                if (greenOption) greenOption.classList.add('selected');
            }
            
            if (formSelectedSeason) formSelectedSeason.value = 'green';
            if (formPackagePrice) formPackagePrice.value = currentSafari.priceGreen;
            
            // Clear errors
            document.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });
            document.querySelectorAll('.form-input.error, .form-select.error').forEach(input => {
                input.classList.remove('error');
            });
            
            // Enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Booking Inquiry<div class="loading-spinner" id="universalSubmitSpinner"></div>';
            }
            if (submitSpinner) submitSpinner.style.display = 'none';
        }
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        document.querySelectorAll('.form-input.error, .form-select.error').forEach(input => {
            input.classList.remove('error');
        });
        
        // Validate first name
        if (!firstNameInput.value.trim()) {
            document.getElementById('firstNameError').style.display = 'block';
            firstNameInput.classList.add('error');
            isValid = false;
        }
        
        // Validate last name
        if (!lastNameInput.value.trim()) {
            document.getElementById('lastNameError').style.display = 'block';
            lastNameInput.classList.add('error');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            document.getElementById('emailError').style.display = 'block';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        // Validate phone
        if (!phoneInput.value.trim()) {
            document.getElementById('phoneError').style.display = 'block';
            phoneInput.classList.add('error');
            isValid = false;
        }
        
        // Validate country
        if (!countryInput.value.trim()) {
            document.getElementById('countryError').style.display = 'block';
            countryInput.classList.add('error');
            isValid = false;
        }
        
        // Validate travelers
        if (!travelersSelect.value) {
            document.getElementById('travelersError').style.display = 'block';
            travelersSelect.classList.add('error');
            isValid = false;
        }
        
        // Validate month
        if (!monthSelect.value) {
            document.getElementById('monthError').style.display = 'block';
            monthSelect.classList.add('error');
            isValid = false;
        }
        
        // Validate year
        if (!yearSelect.value) {
            document.getElementById('yearError').style.display = 'block';
            yearSelect.classList.add('error');
            isValid = false;
        }
        
        // Validate terms
        if (!termsCheckbox.checked) {
            document.getElementById('termsError').style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Validate individual field
    function validateField(e) {
        const field = e.target;
        const fieldName = field.name || field.id;
        
        // Clear error for this field
        const errorId = fieldName === 'terms_agreed' ? 'termsError' : fieldName + 'Error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
            if (field.classList) {
                field.classList.remove('error');
            }
        }
        
        // Re-validate this field
        if (fieldName === 'first_name' && !field.value.trim()) {
            document.getElementById('firstNameError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'last_name' && !field.value.trim()) {
            document.getElementById('lastNameError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim() || !emailRegex.test(field.value)) {
                document.getElementById('emailError').style.display = 'block';
                field.classList.add('error');
            }
        } else if (fieldName === 'phone' && !field.value.trim()) {
            document.getElementById('phoneError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'country' && !field.value.trim()) {
            document.getElementById('countryError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'number_travelers' && !field.value) {
            document.getElementById('travelersError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'preferred_month' && !field.value) {
            document.getElementById('monthError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'preferred_year' && !field.value) {
            document.getElementById('yearError').style.display = 'block';
            field.classList.add('error');
        } else if (fieldName === 'terms_agreed' && !field.checked) {
            document.getElementById('termsError').style.display = 'block';
        }
    }
}