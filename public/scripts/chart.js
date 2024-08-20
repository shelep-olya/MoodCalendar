const data = [25, 15, 10, 30, 20];
const labels = ['Happy', 'Sad', 'Angry', 'Excited', 'Calm'];
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

let gradient = '';
let start = 0;

data.forEach((percentage, index) => {
    const end = start + percentage;
    gradient += `${colors[index]} ${start}% ${end}%, `;
    start = end;
});

document.querySelector('.chart-container').style.background = `conic-gradient(${gradient.slice(0, -2)})`;
