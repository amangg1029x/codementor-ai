/**
 * Static Code Analysis Engine
 * Analyzes code for common issues before AI evaluation
 */

class StaticAnalyzer {
  
  analyzeJavaScript(code) {
    return {
      nestedLoops: this.countNestedLoops(code),
      consoleLogs: this.countConsoleLogs(code),
      longFunctions: this.countLongFunctions(code),
      securityRisks: this.detectSecurityRisks(code),
      poorNaming: this.detectPoorNaming(code),
      missingErrorHandling: this.checkErrorHandling(code)
    };
  }

  analyzePython(code) {
    return {
      nestedLoops: this.countNestedLoopsPython(code),
      consoleLogs: this.countPrintStatements(code),
      longFunctions: this.countLongFunctionsPython(code),
      securityRisks: this.detectSecurityRisksPython(code),
      poorNaming: this.detectPoorNaming(code),
      missingErrorHandling: this.checkErrorHandlingPython(code)
    };
  }

  analyzeCpp(code) {
    return {
      nestedLoops: this.countNestedLoops(code),
      consoleLogs: this.countCoutStatements(code),
      longFunctions: this.countLongFunctionsCpp(code),
      securityRisks: this.detectSecurityRisksCpp(code),
      poorNaming: this.detectPoorNaming(code),
      missingErrorHandling: this.checkErrorHandlingCpp(code)
    };
  }

