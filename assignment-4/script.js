document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const greetBtn = document.getElementById('greetBtn');
    const greeting = document.getElementById('greeting');
    const colorBoxes = document.querySelectorAll('.color-box');
    // Handle greet button click
    greetBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            greeting.textContent = `Hello, ${name}`;
        } else {
            greeting.textContent = 'Hello';
        }
    });
    // Handle pressing Enter in the input field
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            greetBtn.click();
        }
    });
    // Handle color box clicks
    colorBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const color = box.getAttribute('data-color');
            
            // Using slightly muted/premium hex codes for aesthetic purposes
            const colorMap = {
                'red': '#ef4444',
                'blue': '#3b82f6',
                'green': '#22c55e',
                'yellow': '#eab308'
            };
            box.style.backgroundColor = colorMap[color] || color;
            box.style.boxShadow = `0 10px 25px -5px ${colorMap[color]}80`;
        });
    });
});