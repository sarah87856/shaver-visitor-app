// This is the correct way to make the function globally accessible.
// It must be defined outside of the DOMContentLoaded listener.
window.showView = function(viewId) {
    const appContainer = document.getElementById('app-container');
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

    // --- Check-In Logic ---
    const checkInForm = document.getElementById('check-in-form');
    checkInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newVisitor = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            companyName: document.getElementById('companyName').value,
            purpose: document.getElementById('purpose').value,
            contact: document.getElementById('phoneNumber').value || document.getElementById('emailAddress').value,
            checkInTime: new Date().toISOString(), // Store as ISO string for sorting
        };

        currentVisitors.push(newVisitor);
        localStorage.setItem('currentVisitors', JSON.stringify(currentVisitors));

        // Clear form
        checkInForm.reset();

        // Show a confirmation message before returning to home view
        const checkInView = document.getElementById('check-in-view');
        checkInView.innerHTML = `
            <div class="p-6 text-center">
                <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 class="mt-4 text-2xl font-bold">You are now checked in!</h2>
                <p class="mt-2 text-gray-600">Welcome to Shaver Industries.</p>
                <p class="mt-4 text-sm text-gray-500">Returning to home screen in 3 seconds...</p>
            </div>
        `;
        setTimeout(() => {
            // Restore the original form and go back to home
            checkInView.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-md text-gray-800">
                    <h2 class="text-2xl font-bold mb-2">Visitor Check-In</h2>
                    <p class="text-sm text-gray-500 mb-6">Please fill out your information to sign in</p>
                    <form id="check-in-form" class="space-y-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border border-gray-400">
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm
