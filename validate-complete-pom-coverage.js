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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

async function validateCompletePOMCoverage() {
  console.log(`${colors.bright}${colors.blue}🔍 Complete POM Coverage Validation${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(40)}${colors.reset}\n`);
  
  try {
    // Read POM file and extract all method names
    const pomFile = fs.readFileSync('./pom/JaceHomePage.js', 'utf8');
    const allPomMethods = [];
    
    // Extract all async methods (covers all POM methods)
    const methodRegex = /async\s+(\w+)\s*\(/g;
    let match;
    
    while ((match = methodRegex.exec(pomFile)) !== null) {
      // Skip constructor and any non-method functions
      if (match[1] !== 'constructor') {
        allPomMethods.push(match[1]);
      }
    }
    
    console.log(`${colors.cyan}📋 All POM Methods Found:${colors.reset}`);
    allPomMethods.forEach((method, i) => {
      console.log(`${i + 1}. ${method}`);
    });
    
    // Read comprehensive test file and check which methods are called
    const testFile = fs.readFileSync('./test-comprehensive-pom-coverage.js', 'utf8');
    const testedMethods = [];
    
    allPomMethods.forEach(method => {
      // Look for both pomInstance.method() and await pomInstance.method() patterns
      const regex = new RegExp(`pomInstance\\.${method}\\s*\\(`, 'g');
      if (regex.test(testFile)) {
        testedMethods.push(method);
      }
    });
    
    console.log(`\n${colors.cyan}✅ Methods Tested in Comprehensive Test:${colors.reset}`);
    testedMethods.forEach((method, i) => {
      console.log(`${i + 1}. ${method}`);
    });
    
    // Check for any missing methods
    const missingMethods = allPomMethods.filter(method => !testedMethods.includes(method));
    
    console.log(`\n${colors.bright}📊 Coverage Summary:${colors.reset}`);
    console.log(`Total POM Methods: ${allPomMethods.length}`);
    console.log(`Methods Tested: ${testedMethods.length}`);
    console.log(`Coverage: ${Math.round((testedMethods.length / allPomMethods.length) * 100)}%`);
    
    if (missingMethods.length === 0) {
      console.log(`\n${colors.green}🎉 100% COVERAGE ACHIEVED!${colors.reset}`);
      console.log(`${colors.green}All ${allPomMethods.length} POM methods are tested in the comprehensive test suite.${colors.reset}`);
      
      // Also validate hamburger menu specific coverage
      const hamburgerMethods = allPomMethods.filter(method => 
        method.toLowerCase().includes('menu') || 
        method.toLowerCase().includes('mobile')
      );
      
      // Read hamburger menu test file
      const hamburgerTestFile = fs.readFileSync('./test-comprehensive-hamburger-menu.js', 'utf8');
      const hamburgerTestedMethods = [];
      
      hamburgerMethods.forEach(method => {
        const regex = new RegExp(`homePage\\.${method}\\s*\\(`, 'g');
        if (regex.test(hamburgerTestFile)) {
          hamburgerTestedMethods.push(method);
        }
      });
      
      console.log(`\n${colors.cyan}🍔 Hamburger Menu Specific Coverage:${colors.reset}`);
      console.log(`Hamburger Menu Methods: ${hamburgerMethods.length}`);
      console.log(`Tested in Hamburger Suite: ${hamburgerTestedMethods.length}`);
      console.log(`Hamburger Coverage: ${Math.round((hamburgerTestedMethods.length / hamburgerMethods.length) * 100)}%`);
      
      // Check latest test results
      const resultsDir = '.test-results/pom-coverage';
      const files = fs.readdirSync(resultsDir);
      const latestFile = files
        .filter(f => f.endsWith('.json'))
        .sort()
        .pop();
      
      if (latestFile) {
        const resultsPath = path.join(resultsDir, latestFile);
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        console.log(`\n${colors.cyan}📈 Latest Test Results:${colors.reset}`);
        console.log(`Test File: ${latestFile}`);
        console.log(`Pass Rate: ${results.summary?.passRate || 'N/A'}%`);
        console.log(`Total Tests: ${results.summary?.total || 'N/A'}`);
        console.log(`Passed: ${results.summary?.passed || 'N/A'}`);
        console.log(`Failed: ${results.summary?.failed || 'N/A'}`);
        console.log(`Warnings: ${results.summary?.warnings || 'N/A'}`);
        
        if (results.summary?.passRate === 100 && results.summary?.failed === 0) {
          console.log(`\n${colors.green}✨ PERFECT SCORE! All tests pass with 100% success rate!${colors.reset}`);
        }
      }
      
      return true;
    } else {
      console.log(`\n${colors.yellow}⚠️ Missing Methods:${colors.reset}`);
      missingMethods.forEach((method, i) => {
        console.log(`${i + 1}. ${method}`);
      });
      
      console.log(`\n${colors.yellow}🔧 Recommendations:${colors.reset}`);
      console.log(`Add the missing ${missingMethods.length} methods to test-comprehensive-pom-coverage.js`);
      
      return false;
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Validation failed:${colors.reset}`, error.message);
    return false;
  }
}

// Run validation
validateCompletePOMCoverage()
  .then((success) => {
    if (success) {
      console.log(`\n${colors.green}✅ Complete POM coverage validation passed!${colors.reset}`);
      console.log(`${colors.bright}${colors.green}🏆 ACHIEVEMENT UNLOCKED: 100% POM Test Coverage!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`\n${colors.red}❌ Complete POM coverage validation failed!${colors.reset}`);
      process.exit(1);
    }
  });