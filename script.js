const people = window.birthdays || [];

const list = document.getElementById('birthday-list');
const todayLabel = document.getElementById('today-label');

function formatDate(date) {
  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric'
  });
}

function getNextBirthday(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const today = new Date();
  const target = new Date(today.getFullYear(), month - 1, day);

  if (target < today) {
    target.setFullYear(today.getFullYear() + 1);
  }

  return target;
}

function getDaysUntil(targetDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next = new Date(targetDate);
  next.setHours(0, 0, 0, 0);
  const diff = Math.round((next - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function renderBirthdays() {
  const upcoming = people
    .map((person) => {
      const birthdayValue = person.date || person.birthday;
      const nextBirthday = getNextBirthday(birthdayValue);
      const daysLeft = getDaysUntil(nextBirthday);
      return {
        ...person,
        nextBirthday,
        daysLeft
      };
    })
    .filter((person) => person.daysLeft <= 7 && person.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  todayLabel.textContent = `Today is ${new Date().toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })}`;

  if (!upcoming.length) {
    list.innerHTML = '<div class="empty-state">No birthdays are coming up in the next 7 days.</div>';
    return;
  }

  list.innerHTML = upcoming
    .map((person) => {
      const dayText = person.daysLeft === 0 ? 'Today' : `${person.daysLeft} day${person.daysLeft === 1 ? '' : 's'}`;
      return `
        <article class="birthday-item">
          <div class="person-info">
            <strong>${person.name}</strong>
            <span>${formatDate(person.nextBirthday)}</span>
          </div>
          <div class="countdown-badge">${dayText}</div>
        </article>
      `;
    })
    .join('');
}

renderBirthdays();
