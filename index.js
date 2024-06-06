const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function runGitCommand(command) {
    try {
        execSync(command, { stdio: 'inherit', shell: 'cmd.exe' });
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

function createDummyCommits(date, numCommits) {
    for (let i = 0; i < numCommits; i++) {
        const filename = `dummy_${Date.now()}.txt`;
        fs.writeFileSync(filename, `Dummy commit for ${date}`);

        runGitCommand(`git add ${filename}`);
        runGitCommand(`set "GIT_COMMITTER_DATE=${date}" && git commit --date="${date}" -m "Dummy commit for ${date}"`);

        fs.unlinkSync(filename);
    }
}

rl.question('Enter the start date (YYYY-MM-DD): ', (startDateStr) => {
    rl.question('Enter the end date (YYYY-MM-DD): ', (endDateStr) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        let currentDate = startDate;

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString();
            const numCommits = Math.floor(Math.random() * 10);
            createDummyCommits(dateStr, numCommits);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        rl.close();
    });
});
