document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('.btn-login');
    const getStartedBtn = document.querySelector('.btn-get-started');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');
    const getStartedForm = document.getElementById('getstarted-form');
    const signupStep1 = document.getElementById('signup-step1');
    const signupStep2 = document.getElementById('signup-step2');
    const signupStep3 = document.getElementById('signup-step3');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLoginLinks = document.querySelectorAll('#switch-to-login');
    const continueSignup = document.getElementById('continue-signup');
    const continueStep2 = document.getElementById('continue-step2');
    const submitSignup = document.getElementById('submit-signup');
    const cardDonor = document.getElementById('card-donor');
    const cardNGO = document.getElementById('card-ngo');
    const orgNameGroup = document.getElementById('orgname-group');
    let selectedAccountType = null;

    function showModal(formType) {
        modal.style.display = 'flex';
        loginForm.style.display = 'none';
        getStartedForm.style.display = 'none';
        signupStep1.style.display = 'none';
        signupStep2.style.display = 'none';
        signupStep3.style.display = 'none';

        if (formType === 'login') loginForm.style.display = 'block';
        if (formType === 'getstarted') signupStep1.style.display = 'block';
        if (formType === 'step2') signupStep2.style.display = 'block';
        if (formType === 'step3') signupStep3.style.display = 'block';
    }

    loginBtn.addEventListener('click', () => showModal('login'));
    getStartedBtn.addEventListener('click', () => showModal('getstarted'));
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    switchToSignup.addEventListener('click', e => {
        e.preventDefault();
        showModal('getstarted');
    });
    switchToLoginLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showModal('login');
        });
    });

    if (cardDonor && cardNGO && continueSignup && orgNameGroup) {
        continueSignup.disabled = true;

        cardDonor.addEventListener('click', () => {
            selectedAccountType = 'donor';
            cardDonor.classList.add('selected');
            cardNGO.classList.remove('selected');
            orgNameGroup.style.display = 'none';
            continueSignup.disabled = false;
        });

        cardNGO.addEventListener('click', () => {
            selectedAccountType = 'ngo';
            cardNGO.classList.add('selected');
            cardDonor.classList.remove('selected');
            orgNameGroup.style.display = 'block';
            continueSignup.disabled = false;
        });

        continueSignup.addEventListener('click', () => {
            if (selectedAccountType) {
                showModal('step2');
            } else {
                alert("Please choose an account type.");
            }
        });
    }

    if (continueStep2) {
        continueStep2.addEventListener('click', () => {
            showModal('step3');
        });
    }

    if (submitSignup) {
        submitSignup.addEventListener('click', async function (e) {
            e.preventDefault();
            const fullName = document.getElementById('signup-fullname').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const password = document.getElementById('signup-password').value;
            const accountType = selectedAccountType;
            const orgName = accountType === 'ngo' ? document.getElementById('signup-orgname').value.trim() : '';
            const address1 = document.getElementById('signup-address1').value.trim();
            const address2 = '';
            const city = document.getElementById('signup-city').value.trim();
            const state = document.getElementById('signup-state').value.trim();
            const postal = document.getElementById('signup-postal').value.trim();

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password, phone, accountType, orgName, address1, address2, city, state, postal })
                });
                const data = await response.json();
                if (response.ok && data.token) {
                    localStorage.setItem('leflin_token', data.token);
                    localStorage.setItem('leflin_user', JSON.stringify(data.user));
                    window.location.href = '/dashboard.html';
                } else {
                    alert(data.message || 'Signup failed');
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        });
    }

    const loginSubmit = document.getElementById('login-submit');
    if (loginSubmit) {
        loginSubmit.addEventListener('click', async function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            if (!email || !password) {
                alert('Please enter email and password');
                return;
            }
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok && data.token) {
                    localStorage.setItem('leflin_token', data.token);
                    localStorage.setItem('leflin_user', JSON.stringify(data.user));
                    window.location.href = '/dashboard.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        });
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
