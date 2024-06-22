// JavaScript for handling the toggle switch and label text
const quarterToggle = document.getElementById('quarterToggle');
const quarterLabel = document.getElementById('quarterLabel');

quarterToggle.addEventListener('change', function() {
    if (this.checked) {
        quarterLabel.textContent = 'Q2';
    } else {
        quarterLabel.textContent = 'Q1';
    }
});
