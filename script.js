document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const loginFormContainer = document.querySelector('.login-form-container');
    const registrationFormContainer = document.querySelector('.signup-form');
    const showLoginFormLink = document.getElementById('showLoginForm');
    const showRegistrationFormLink = document.getElementById('showRegistrationForm');

    // Mở/đóng form đăng nhập và đăng ký
    showLoginFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        registrationFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    showRegistrationFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        registrationFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    });

    // Xử lý đăng ký tài khoản
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Định nghĩa biểu thức chính quy để kiểm tra mật khẩu
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            alert('Lỗi: Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Lỗi: Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng thử lại!');
            return;
        }

        // Gửi dữ liệu đến Netlify Function để lưu trữ
        try {
            const response = await fetch('/.netlify/functions/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) { // Kiểm tra trạng thái HTTP của response
                alert(`Chào mừng ${name}! Bạn đã đăng ký thành công.`);
                window.location.href = 'welcome.html';
            } else {
                alert('Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
        }
    });
});
