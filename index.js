document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const form = document.querySelector('#form1');
    const fileInput = document.querySelector('#file');
    const infoText = document.getElementById('ptext');
    const textArea = document.getElementById('textArea');
    const copyBtn = document.querySelector('.copy');
    const closeBtn = document.querySelector('.close');
    const toasts = document.getElementById('toasts');

    const message = "Copied To Clipboard";

    const createNotification = (messageText = message) => {
        const notif = document.createElement('div');
        notif.classList.add('toast');
        notif.innerText = messageText;
        toasts.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 2500);
    };

    const fetchRequest = async (formData, file) => {
        try {
            infoText.innerText = "Scanning QR Code...";
            const response = await fetch("http://api.qrserver.com/v1/read-qr-code/", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            const qrData = result[0].symbol[0].data;
            infoText.innerText = qrData ? "Upload QR Code to Scan" : "Couldn't Scan QR Code";
            if (!qrData) return;

            textArea.innerText = qrData;
            form.querySelector("img").src = URL.createObjectURL(file);
            wrapper.classList.add("active");
        } catch {
            infoText.innerText = "Couldn't Scan QR Code";
        }
    };

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        fetchRequest(formData, file);
    });

    copyBtn.addEventListener("click", () => {
        const text = textArea.textContent;
        navigator.clipboard.writeText(text)
            .then(createNotification)
            .catch(err => console.error('Failed to copy text:', err));
    });

    form.addEventListener('click', () => {
        fileInput.click();
    });

    closeBtn.addEventListener("click", () => {
        wrapper.classList.remove("active");
        setTimeout(() => {
            window.location.reload();
        }, 550);
    });
});
