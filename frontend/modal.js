document.addEventListener('DOMContentLoaded', function () {
    const donationForm = document.getElementById('donation-form');
    const myDonationsList = document.getElementById('my-donations-list');
    const successPopup = document.getElementById('success-popup');
    const closePopup = document.getElementById('close-popup');

    // Fetch and render My Donations
    async function loadMyDonations() {
        try {
            const token = localStorage.getItem('leflin_token');
            if (!token) return;

            const res = await fetch('/api/donations/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const donations = await res.json();

            myDonationsList.innerHTML = '';
            donations.forEach(d => {
                const li = document.createElement('li');
                li.textContent = `${d.title} - ${d.status}`;
                myDonationsList.appendChild(li);
            });
        } catch (err) {
            console.error('Error loading donations:', err);
        }
    }

    // Handle donation form submit
    if (donationForm) {
        donationForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const token = localStorage.getItem('leflin_token');
            if (!token) {
                alert('Please log in to create a donation.');
                return;
            }

            const donationData = {
                title: document.getElementById('donation-title').value.trim(),
                description: document.getElementById('donation-description').value.trim(),
                quantity: parseInt(document.getElementById('donation-quantity').value),
                foodType: document.getElementById('donation-foodtype').value.trim(),
                location: document.getElementById('donation-location').value.trim()
            };

            try {
                const res = await fetch('/api/donations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(donationData)
                });

                if (res.ok) {
                    donationForm.reset();
                    await loadMyDonations(); // Refresh the list
                    if (successPopup) successPopup.style.display = 'flex';
                } else {
                    const data = await res.json();
                    alert(data.message || 'Error creating donation');
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        });
    }

    // Close popup
    if (closePopup) {
        closePopup.addEventListener('click', () => {
            successPopup.style.display = 'none';
        });
    }

    // Load donations on page load
    loadMyDonations();
});
