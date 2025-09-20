const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('urlInput');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (!url) {
        resultDiv.textContent = 'Please enter a URL.';
        return;
    }

    resultDiv.textContent = 'Processing...';

    try {
        const res = await fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await res.json();
        
        if (data.success) {
            resultDiv.innerHTML = `Link berhasil dibuat: <a href="${data.url}" target="_blank">${data.url}</a>`;
        } else {
            resultDiv.textContent = `Error: ${data.error}`;
        }
    } catch (err) {
        resultDiv.textContent = 'An unexpected error occurred.';
    }
});
