// This is the correct way to make the function globally accessible.
// It must be defined outside of the DOMContentLoaded listener.
window.showView = function(viewId) {
    const allViews = document.querySelectorAll('#home-view, #check-in-view, #current-visitors-view, #check-out-view, #past-visitors-view');
    const backButton = document.getElementById('back-to-home');

    allViews.forEach(view => view.classList.add('hidden'));
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    if (viewId === 'home-view') {
        backButton.classList.add('hidden');
    } else {
        backButton.classList.remove('hidden');
    }

    // This section is now the reliable entry point for displaying data.
    // We will always re-fetch from localStorage to ensure it's up-to-date.
    if (viewId === 'current-visitors-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCurrentVisitors(currentVisitors);
        // Also ensure the search bar is cleared
        document.getElementById('search-current').value = '';
    }
    if (viewId === 'past-visitors-view') {
        const pastVisitors = JSON.parse(localStorage.getItem('pastVisitors')) || [];
        displayPastVisitors(pastVisitors);
        // Also ensure the search bar is cleared
        document.getElementById('search-past').value = '';
    }
    if (viewId === 'check-out-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCheckoutList(currentVisitors);
        // Also ensure the search bar is cleared
        document.getElementById('search-checkout').value = '';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // --- Helper Functions and Initial Setup ---
    const appContainer = document.getElementById('app-container');
    const allViews = document.querySelectorAll('#home-view, #check-in-view, #current-visitors-view, #check-out-view, #past-visitors-view');
    const backButton = document.getElementById('back-to-home');

    // Load visitors from localStorage (initial load, but functions below will re-fetch)
    let currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
    let pastVisitors = JSON.parse(localStorage.getItem('pastVisitors')) || [];

    function updateTime() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
        const dateString = now.toLocaleDateString('en-US', optionsDate);
        const timeString = now.toLocaleTimeString('en-US', optionsTime);

        const currentTimeElement = document.getElementById('current-time');
        const currentDateElement = document.getElementById('current-date');

        if (currentTimeElement) currentTimeElement.textContent = timeString;
        if (currentDateElement) currentDateElement.textContent = `${dateString} at ${timeString}`;
    }

    setInterval(updateTime, 1000);
    updateTime();
    
    // --- Check-In Logic ---
    const checkInForm = document.getElementById('check-in-form');
    checkInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get contact info fields
        const phoneNumber = document.getElementById('phoneNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;

        // Validation for mandatory contact info
        if (!phoneNumber && !emailAddress) {
            const validationMessage = document.getElementById('contact-validation-message');
            validationMessage.textContent = 'Please provide either a phone number or email address.';
            validationMessage.classList.add('text-red-500');
            return;
        }

        const newVisitor = {
