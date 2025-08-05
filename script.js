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

    // Specific view logic
    // Now also handles automatic refreshing
    if (viewId === 'current-visitors-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCurrentVisitors(currentVisitors);
    }
    if (viewId === 'past-visitors-view') {
        const pastVisitors = JSON.parse(localStorage.getItem('pastVisitors')) || [];
        displayPastVisitors(pastVisitors);
    }
    if (viewId === 'check-out-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCheckoutList(currentVisitors);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // --- Helper Functions and Initial Setup ---
    const appContainer = document.getElementById('app-container');
    const allViews = document.querySelectorAll('#home-view, #check-in-view, #current-visitors-view, #check-out-view, #past-visitors-view');
    const backButton = document.getElementById('back-to-home');

    // Store the original content of the checkout view
    const checkoutViewOriginalContent = document.getElementById('check-out-view').innerHTML;
    const checkInViewOriginalContent = document.getElementById('check-in-view').innerHTML;


    // Load visitors from localStorage
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
    
    // Function to handle form submission logic
    function handleCheckInFormSubmit(e) {
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
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            companyName: document.getElementById('companyName').value,
            purpose: document.getElementById('purpose').value,
            contact: phoneNumber || emailAddress, // Store whichever is provided
            checkInTime: new Date().toISOString(), // Store as ISO string for sorting
        };

        currentVisitors.push(newVisitor);
        localStorage.setItem('currentVisitors', JSON.stringify(currentVisitors));

        // Clear form
        e.target.reset();

        // Show a confirmation message before returning to home view
        const checkInView = document.getElementById('check-in-view');
        checkInView.innerHTML = `
            <div class="p-6 text-center">
                <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
