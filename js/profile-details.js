document.getElementById('downloadQR').addEventListener('click', function() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        const link = document.createElement('a');
        link.download = 'my-qr-code.png';
        link.href = qrCanvas.toDataURL();
        link.click();
    }
});