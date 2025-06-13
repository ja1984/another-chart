export default class PieChart extends HTMLElement {
    draw(ctx, width, height, data) {
        const total = data.reduce((a, b) => a + b, 0);
        let startAngle = 0;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 4;
        const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"];

        data.forEach((val, i) => {
            const angle = (val / total) * 2 * Math.PI;
            ctx.fillStyle = colors[i % colors.length] + "aa";
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
            ctx.closePath();
            ctx.fill();
            startAngle += angle;
        });
    }
}