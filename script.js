document.getElementById('fetch-btn').addEventListener('click', fetchThumbnail);
document.getElementById('download-btn').addEventListener('click', processDownload);

let currentUrls = {};
let currentVideoId = "";

function fetchThumbnail() {
    const urlInput = document.getElementById('yt-url').value;
    currentVideoId = extractVideoID(urlInput);

    if (currentVideoId) {
        currentUrls = {
            maxres: `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`,
            hq: `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`,
            mq: `https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`
        };

        document.getElementById('thumbnail-preview').src = currentUrls.maxres;
        document.getElementById('result-area').classList.remove('hidden');
    } else {
        alert("Please enter a valid YouTube URL.");
    }
}

function extractVideoID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}

async function processDownload() {
    const btn = document.getElementById('download-btn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    const selectedRes = document.getElementById('resolution-select').value;
    const selectedFormat = document.getElementById('format-select').value;
    const sourceUrl = currentUrls[selectedRes];
    
    // An array of proxies. If one fails, the code tries the next one.
    const proxyUrls = [
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(sourceUrl)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(sourceUrl)}`
    ];

    let blob = null;

    // Loop through proxies until one successfully returns the image data
    for (let proxy of proxyUrls) {
        try {
            const response = await fetch(proxy);
            if (response.ok) {
                const tempBlob = await response.blob();
                // Ensure the proxy actually returned an image, not an error page
                if (tempBlob.type.startsWith('image/')) {
                    blob = tempBlob;
                    break; // Success! Exit the loop.
                }
            }
        } catch (error) {
            console.warn("A proxy failed, trying the next available server...");
        }
    }

    // If all proxies are completely blocked by network/adblockers
    if (!blob) {
        alert("Browser security is blocking the format conversion right now. Opening the standard image instead.");
        window.open(sourceUrl, '_blank');
        btn.innerText = "Download";
        btn.disabled = false;
        return;
    }

    // Proceed with format conversion using the successfully fetched data
    const img = new Image();
    const imgUrl = URL.createObjectURL(blob);
    
    img.onload = function() {
        try {
            if (selectedFormat === 'pdf') {
                generatePDF(img);
            } else {
                convertAndDownloadImage(img, selectedFormat);
            }
        } catch (err) {
            alert("Conversion failed. Please try downloading as a JPG.");
        } finally {
            URL.revokeObjectURL(imgUrl);
            btn.innerText = "Download";
            btn.disabled = false;
        }
    };
    
    img.onerror = function() {
        alert("Failed to read the image data. Please try again.");
        btn.innerText = "Download";
        btn.disabled = false;
    };
    
    img.src = imgUrl;
}

function convertAndDownloadImage(img, format) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL(format, 1.0);
    let extension = format.split('/')[1]; 
    if (extension === 'jpeg') extension = 'jpg';
    
    const fileName = `DarkLobby_Thumbnail_${currentVideoId}.${extension}`;
    triggerDownload(dataUrl, fileName);
}

function generatePDF(img) {
    const { jsPDF } = window.jspdf;
    const orientation = img.width > img.height ? 'l' : 'p';
    const doc = new jsPDF(orientation, 'px', [img.width, img.height]);
    
    doc.addImage(img, 'JPEG', 0, 0, img.width, img.height);
    doc.save(`DarkLobby_Thumbnail_${currentVideoId}.pdf`);
}

function triggerDownload(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}