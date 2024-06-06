const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const monthMap = {
    'jan': 0,
    'feb': 1,
    'mar': 2,
    'apr': 3,
    'may': 4,
    'jun': 5,
    'jul': 6,
    'aug': 7,
    'sep': 8,
    'oct': 9,
    'nov': 10,
    'dec': 11
};

function runGitCommand(command) {
    try {
        execSync(command, { stdio: 'inherit', shell: 'cmd.exe' });
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

function createDummyCommits(date, numCommits, email) {
    for (let i = 0; i < numCommits; i++) {
        const filename = `dummy_${Date.now()}.txt`;
        fs.writeFileSync(filename, `Dummy commit for ${date}`);

        runGitCommand(`git add ${filename}`);
        runGitCommand(`set "GIT_COMMITTER_DATE=${date}" && git commit --author="Your Name <${email}>" --date="${date}" -m "Dummy commit for ${date}"`);

        fs.unlinkSync(filename);
    }
}

function parseDateInput(input) {
    const [day, monthStr, year] = input.split(' ');
    const month = monthMap[monthStr.toLowerCase()];
    return new Date(year, month, day);
}

rl.question('Enter your GitHub email: ', (email) => {
    rl.question('Enter the start date (DD MMM YYYY): ', (startDateStr) => {
        rl.question('Enter the end date (DD MMM YYYY): ', (endDateStr) => {
            const startDate = parseDateInput(startDateStr);
            const endDate = parseDateInput(endDateStr);
            let currentDate = startDate;

            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString();
                const numCommits = Math.floor(Math.random() * 10);
                createDummyCommits(dateStr, numCommits, email);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            rl.close();

            runGitCommand('git push origin main');
        });
    });
});
