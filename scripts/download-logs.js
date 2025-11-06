const fs = require('fs');
const path = require('path');

console.log('\n=== STEP 2: LOG ANALYSIS ===\n');

const logs = [
  'node-tidy-install.log',
  'node-tidy-output.log'
];

logs.forEach(logFileName => {
  const logFile = path.join(process.cwd(), logFileName);
  
  if (fs.existsSync(logFile)) {
    const logContent = fs.readFileSync(logFile, 'utf-8');
    console.log(`\n${'='.repeat(60)}`);
    console.log(`FILE: ${logFileName}`);
    console.log('='.repeat(60));
    console.log(logContent);
    console.log('='.repeat(60));
    console.log(`Location: ${logFile}`);
    console.log('='.repeat(60));
  } else {
    console.log(`\n⚠️  ${logFileName} not found`);
  }
});

console.log('\n=== ANALYSIS INSTRUCTIONS ===');
console.log('1. Review the logs above');
console.log('2. Identify ALL missing dependencies');
console.log('3. Prepare bulk installation command');
console.log('4. Execute: npm install [all-packages]');
console.log('='.repeat(60));
console.log('\nLog files available at:');
logs.forEach(log => {
  const fullPath = path.join(process.cwd(), log);
  if (fs.existsSync(fullPath)) {
    console.log(`  - ${fullPath}`);
  }
});
console.log('\n');
