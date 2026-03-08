 // Chart Data
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];



  // ---- Sleep Chart ----
  new Chart(document.getElementById('sleepChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Sleep (hrs)",
        data: sleepData,
        borderColor: "#3d86ff",
        backgroundColor: "rgba(61,134,255,0.15)",
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          ticks: { color: "#e0e0e0" },
          grid: { color: "#333" }
        },
        x: {
          ticks: { color: "#e0e0e0" },
          grid: { color: "#333" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#e0e0e0" }
        }
      }
    }
  });

  // ---- Calorie Chart ----
  new Chart(document.getElementById('CalorieChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Calories",
        data: calsData,
        borderColor: "#00d084",
        backgroundColor: "rgba(0,208,132,0.15)",
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#e0e0e0" },
          grid: { color: "#333" }
        },
        x: {
          ticks: { color: "#e0e0e0" },
          grid: { color: "#333" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#e0e0e0" }
        }
      }
    }
  });

//Pie
new Chart(document.getElementById('pieChart'), {
  type: 'pie',
  data: {
    labels: ['Days Logged', 'Days Missed'],
    datasets: [{
      data: [weeklyData.days_logged ?? 0, 7 - (weeklyData.days_logged ?? 0)],
      backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Log Completion' }
    }
  }
});
