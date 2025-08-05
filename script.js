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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 class="mt-4 text-2xl font-bold">You are now checked in!</h2>
                <p class="mt-2 text-gray-600">Welcome to Shaver Industries.</p>
                <p class="mt-4 text-sm text-gray-500">Returning to home screen in 3 seconds...</p>
            </div>
        `;
        
        setTimeout(() => {
            // Restore the original form
            checkInView.innerHTML = checkInViewOriginalContent;
            // Re-attach the event listener to the new form element
            document.getElementById('check-in-form').addEventListener('submit', handleCheckInFormSubmit);
            showView('home-view');
        }, 3000);
    }
    
    // Attach the initial event listener
    document.getElementById('check-in-form').addEventListener('submit', handleCheckInFormSubmit);


    // --- Current Visitors Logic ---
    function displayCurrentVisitors(visitors) {
        const list = document.getElementById('current-visitors-list');
        list.innerHTML = '';
        document.getElementById('current-visitors-count').textContent = `${visitors.length} visitors currently checked in`;

        if (visitors.length === 0) {
            list.innerHTML = '<div class="text-center text-gray-400 p-8"><svg class="mx-auto h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clip-rule="evenodd"></path></svg><p class="mt-2 text-sm">No current visitors yet</p></div>';
            return;
        }

        visitors.forEach(visitor => {
            const checkInDate = new Date(visitor.checkInTime);
            const timeDiff = Math.round((new Date() - checkInDate) / 60000); // Difference in minutes
            
            const item = document.createElement('div');
            item.className = 'bg-gray-100 p-4 rounded-lg flex items-center shadow border border-gray-400';
            item.innerHTML = `
                <div class="h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full mr-4 text-sm font-bold text-gray-700">
                    ${visitor.firstName[0].toUpperCase()}${visitor.lastName[0].toUpperCase()}
                </div>
                <div>
                    <h3 class="font-bold">${visitor.firstName} ${visitor.lastName}</h3>
                    <p class="text-sm text-gray-500">${visitor.purpose} ${visitor.companyName ? `at ${visitor.companyName}` : ''}</p>
                    <p class="text-xs text-gray-400">${visitor.contact || 'No contact info provided'}</p>
                </div>
                <div class="ml-auto text-right text-sm">
                    <p class="text-gray-500">Checked in at</p>
                    <p class="text-red-600 font-bold">${checkInDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                    <p class="text-xs text-gray-400">${timeDiff}m ago</p>
                </div>
            `;
            list.appendChild(item);
        });
    }

    const searchCurrentInput = document.getElementById('search-current');
    searchCurrentInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVisitors = currentVisitors.filter(visitor => 
            visitor.firstName.toLowerCase().includes(searchTerm) || 
            visitor.lastName.toLowerCase().includes(searchTerm) ||
            (visitor.companyName && visitor.companyName.toLowerCase().includes(searchTerm))
        );
        displayCurrentVisitors(filteredVisitors);
    });

    document.getElementById('refresh-current').addEventListener('click', () => {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        displayCurrentVisitors(currentVisitors);
    });

    // --- Check-Out Logic ---
    function displayCheckoutList(visitors) {
        const list = document.getElementById('checkout-list');
        list.innerHTML = '';
        
        if (visitors.length === 0) {
             list.innerHTML = '<div class="text-center text-gray-400 p-8"><p class="mt-2 text-sm">No visitors to check out.</p></div>';
            return;
        }

        visitors.forEach(visitor => {
            const checkInDate = new Date(visitor.checkInTime);
            const item = document.createElement('div');
            item.className = 'bg-gray-100 p-4 rounded-lg flex items-center shadow cursor-pointer border border-gray-400';
            item.innerHTML = `
                <div class="h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full mr-4 text-sm font-bold text-gray-700">
                    ${visitor.firstName[0].toUpperCase()}${visitor.lastName[0].toUpperCase()}
                </div>
                <div>
                    <h3 class="font-bold">${visitor.firstName} ${visitor.lastName}</h3>
                    <p class="text-sm text-gray-500">${visitor.purpose} ${visitor.companyName ? `at ${visitor.companyName}` : ''}</p>
                    <p class="text-xs text-gray-400">${visitor.contact || 'No contact info provided'}</p>
                </div>
                <div class="ml-auto text-right text-sm">
                    <p class="text-gray-500">Checked in at</p>
                    <p class="text-red-600 font-bold">${checkInDate.toLocaleTimeString('en-US', { hour: 'numeric
