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
        const timeDiff = Math.round((new Date() - checkInDate) / 60000);
        
        // This is the fixed part: use a conditional to safely get the initials
        const initials = `${(visitor.firstName && visitor.firstName[0] ? visitor.firstName[0] : '').toUpperCase()}${(visitor.lastName && visitor.lastName[0] ? visitor.lastName[0] : '').toUpperCase()}`;

        const contactInfoHTML = `
            ${visitor.phoneNumber ? `<p class="text-xs text-gray-400">${visitor.phoneNumber}</p>` : ''}
            ${visitor.emailAddress ? `<p class="text-xs text-gray-400">${visitor.emailAddress}</p>` : ''}
        `;

        const item = document.createElement('div');
        item.className = 'bg-gray-100 p-4 rounded-lg flex items-center shadow border border-gray-400';
        item.innerHTML = `
            <div class="h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full mr-4 text-sm font-bold text-gray-700">
                ${initials}
            </div>
            <div>
                <h3 class="font-bold">${visitor.firstName} ${visitor.lastName}</h3>
                <p class="text-sm text-gray-500">${visitor.purpose} ${visitor.companyName ? `with ${visitor.companyName}` : ''}</p>
                ${contactInfoHTML}
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
