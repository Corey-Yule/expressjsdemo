document.addEventListener('DOMContentLoaded', () => {
  const raw = document.getElementById('missions-data')?.textContent;
  if (!raw) return;

  const missions = JSON.parse(raw);

  const dailyList  = document.getElementById('daily-missions');
  const weeklyList = document.getElementById('weekly-missions');

  const daily  = missions.filter(m => m.missions?.type === 'DAILY');
  const weekly = missions.filter(m => m.missions?.type === 'WEEKLY');

  function formatExpiry(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now  = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    return `Expires in ${diffDays} days`;
  }

  function renderMissions(list, container) {
    if (!list.length) {
      container.innerHTML = '<li class="mission-item"><span class="mission-description">No missions found.</span></li>';
      return;
    }

    list.forEach(m => {
      const li = document.createElement('li');
      li.classList.add('mission-item');

      li.innerHTML = `
        <div class="mission-info">
          <span class="mission-description">${m.missions.description}</span>
          <span class="mission-expiry">${formatExpiry(m.deletion_date)}</span>
        </div>
        <button class="mission-complete-btn" data-id="${m.id}">Complete</button>
      `;

      container.appendChild(li);
    });
  }

  renderMissions(daily,  dailyList);
  renderMissions(weekly, weeklyList);

  document.querySelectorAll('.mission-complete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.target;
      button.textContent = '✓ Done';
      button.disabled = true;
      button.closest('li').classList.add('mission-completed');
      // TODO: POST /missions/:id/complete
    });
  });
});