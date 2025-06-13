import './AnotherChart';

const app = document.getElementById('app');

function render() {
  if (!app) return;
//   app.innerHTML = `
//   <another-chart labels="January, February, March, April, May, June, July" legend="top" begin-at-zero="false">
//     <ac-data-set data="[165, 50, 80, 81, 56, 55, 40]" label="Sample Data 1" color="#00ff00">
//       <ac-line-chart width="1"></ac-line-chart>
//     </ac-data-set>
//     <ac-data-set data="[110, 50, 20, 25, 30, 25, 30]" color="#F44336">
//       <ac-line-chart width="1"></ac-line-chart>
//     </ac-data-set>
//     <ac-data-set data="[100, 40, 10, 15, 10, 25, 30]" color="#900">
//       <ac-bar-chart width="1" color="#090#></ac-bar-chart>
//       <ac-line-chart width="1"></ac-line-chart>
//     </ac-data-set>
//     <ac-tooltip position="mouse"></ac-tooltip>
//   </another-chart>
//   `
// }
app.innerHTML = `
  <another-chart labels="January, February, March, April, May, June, July" legend="top" begin-at-zero="true">
    <ac-data-set data="[100, 40, 10, 15, 10, 25, 30]">
      <ac-bar-chart></ac-bar-chart>
      <ac-line-chart></ac-line-chart>
    </ac-data-set>
    <ac-tooltip position="mouse"></ac-tooltip>
    <ac-legend position="top"></ac-legend>
  </another-chart>
  `
}

render();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot.invalidate();
  });
}


