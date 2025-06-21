const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function validatePOMCoverage() {
  console.log(`${colors.bright}${colors.blue}🔍 POM Coverage Validation${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(30)}${colors.reset}\n`);
  
  try {
    // Read POM file and extract method names
    const pomFile = fs.readFileSync('./pom/JaceHomePage.js', 'utf8');
    const pomMethods = [];
    
    // Extract all async methods related to mobile menu
    const methodRegex = /async\s+(.*Menu[^(]*)\s*\(/g;
    let match;
    
    while ((match = methodRegex.exec(pomFile)) !== null) {
      pomMethods.push(match[1]);
    }
    
    console.log(`${colors.cyan}📋 Mobile Menu Methods in POM:${colors.reset}`);
    pomMethods.forEach((method, i) => {
      console.log(`${i + 1}. ${method}`);
    });
    
    // Read test file and check which methods are called
    const testFile = fs.readFileSync('./test-comprehensive-hamburger-menu.js', 'utf8');
    const calledMethods = [];
    
    pomMethods.forEach(method => {
      const regex = new RegExp(`homePage\\.${method}\\s*\\(`, 'g');
      if (regex.test(testFile)) {
        calledMethods.push(method);
      }
    });
    
    console.log(`\n${colors.cyan}✅ Methods Called in Tests:${colors.reset}`);
    calledMethods.forEach((method, i) => {
      console.log(`${i + 1}. ${method}`);
    });
    
    // Check coverage
    const uncoveredMethods = pomMethods.filter(method => !calledMethods.includes(method));
    
    console.log(`\n${colors.bright}📊 Coverage Summary:${colors.reset}`);
    console.log(`Total POM Methods: ${pomMethods.length}`);
    console.log(`Methods Covered: ${calledMethods.length}`);
    console.log(`Coverage: ${Math.round((calledMethods.length / pomMethods.length) * 100)}%`);
    
    if (uncoveredMethods.length === 0) {
      console.log(`\n${colors.green}🎉 100% COVERAGE ACHIEVED!${colors.reset}`);
      console.log(`${colors.green}All POM mobile menu methods are tested.${colors.reset}`);
      return true;
    } else {
      console.log(`\n${colors.yellow}⚠️ Uncovered Methods:${colors.reset}`);
      uncoveredMethods.forEach((method, i) => {
        console.log(`${i + 1}. ${method}`);
      });
      return false;
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Validation failed:${colors.reset}`, error.message);
    return false;
  }
}

// Run validation
validatePOMCoverage()
  .then((success) => {
    if (success) {
      console.log(`\n${colors.green}✅ POM coverage validation passed!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`\n${colors.red}❌ POM coverage validation failed!${colors.reset}`);
      process.exit(1);
    }
  });