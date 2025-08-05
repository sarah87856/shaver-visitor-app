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
    if (viewId === 'current-visitors-view') {
        const currentVisitors = JSON.parse(localStorage.getItem('currentVisitors')) || [];
        // This is the line that makes the list appear immediately
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

        // Clear form and go back to home view
        checkInForm.reset();
        showView('home-view');
    });

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
                </div>
                <div class="ml-auto text-right text-sm">
                    <p class="text-gray-500">Checked in at</p>
                    <p class="text-red-600 font-bold">${checkInDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                </div>
            `;
            item.onclick = () => checkOutVisitor(visitor.id);
            list.appendChild(item);
        });
    }

    function checkOutVisitor(visitorId) {
        const visitorIndex = currentVisitors.findIndex(v => v.id === visitorId);
        if (visitorIndex !== -1) {
            const visitor = currentVisitors[visitorIndex];
            visitor.checkOutTime = new Date().toISOString(); // Add check-out time
            
            // Move visitor from current to past
            currentVisitors.splice(visitorIndex, 1);
            pastVisitors.push(visitor);

            // Update localStorage
            localStorage.setItem('currentVisitors', JSON.stringify(currentVisitors));
            localStorage.setItem('pastVisitors', JSON.stringify(pastVisitors));

            // Refresh the view
            displayCheckoutList(currentVisitors);
        }
    }

    const searchCheckoutInput = document.getElementById('search-checkout');
    searchCheckoutInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVisitors = currentVisitors.filter(visitor => 
            visitor.firstName.toLowerCase().includes(searchTerm) || 
            visitor.lastName.toLowerCase().includes(searchTerm)
        );
        displayCheckoutList(filteredVisitors);
    });

    // --- Past Visitors Logic ---
    function displayPastVisitors(visitors) {
        const list = document.getElementById('past-visitors-list');
        list.innerHTML = '';
        document.getElementById('past-visitors-count').textContent = `${visitors.length} Past Visitors`;

        if (visitors.length === 0) {
            list.innerHTML = `<div id="no-past-visitors" class="text-center text-gray-400 p-8">
                <svg class="mx-auto h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clip-rule="evenodd"></path></svg>
                <p class="mt-2 text-sm">No past visitors yet</p>
                <p class="text-xs">Past check-outs will appear here</p>
            </div>`;
            return;
        }

        visitors.sort((a, b) => new Date(b.checkOutTime) - new Date(a.checkOutTime));

        visitors.forEach(visitor => {
            const checkInDate = new Date(visitor.checkInTime);
            const checkOutDate = new Date(visitor.checkOutTime);
            const item = document.createElement('div');
            item.className = 'bg-gray-100 p-4 rounded-lg flex items-center shadow border border-gray-400';
            item.innerHTML = `
                <div class="h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full mr-4 text-sm font-bold text-gray-700">
                    ${visitor.firstName[0].toUpperCase()}${visitor.lastName[0].toUpperCase()}
                </div>
                <div>
                    <h3 class="font-bold">${visitor.firstName} ${visitor.lastName}</h3>
                    <p class="text-sm text-gray-500">${visitor.purpose} ${visitor.companyName ? `at ${visitor.companyName}` : ''}</p>
                </div>
                <div class="ml-auto text-right text-sm">
                    <p class="text-gray-500">Check-in: ${checkInDate.toLocaleDateString('en-US')}</p>
                    <p class="text-gray-500">Checked out: ${checkOutDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                </div>
            `;
            list.appendChild(item);
        });
    }

    const searchPastInput = document.getElementById('search-past');
    searchPastInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVisitors = pastVisitors.filter(visitor => 
            visitor.firstName.toLowerCase().includes(searchTerm) || 
            visitor.lastName.toLowerCase().includes(searchTerm) ||
            (visitor.companyName && visitor.companyName.toLowerCase().includes(searchTerm))
        );
        displayPastVisitors(filteredVisitors);
    });

    document.getElementById('refresh-past').addEventListener('click', () => {
        const pastVisitors = JSON.parse(localStorage.getItem('pastVisitors')) || [];
        displayPastVisitors(pastVisitors);
    });

    // Initial view
    showView('home-view');
});
