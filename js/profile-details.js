document.getElementById('downloadQR').addEventListener('click', function() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        const link = document.createElement('a');
        link.download = 'my-qr-code.png';
        link.href = qrCanvas.toDataURL();
        link.click();
    }
});

document.getElementById('back-btn').addEventListener('click', function() {
    window.location.href = 'user-dashboard.html';
});

// Redirect to another page on avatar click
document.getElementById("userBtn").addEventListener("click", function () {
    window.location.href = "profile-details.html";
});

document.getElementById('performance-btn').addEventListener('click', function () {
    window.location.href = 'performance.html';
});