
const dailyMissionsList = [
    "Walk 10,000 steps",
    "Drink 2L of water",
    "Stretch for 10 minutes",
    "Do 20 push-ups",
    "Do 30 squats",
    "Hold a plank for 60 seconds",
    "Take a 20 minute walk",
    "Eat 5 servings of fruit or vegetables",
    "Avoid sugary drinks today",
    "Sleep at least 7 hours tonight",
    "Do a 10 minute core workout",
    "Take the stairs instead of the lift",
    "Do 15 minutes of yoga",
    "Go for a short jog",
];

const weeklyMissionsList = [
   "Complete 3 workouts this week",
    "Walk 35,000 steps this week",
    "Run or jog for 5km total",
    "Do 5 stretching sessions",
    "Go to the gym twice",
    "Complete a full body workout",
    "Burn 1500 calories through exercise",
    "Do a leg workout",
    "Do an upper body workout",
    "Try a new sport or activity",
    "Go for a long outdoor walk",
    "Complete 3 cardio sessions",
    "Do yoga twice this week",
    "Improve your plank time",
    "Take 3 active rest walks",
    "Avoid junk food for 3 days",
];

// Select a mission from a list randomly
function getNewMissions(list,count)
{
    // change the mission randomly
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    // return only 3 missions
    return shuffled.slice(0, count);
}

// Create a mission item
function createMissionItem(text)
{
    // By default, missions are not done 
    const li = document.createElement("li");
    li.className = "mission-card not-done";
    // Add icon and the text
    li.innerHTML = `
        <span class="mission-icon">✕</span>
        <span class="mission-text">${text}</span>
    `;
    // When a mission clicked, it changes to done
    li.addEventListener("click", () => {
        li.classList.toggle("done");
        li.classList.toggle("not-done");
        const icon = li.querySelector(".mission-icon");
        icon.textContent = li.classList.contains("done") ? "✓" : "✕";
        // check if all the missions are done
        checkAllMissionsCompleted();
    });

    return li;
}
// Create and show missions on the page
function showMissions()
{
    // Get the html elements
    const dailyList = document.getElementById("daily-missions");
    const weeklyList = document.getElementById("weekly-missions");
    const button = document.getElementById("new-missions-button");
    // Clear old missions
    dailyList.innerHTML = "";
    weeklyList.innerHTML = "";
    // Don't show the button until the missions are done
    button.style.display = "none";
    // Create 3 new missions for daily and weekly
    const dailyMissions = getNewMissions(dailyMissionsList, 3);
    const weeklyMissions = getNewMissions(weeklyMissionsList, 3);
    // Add the daily missions to the page
    dailyMissions.forEach(mission => {
        dailyList.appendChild(createMissionItem(mission));
    });
    // Add the weekly missions to the page
    weeklyMissions.forEach(mission => {
        weeklyList.appendChild(createMissionItem(mission));
    });
}
// Check if the missions are done
function checkAllMissionsCompleted()
{
    const allMissions = document.querySelectorAll(".mission-card");
    // All the missions are done
    const allDone  = [...allMissions].every(mission => mission.classList.contains("done"));

    // Display the button if all the missions are done
    const button = document.getElementById("new-missions-button");
    button.style.display = allDone ? "inline-block" : "none";
}
    // when the button is clicked, generate new missions
document.getElementById("new-missions-button").addEventListener("click",() => {
    showMissions();
    });

    // when the page loads, already have some missions ready
    showMissions();