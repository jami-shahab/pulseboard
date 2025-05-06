document.addEventListener('DOMContentLoaded', () => {
    console.log("Simple Pulseboard Demo Initializing...");

    // --- Selectors ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const commitChartContainer = document.getElementById('commit-chart');
    const leaderboardBody = document.getElementById('leaderboard-body');

    // --- Mock Data ---
    const mockContributors = [
        { rank: 1, avatarUrl: 'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%238b5cf6"/></svg>', name: 'Alice C.', commits: 250, additions: 10500, deletions: 3200 },
        { rank: 2, avatarUrl: 'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%236366f1"/></svg>', name: 'Bob Developer', commits: 180, additions: 8100, deletions: 1500 },
        { rank: 3, avatarUrl: 'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%23a78bfa"/></svg>', name: 'Charlie Fixit', commits: 150, additions: 5000, deletions: 5800 },
        { rank: 4, avatarUrl: 'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%23818cf8"/></svg>', name: 'Diana Eng.', commits: 120, additions: 4200, deletions: 900 },
        { rank: 5, avatarUrl: 'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%237c3aed"/></svg>', name: 'Ethan F.', commits: 115, additions: 3800, deletions: 750 },
        { rank: 6, avatarUrl: 'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%234f46e5"/></svg>', name: 'Grace H.', commits: 95, additions: 3100, deletions: 600 },
    ];

    const mockCommitData = [
        { day: 'Mon', commits: 60 },
        { day: 'Tue', commits: 80 },
        { day: 'Wed', commits: 50 },
        { day: 'Thu', commits: 90 },
        { day: 'Fri', commits: 75 },
        { day: 'Sat', commits: 30 },
        { day: 'Sun', commits: 20 },
    ];

    // --- Tab Switching Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.dataset.tab;

            // Deactivate all buttons and hide all content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));

            // Activate clicked button and show corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(`${targetTabId}-tab`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });

    // --- Populate Leaderboard ---
    function populateLeaderboard(contributors) {
        if (!leaderboardBody) {
            console.error("Leaderboard body not found!");
            return;
        }
        leaderboardBody.innerHTML = ''; // Clear previous entries

        contributors.forEach((contributor, index) => {
            console.log(`Processing contributor ${index}:`, contributor); // Log contributor data
            const row = document.createElement('tr');
            row.style.animationDelay = `${index * 80}ms`; // Stagger animation

            // Create cells individually for potentially better parsing
            const rankCell = document.createElement('td');
            rankCell.textContent = contributor.rank;

            const contributorCell = document.createElement('td');
            contributorCell.innerHTML = `
                <div class="contributor-cell">
                    <span class="avatar-svg-container"> 
                        ${contributor.avatarUrl.replace('data:image/svg+xml,', '')} 
                    </span>
                    <span>${contributor.name}</span>
                </div>`;

            const commitsCell = document.createElement('td');
            commitsCell.textContent = contributor.commits;

            const additionsCell = document.createElement('td');
            additionsCell.className = 'additions';
            additionsCell.textContent = `+${contributor.additions.toLocaleString()}`;

            const deletionsCell = document.createElement('td');
            deletionsCell.className = 'deletions';
            deletionsCell.textContent = `-${contributor.deletions.toLocaleString()}`;

            row.appendChild(rankCell);
            row.appendChild(contributorCell);
            row.appendChild(commitsCell);
            row.appendChild(additionsCell);
            row.appendChild(deletionsCell);

            leaderboardBody.appendChild(row);
        });
        console.log("Finished populating leaderboard.");
    }

    // --- Render Commit Chart ---
    function renderCommitChart(commitData) {
        if (!commitChartContainer) return;
        commitChartContainer.innerHTML = ''; // Clear previous bars

        // Create tooltip element (once)
        const tooltip = document.createElement('div');
        tooltip.className = 'commit-tooltip';
        document.body.appendChild(tooltip); // Append to body for positioning

        const maxCommits = Math.max(...commitData.map(d => d.commits), 0);
        if (maxCommits <= 0) return;

        commitData.forEach((data, index) => {
            const heightPercentage = (data.commits / maxCommits) * 100;
            const isWeekend = data.day === 'Sat' || data.day === 'Sun';

            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';

            const bar = document.createElement('div');
            bar.className = 'bar';
            if (isWeekend) {
                bar.classList.add('weekend');
            }
            bar.style.height = `${heightPercentage}%`;
            bar.style.animationDelay = `${index * 100}ms`; // Slightly adjusted delay
            bar.dataset.commits = data.commits; // Store commit count

            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = data.day;

            barWrapper.appendChild(bar);
            barWrapper.appendChild(label);

            // --- Tooltip Listeners ---
            barWrapper.addEventListener('mouseover', (event) => {
                const targetBar = event.currentTarget.querySelector('.bar');
                if (!targetBar) return;

                const commits = targetBar.dataset.commits;
                tooltip.textContent = `${commits} commits`;

                // Position tooltip above the bar
                const rect = targetBar.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`; // 5px offset

                tooltip.classList.add('visible');
            });

            barWrapper.addEventListener('mouseout', () => {
                tooltip.classList.remove('visible');
            });
            // --- End Tooltip Listeners ---

            commitChartContainer.appendChild(barWrapper);
        });
        console.log("Finished rendering commit chart bars.");
    }

    // --- Initial Population ---
    try {
        populateLeaderboard(mockContributors);
        renderCommitChart(mockCommitData);
        console.log("Simple Pulseboard Demo Initialized Successfully.");
    } catch (error) {
        console.error("Error during initialization:", error);
    }

    // --- Mini Chart Tooltip Logic ---
    const miniChartTooltip = document.createElement('div');
    miniChartTooltip.className = 'mini-chart-tooltip'; // Use a different class
    document.body.appendChild(miniChartTooltip);

    const miniChartElements = document.querySelectorAll('.mini-chart [data-value], .mini-chart svg[data-value]');

    miniChartElements.forEach(el => {
        el.addEventListener('mouseover', (event) => {
            const value = event.target.dataset.value;
            if (!value) return;

            miniChartTooltip.textContent = value;

            // Position tooltip near the element
            const rect = event.target.getBoundingClientRect();
            let top = rect.top - miniChartTooltip.offsetHeight - 8; // Above element
            let left = rect.left + rect.width / 2; // Centered horizontally

            // Prevent going off-screen (basic adjustment)
            if (top < 0) top = rect.bottom + 8; // Position below if no space above
            if (left + miniChartTooltip.offsetWidth / 2 > window.innerWidth) {
                left = window.innerWidth - miniChartTooltip.offsetWidth / 2 - 10;
            }
            if (left - miniChartTooltip.offsetWidth / 2 < 0) {
                left = miniChartTooltip.offsetWidth / 2 + 10;
            }

            miniChartTooltip.style.left = `${left}px`;
            miniChartTooltip.style.top = `${top}px`;
            miniChartTooltip.classList.add('visible');
        });

        el.addEventListener('mouseout', () => {
            miniChartTooltip.classList.remove('visible');
        });
    });
}); 