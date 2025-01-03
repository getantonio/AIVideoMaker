async function generateScript() {
    const prompt = document.getElementById('scriptPrompt').value;
    const generateButton = document.querySelector('.generate-button');
    
    if (!prompt) {
        alert('Please enter a prompt first!');
        return;
    }
    
    try {
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt })
        });
        
        const data = await response.json();
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            document.getElementById('generatedScript').value = data.script;
        }
    } catch (error) {
        alert('Error generating script: ' + error);
    } finally {
        generateButton.disabled = false;
        generateButton.textContent = 'Generate Script';
    }
}

function copyScript() {
    const scriptText = document.getElementById('generatedScript').value;
    if (!scriptText) {
        alert('No script to copy!');
        return;
    }
    
    navigator.clipboard.writeText(scriptText)
        .then(() => alert('Script copied to clipboard!'))
        .catch(err => alert('Failed to copy script: ' + err));
}

function downloadScript() {
    const scriptText = document.getElementById('generatedScript').value;
    if (!scriptText) {
        alert('No script to download!');
        return;
    }
    
    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-script.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

async function generateVideo() {
    const script = document.getElementById('generatedScript').value;
    const videoStyle = document.getElementById('videoStyle').value;
    const duration = document.getElementById('duration').value;
    const voiceStyle = document.getElementById('voiceStyle').value;
    
    if (!script) {
        alert('Please generate a script first!');
        return;
    }
    
    const videoPreview = document.getElementById('videoPreview');
    const progressBar = document.querySelector('.progress');
    const resultVideo = document.getElementById('resultVideo');
    
    videoPreview.style.display = 'block';
    progressBar.style.width = '0%';
    resultVideo.style.display = 'none';
    
    try {
        const response = await fetch('/generate-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script,
                videoStyle,
                duration,
                voiceStyle
            })
        });
        
        if (!response.ok) throw new Error('Video generation failed');
        
        // Simulate progress (in real implementation, you'd use WebSocket for real-time progress)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                resultVideo.src = URL.createObjectURL(await response.blob());
                resultVideo.style.display = 'block';
            }
        }, 100);
        
    } catch (error) {
        alert('Error generating video: ' + error);
        videoPreview.style.display = 'none';
    }
} 