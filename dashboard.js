document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["gmailData"], data => {
    let emails = data.gmailData || [];
    if (typeof emails === "string") emails = JSON.parse(emails);

    if (!emails.length) return console.warn("No emails found in storage");

    // Pie Chart: Inbox vs Sent
    const typeCounts = emails.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {});
    new Chart(document.getElementById("pieChart"), {
      type: 'pie',
      data: {
        labels: Object.keys(typeCounts),
        datasets: [{ data: Object.values(typeCounts), backgroundColor: ['#4CAF50', '#2196F3'] }]
      },
      options: { responsive: false }
    });

    // Bar Chart: Emails per Day
    const dateCounts = {};
    emails.forEach(e => {
      const day = new Date(e.date).toLocaleDateString();
      dateCounts[day] = (dateCounts[day] || 0) + 1;
    });
    const sortedDays = Object.keys(dateCounts).sort((a,b)=>new Date(a)-new Date(b));
    new Chart(document.getElementById("barChart"), {
      type: 'bar',
      data: {
        labels: sortedDays,
        datasets: [{ label: 'Emails per Day', data: sortedDays.map(d=>dateCounts[d]), backgroundColor: '#07f41fff' }]
      },
      options: { responsive: false, scales: { y: { beginAtZero: true } } }
    });
  });
});
