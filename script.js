document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Định nghĩa biểu thức chính quy để kiểm tra mật khẩu
        // Mật khẩu phải có: ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Kiểm tra mật khẩu có đáp ứng yêu cầu không
        if (!passwordRegex.test(password)) {
            alert('Lỗi: Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt.');
            return;
        }

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            alert('Lỗi: Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng thử lại!');
            return;
        }

        // Gửi dữ liệu đến Netlify Function
        try {
            const response = await fetch('/.netlify/functions/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();

            if (response.ok) { // Kiểm tra trạng thái HTTP của response
                alert(`Chào mừng ${name}! Bạn đã đăng ký thành công. Bây giờ bạn có thể đăng nhập.`);
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