  // JavaScript specific checks
  countNestedLoops(code) {
    const forLoopPattern = /for\s*\([^)]*\)/g;
    const whileLoopPattern = /while\s*\([^)]*\)/g;
    
    let maxNesting = 0;
    let currentNesting = 0;
    
    const lines = code.split('\n');
    lines.forEach(line => {
      if (forLoopPattern.test(line) || whileLoopPattern.test(line)) {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      }
      if (line.includes('}')) {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    });
    
    return maxNesting >= 3 ? maxNesting : 0;
  }

  countConsoleLogs(code) {
    const matches = code.match(/console\.log/g);
    return matches ? matches.length : 0;
  }

  countLongFunctions(code) {
    const functionPattern = /function\s+\w+\s*\([^)]*\)\s*{|const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{|\w+\s*\([^)]*\)\s*{/g;
    let count = 0;
    let currentFunctionLines = 0;
    let inFunction = false;
    let braceCount = 0;
    
    const lines = code.split('\n');
    lines.forEach(line => {
      if (functionPattern.test(line)) {
        inFunction = true;
        currentFunctionLines = 1;
        braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      } else if (inFunction) {
        currentFunctionLines++;
        braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        
        if (braceCount === 0) {
          if (currentFunctionLines > 50) {
            count++;
          }
          inFunction = false;
        }
      }
    });
    
    return count;
  }

  detectSecurityRisks(code) {
    let risks = 0;
    
    // Check for hardcoded credentials
    const credentialPatterns = [
      /password\s*=\s*["'][^"']+["']/gi,
      /api[_-]?key\s*=\s*["'][^"']+["']/gi,
      /secret\s*=\s*["'][^"']+["']/gi,
      /token\s*=\s*["'][^"']+["']/gi
    ];
    
    credentialPatterns.forEach(pattern => {
      if (pattern.test(code)) risks++;
    });
    
    // Check for eval usage
    if (/eval\s*\(/.test(code)) risks++;
    
    // Check for SQL injection risks
    if (/SELECT.*FROM.*WHERE.*\+/.test(code)) risks++;
    
    return risks;
  }

  detectPoorNaming(code) {
    let issues = 0;
    
    // Check for single letter variables (except common i, j, k in loops)
    const varPattern = /(const|let|var)\s+([a-z])\s*=/g;
    const matches = code.match(varPattern);
    if (matches) {
      issues += matches.filter(m => !m.includes(' i =') && !m.includes(' j =') && !m.includes(' k =')).length;
    }
    
    // Check for generic names
    const genericNames = ['temp', 'tmp', 'data', 'val', 'foo', 'bar', 'test'];
    genericNames.forEach(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      const nameMatches = code.match(regex);
      if (nameMatches && nameMatches.length > 2) issues++;
    });
    
    return issues;
  }

  checkErrorHandling(code) {
    const tryBlocks = (code.match(/try\s*{/g) || []).length;
    const catchBlocks = (code.match(/catch\s*\(/g) || []).length;
    
    // Check if there are async operations without error handling
    const asyncOps = (code.match(/await|\.then\(/g) || []).length;
    
    if (asyncOps > 0 && (tryBlocks === 0 || catchBlocks === 0)) {
      return 1;
    }
    
    return 0;
  }

  // Python specific checks
  countNestedLoopsPython(code) {
    let maxNesting = 0;
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*(for|while)\s+/.test(line)) {
        const indent = line.search(/\S/);
        let nesting = 1;
        
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j];
          const nextIndent = nextLine.search(/\S/);
          
          if (nextIndent <= indent) break;
          if (/^\s*(for|while)\s+/.test(nextLine) && nextIndent > indent) {
            nesting++;
            maxNesting = Math.max(maxNesting, nesting);
          }
        }
      }
    }
    
    return maxNesting >= 3 ? maxNesting : 0;
  }

  countPrintStatements(code) {
    const matches = code.match(/print\s*\(/g);
    return matches ? matches.length : 0;
  }

  countLongFunctionsPython(code) {
    let count = 0;
    const lines = code.split('\n');
    let inFunction = false;
    let functionStartIndent = 0;
    let functionLines = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (/^\s*def\s+\w+\s*\(/.test(line)) {
        if (inFunction && functionLines > 50) {
          count++;
        }
        inFunction = true;
        functionStartIndent = line.search(/\S/);
        functionLines = 1;
      } else if (inFunction) {
        const currentIndent = line.search(/\S/);
        if (line.trim() && currentIndent <= functionStartIndent) {
          if (functionLines > 50) {
            count++;
          }
          inFunction = false;
        } else {
          functionLines++;
        }
      }
    }
    
    if (inFunction && functionLines > 50) {
      count++;
    }
    
    return count;
  }

  detectSecurityRisksPython(code) {
    let risks = 0;
    
    // Check for hardcoded credentials
    const credentialPatterns = [
      /password\s*=\s*["'][^"']+["']/gi,
      /api[_-]?key\s*=\s*["'][^"']+["']/gi,
      /secret\s*=\s*["'][^"']+["']/gi
    ];
    
    credentialPatterns.forEach(pattern => {
      if (pattern.test(code)) risks++;
    });
    
    // Check for dangerous functions
    if (/eval\s*\(/.test(code)) risks++;
    if (/exec\s*\(/.test(code)) risks++;
    if (/pickle\.loads/.test(code)) risks++;
    
    return risks;
  }

  checkErrorHandlingPython(code) {
    const tryBlocks = (code.match(/try:/g) || []).length;
    const exceptBlocks = (code.match(/except/g) || []).length;
    
    // Check for file operations without error handling
    const fileOps = (code.match(/open\s*\(/g) || []).length;
    
    if (fileOps > 0 && (tryBlocks === 0 || exceptBlocks === 0)) {
      return 1;
    }
    
    return 0;
  }

  // C++ specific checks
  countCoutStatements(code) {
    const matches = code.match(/cout\s*<</g);
    return matches ? matches.length : 0;
  }

  countLongFunctionsCpp(code) {
    let count = 0;
    const functionPattern = /\w+\s+\w+\s*\([^)]*\)\s*{/;
    const lines = code.split('\n');
    let inFunction = false;
    let braceCount = 0;
    let functionLines = 0;
    
    lines.forEach(line => {
      if (functionPattern.test(line)) {
        inFunction = true;
        functionLines = 1;
        braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      } else if (inFunction) {
        functionLines++;
        braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        
        if (braceCount === 0) {
          if (functionLines > 50) {
            count++;
          }
          inFunction = false;
        }
      }
    });
    
    return count;
  }

  detectSecurityRisksCpp(code) {
    let risks = 0;
    
    // Check for dangerous functions
    if (/gets\s*\(/.test(code)) risks++;
    if (/strcpy\s*\(/.test(code)) risks++;
    if (/strcat\s*\(/.test(code)) risks++;
    if (/sprintf\s*\(/.test(code)) risks++;
    
    return risks;
  }

  checkErrorHandlingCpp(code) {
    const tryBlocks = (code.match(/try\s*{/g) || []).length;
    const catchBlocks = (code.match(/catch\s*\(/g) || []).length;
    
    // Check for file operations
    const fileOps = (code.match(/fopen|ifstream|ofstream/g) || []).length;
    
    if (fileOps > 0 && (tryBlocks === 0 || catchBlocks === 0)) {
      return 1;
    }
    
    return 0;
  }
}

module.exports = new StaticAnalyzer();
