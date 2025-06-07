// Optional: Live clock
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('currentTime').textContent = `${hours}:${minutes} ${ampm}`;
}

updateTime();
setInterval(updateTime, 1000);

document.getElementById('downloadQR').addEventListener('click', function() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        const link = document.createElement('a');
        link.download = 'my-qr-code.png';
        link.href = qrCanvas.toDataURL();
        link.click();
    }
});