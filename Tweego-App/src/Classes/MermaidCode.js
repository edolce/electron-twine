const fs = require('fs');

class MermaidGenerator {
  constructor(tree) {
    this.tree = tree;
    this.result = ['graph TD']; // Initialize with the graph type
  }

  // Recursive function to traverse the tree and generate Mermaid code
  generateNodes(node) {
    if (!node || node.children.length === 0) return;

    // Loop through each child and create edges
    node.children.forEach(child => {
      this.result.push(`    ${node.passageName} --> ${child.passageName}`);
      this.generateNodes(child); // Recursively process the child nodes
    });
  }

  // Generate the entire Mermaid code
  generateMermaid() {
    this.generateNodes(this.tree); // Start the recursion from the root node
    return this.result.join('\n'); // Join the result array into a string
  }
}

// Example usage with your RoutineEvent
const routineEvent = JSON.parse(fs.readFileSync('routineEvent.json')); // Assuming routineEvent.json is generated as you mentioned

// Instantiate the MermaidGenerator with the root tree
const generator = new MermaidGenerator(routineEvent.tree);

// Generate the Mermaid code
const mermaidCode = generator.generateMermaid();

// Output the Mermaid code to a file or console
fs.writeFileSync('mermaidDiagram.mmd', mermaidCode); // Save to a Mermaid file
console.log(mermaidCode); // Or print to the console
