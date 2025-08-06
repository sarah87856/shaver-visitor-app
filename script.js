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

    if (viewId === 'current-visitors-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCurrentVisitors(currentVisitors);
        document.getElementById('search-current').value = '';
    }
    if (viewId === 'past-visitors-view') {
        const pastVisitors = JSON.parse(localStorage.getItem('pastVisitors')) || [];
        displayPastVisitors(pastVisitors);
        document.getElementById('search-past').value = '';
    }
    if (viewId === 'check-out-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCheckoutList(currentVisitors);
        document.getElementById('search-checkout').value = '';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('check-in-button').addEventListener('click', () => showView('check-in-view'));
    document.getElementById('current-visitors-button').addEventListener('click', () => showView('current-visitors-view'));
    document.getElementById('check-out-button').addEventListener('click', () => showView('check-out-view'));
    document.getElementById('past-visitors-button').addEventListener('click', () => showView('past-visitors-view'));
    document.getElementById('back-to-home').addEventListener('click', () => showView('home-view'));

    const appContainer = document.getElementById('app-container');
    const allViews = document.querySelectorAll('#home-view, #check-in-view, #current-visitors-view, #check-out-view, #past-visitors-view');
    const backButton = document.getElementById('back-to-home');

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
    
    const checkInForm = document.getElementById('check-in-form');
    checkInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const phoneNumber = document.getElementById('phoneNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;

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
            contact: phoneNumber || emailAddress,
            checkInTime: new Date().toISOString(),
        };

        currentVisitors.push(newVisitor);
        localStorage.setItem('currentVisitors', JSON.stringify(currentVisitors));

        checkInForm.reset();

        const checkInView = document.getElementById('check-in-view');
        const checkInContainer = document.getElementById('check-in-container');
        checkInContainer.classList.add('hidden');
        const successMessage = document.createElement('div');
        successMessage.className = "p-6 text-center";
        successMessage.innerHTML = `
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 class="mt-4 text-2xl font-bold">You are now checked in!</h2>
            <p class="mt-2 text-gray-600">Welcome to Shaver Industries.</p>
            <p class="mt-4 text-sm text-gray-500">Returning to home screen in 3 seconds...</p>
        `;
        checkInView.appendChild(successMessage);
        
        setTimeout(() => {
            checkInContainer.classList.remove('hidden');
            checkInView.removeChild(successMessage);
            showView('home-view');
        }, 3000);
    });

    function displayCurrentVisitors(visitors) {
        const list = document.getElementById('current-visitors-list');
        list.innerHTML = '';
        document.getElementById('current-visitors-count').textContent = `${visitors.length} visitors currently checked in`;

        if (visitors.length === 0) {
            list.innerHTML = '<div class="text-center text-gray-400 p-8"><svg class="mx-auto h-12 w-1
