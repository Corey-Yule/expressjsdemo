
const dailyMissionsList = [
    "Walk 10,000 steps",
    "Drink 8 glasses of water",
    "Read for 30 minutes",
    "Meditate for 15 minutes",
    "Cook a healthy meal",
    "Write in a journal",
    "Do 20 push-ups", 
    "Learn a new word",
];

const weeklyMissionsList = [
    "Go for a hike",
    "Try a new recipe",
    "Visit a museum",
    "Have a picnic in the park",
    "Attend a fitness class",
    "Volunteer for a local charity",
    "Start a new hobby",
    "Plan a weekend getaway",
];

function getNewMissions(list,count)
{
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function createMissionItem(text)
{
    const li = document.createElement("li");
    li.className = "mission-card not-done";

    li.innerHTML = `
        <span class="mission-icon">✕</span>
        <span class="mission-text">${text}</span>
    `;

    li.addEventListener("click", () => {
        li.classList.toggle("done");
        li.classList.toggle("not-done");

        const icon = li.querySelector(".mission-icon");
        icon.textContent = li.classList.contains("done") ? "✓" : "✕";

        checkAllMissionsCompleted();
    });

    return li;
}

function showMissions()
{
    const dailyList = document.getElementById("daily-missions");
    const weeklyList = document.getElementById("weekly-missions");
    const button = document.getElementById("new-missions-button");

    dailyList.innerHTML = "";
    weeklyList.innerHTML = "";
    button.style.display = "none";

    const dailyMissions = getNewMissions(dailyMissionsList, 3);
    const weeklyMissions = getNewMissions(weeklyMissionsList, 3);

    dailyMissions.forEach(mission => {
        dailyList.appendChild(createMissionItem(mission));
    });

    weeklyMissions.forEach(mission => {
        weeklyList.appendChild(createMissionItem(mission));
    });
}
function checkAllMissionsCompleted()
{
    const allMissions = document.querySelectorAll(".mission-card");
    const allDone  = [...allMissions].every(mission => mission.classList.contains("done"));

    const button = document.getElementById("new-missions-button");
    button.style.display = allDone ? "inline-block" : "none";
}

document.getElementById("new-missions-button").addEventListener("click",() => {
    showMissions();
    });

    showMissions();