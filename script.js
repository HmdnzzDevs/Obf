document.addEventListener('DOMContentLoaded', () => {
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    
    // Elemen Slider
    const slider = document.getElementById('protectionLevel');
    const sliderPercent = document.getElementById('sliderPercent');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');

    // Semua Checkbox
    const toggles = {
        mangle: document.getElementById('t-mangle'),
        strings: document.getElementById('t-strings'),
        minify: document.getElementById('t-minify'),
        numbers: document.getElementById('t-numbers'),
        control: document.getElementById('t-control'),
        flattening: document.getElementById('t-flattening'),
        deadcode: document.getElementById('t-deadcode'),
        antidebug: document.getElementById('t-antidebug')
    };

    // Fungsi canggih untuk mengubah UI berdasarkan nilai Slider (seperti di video)
    function updateSliderUI() {
        const val = parseInt(slider.value);
        sliderPercent.innerText = val + '%';
        
        let color, title, desc;

        // Reset semua toggle ke false terlebih dahulu
        Object.values(toggles).forEach(t => t.checked = false);

        if (val === 0) {
            color = '#9CA3AF'; // Abu-abu
            title = 'No automatic obfuscation enabled';
            desc = '';
        } else if (val <= 40) {
            color = '#3B82F6'; // Biru
            title = 'Active: Minify, Mangle Names, Encode Strings';
            desc = '';
            toggles.minify.checked = true;
            toggles.mangle.checked = true;
            toggles.strings.checked = true;
        } else if (val <= 60) {
            color = '#8B5CF6'; // Ungu
            title = 'Active: Minify, Mangle Names, Encode Strings, Encode Numbers';
            desc = '';
            toggles.minify.checked = true;
            toggles.mangle.checked = true;
            toggles.strings.checked = true;
            toggles.numbers.checked = true;
        } else if (val <= 80) {
            color = '#F59E0B'; // Oranye
            title = 'Advanced: Basic + XOR Encryption';
            desc = 'All basic + XOR cipher for strings + Control Flow';
            toggles.minify.checked = true;
            toggles.mangle.checked = true;
            toggles.strings.checked = true;
            toggles.numbers.checked = true;
            toggles.control.checked = true;
            document.getElementById('s-encryption').value = 'XOR Cipher';
        } else {
            color = '#EF4444'; // Merah
            title = 'Maximum Protection: All Techniques';
            desc = 'All features + anti-debugging measures (strongest protection)';
            Object.values(toggles).forEach(t => t.checked = true);
        }

        // Terapkan warna dinamis ke CSS Variables (untuk dot dan thumb slider)
        document.documentElement.style.setProperty('--thumb-color', color);
        statusTitle.innerText = title;
        statusDesc.innerText = desc;
    }

    // Panggil fungsi saat slider digeser
    slider.addEventListener('input', updateSliderUI);

    // API Call untuk tombol Obfuscate (Tetap terhubung ke Vercel API kamu)
    obfuscateBtn.addEventListener('click', async () => {
        const luaCode = inputCode.value.trim();
        if (!luaCode) return alert('Paste your Lua code first!');

        const btnText = document.querySelector('.btn-text');
        btnText.innerText = 'Processing...';
        obfuscateBtn.disabled = true;

        try {
            // Mengirim data ke API backend kamu di Vercel
            const response = await fetch('/api/obfuscate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    code: luaCode,
                    // Opsional: Kirim juga settingannya jika backend mendukung
                    level: slider.value
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            outputCode.value = data.obfuscatedCode;
        } catch (error) {
            console.error(error);
            alert('Make sure your backend API is deployed correctly on Vercel.');
        } finally {
            btnText.innerText = 'Obfuscate';
            obfuscateBtn.disabled = false;
        }
    });

    // Fitur Copy
    copyBtn.addEventListener('click', () => {
        if (!outputCode.value) return;
        navigator.clipboard.writeText(outputCode.value);
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copied!';
        setTimeout(() => copyBtn.innerHTML = originalHtml, 2000);
    });
});
