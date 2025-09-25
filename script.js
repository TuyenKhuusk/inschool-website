document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const loginFormContainer = document.querySelector('.login-form-container');
    const registrationFormContainer = document.querySelector('.signup-form');
    const showLoginFormLink = document.getElementById('showLoginForm');
    const showRegistrationFormLink = document.getElementById('showRegistrationForm');
    const loginForm = document.getElementById('loginForm');
    const accountList = document.getElementById('accountList');

    // Load và hiển thị danh sách tài khoản khi trang được tải
    loadAccounts();

    // Hiển thị form đăng nhập và ẩn form đăng ký
    showLoginFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        registrationFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // Hiển thị form đăng ký và ẩn form đăng nhập
    showRegistrationFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        registrationFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    });

    // Xử lý đăng ký tài khoản
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            alert('Lỗi: Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Lỗi: Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng thử lại!');
            return;
        }

        // Lưu tài khoản vào localStorage
        saveAccount({ name, email, password });
        alert(`Chào mừng ${name}! Bạn đã đăng ký thành công. Bây giờ bạn có thể đăng nhập.`);
        
        // Chuyển sang form đăng nhập sau khi đăng ký thành công
        registrationFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
        registrationForm.reset();
    });

    // Xử lý đăng nhập
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;
        const accounts = getAccounts();
        
        const user = accounts.find(acc => acc.email === loginEmail && acc.password === loginPassword);

        if (user) {
            alert(`Đăng nhập thành công! Chào mừng bạn, ${user.name}.`);
            // Chuyển hướng đến trang chào mừng
            window.location.href = 'welcome.html';
        } else {
            alert('Email hoặc mật khẩu không chính xác. Vui lòng thử lại!');
        }
    });

    // Hàm lấy danh sách tài khoản từ localStorage
    function getAccounts() {
        const accounts = localStorage.getItem('inschool_accounts');
        return accounts ? JSON.parse(accounts) : [];
    }

    // Hàm lưu tài khoản mới vào localStorage
    function saveAccount(account) {
        const accounts = getAccounts();
        accounts.push(account);
        localStorage.setItem('inschool_accounts', JSON.stringify(accounts));
        loadAccounts(); // Cập nhật lại danh sách trên giao diện
    }

    // Hàm hiển thị danh sách tài khoản lên giao diện
    function loadAccounts() {
        const accounts = getAccounts();
        accountList.innerHTML = '';
        if (accounts.length === 0) {
            accountList.innerHTML = '<li>Chưa có tài khoản nào được tạo.</li>';
        } else {
            accounts.forEach(acc => {
                const li = document.createElement('li');
                li.textContent = `Tên: ${acc.name}, Email: ${acc.email}`;
                accountList.appendChild(li);
            });
        }
    }
});