// Phone number validation function
function validatePhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Check if we have exactly 10 digits
    return digits.length === 10;
}

document.getElementById('phone').addEventListener('input', function(e) {
    const phone = e.target.value;
    if (phone && !validatePhoneNumber(phone)) {
        e.target.setCustomValidity('Please enter a valid 10-digit US phone number');
    } else {
        e.target.setCustomValidity('');
    }
});

document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const phoneInput = document.getElementById('phone');
    if (!validatePhoneNumber(phoneInput.value)) {
        phoneInput.setCustomValidity('Please enter a valid 10-digit US phone number');
        return;
    }

    // Get form values
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        streetAddress: document.getElementById('streetAddress').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value
    };

    const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3002' 
    : '/api';  // Change this line to use relative path

    // Then update the fetch call to:
    fetch(`${API_URL}/submit-application`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(data => {
        window.location.href = '/success.html';
    })
    .catch(error => {
        console.error('Submission error:', error);
        alert(error.message || 'Failed to send application. Please try again.');
    });
});
