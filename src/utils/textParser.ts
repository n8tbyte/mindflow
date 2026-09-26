import { Node, Edge } from 'reactflow';

interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  depth: number;
  parentId: string | null;
}

let nodeCounter = 0;

function generateId(): string {
  nodeCounter++;
  return `node-${nodeCounter}-${Date.now()}`;
}

export function resetCounter() {
  nodeCounter = 0;
}

export function parseTextToTree(text: string): TreeNode | null {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) return null;

  const root: TreeNode = {
    id: generateId(),
    label: lines[0].trim(),
    children: [],
    depth: 0,
    parentId: null,
  };

  const stack: { node: TreeNode; indent: number }[] = [
    { node: root, indent: -1 },
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Calculate indent level (count leading spaces/tabs)
    const indent = line.search(/\S/);
    const label = trimmed;

    const newNode: TreeNode = {
      id: generateId(),
      label,
      children: [],
      depth: 0,
      parentId: null,
    };

    // Find the correct parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].node;
    newNode.parentId = parent.id;
    newNode.depth = parent.depth + 1;
    parent.children.push(newNode);
    stack.push({ node: newNode, indent });
  }

  return root;
}

// Count total descendants including the node itself
function countDescendants(node: TreeNode): number {
  let count = 1;
  node.children.forEach((child) => {
    count += countDescendants(child);
  });
  return count;
}

// Calculate the "height" of a subtree (number of leaf nodes)
function getSubtreeLeafCount(node: TreeNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + getSubtreeLeafCount(child), 0);
}

function flattenTree(
  node: TreeNode,
  nodes: Node[],
  edges: Edge[],
  positions: Map<string, { x: number; y: number }>
): void {
  nodes.push({
    id: node.id,
    type: 'mindMapNode',
    position: positions.get(node.id) || { x: 0, y: 0 },
    data: { label: node.label, depth: node.depth, id: node.id },
  });

  if (node.parentId) {
    edges.push({
      id: `edge-${node.parentId}-${node.id}`,
      source: node.parentId,
      target: node.id,
      type: 'smoothstep',
      style: { stroke: '#6366f1', strokeWidth: 2 },
    });
  }

  node.children.forEach((child) => flattenTree(child, nodes, edges, positions));
}

// Horizontal layout - tree goes left to right
function layoutHorizontal(node: TreeNode, positions: Map<string, { x: number; y: number }>): void {
  const xGap = 280;
  const yGap = 70;

  // Calculate subtree heights
  const subtreeHeight = new Map<string, number>();
  
  function calcHeight(n: TreeNode): number {
    if (n.children.length === 0) {
      subtreeHeight.set(n.id, yGap);
      return yGap;
    }
    const total = n.children.reduce((sum, child) => sum + calcHeight(child), 0);
    subtreeHeight.set(n.id, total);
    return total;
  }
  
  calcHeight(node);

  // Assign positions
  function assignPos(n: TreeNode, x: number, yCenter: number): void {
    positions.set(n.id, { x, y: yCenter });

    if (n.children.length === 0) return;

    const totalH = subtreeHeight.get(n.id) || yGap;
    let currentY = yCenter - totalH / 2;

    n.children.forEach((child) => {
      const childH = subtreeHeight.get(child.id) || yGap;
      const childYCenter = currentY + childH / 2;
      assignPos(child, x + xGap, childYCenter);
      currentY += childH;
    });
  }

  assignPos(node, 0, 0);
}

// Vertical layout - tree goes top to bottom
function layoutVertical(node: TreeNode, positions: Map<string, { x: number; y: number }>): void {
  const xGap = 200;
  const yGap = 120;

  // Calculate subtree widths
  const subtreeWidth = new Map<string, number>();
  
  function calcWidth(n: TreeNode): number {
    if (n.children.length === 0) {
      subtreeWidth.set(n.id, xGap);
      return xGap;
    }
    const total = n.children.reduce((sum, child) => sum + calcWidth(child), 0);
    subtreeWidth.set(n.id, Math.max(total, xGap));
    return Math.max(total, xGap);
  }
  
  calcWidth(node);

  // Assign positions
  function assignPos(n: TreeNode, y: number, xCenter: number): void {
    positions.set(n.id, { x: xCenter, y });

    if (n.children.length === 0) return;

    const totalW = subtreeWidth.get(n.id) || xGap;
    let currentX = xCenter - totalW / 2;

    n.children.forEach((child) => {
      const childW = subtreeWidth.get(child.id) || xGap;
      const childXCenter = currentX + childW / 2;
      assignPos(child, y + yGap, childXCenter);
      currentX += childW;
    });
  }

  assignPos(node, 0, 0);
}

// Radial layout - tree radiates from center
function layoutRadial(node: TreeNode, positions: Map<string, { x: number; y: number }>): void {
  const radiusStep = 220;

  positions.set(node.id, { x: 0, y: 0 });

  if (node.children.length === 0) return;

  const totalLeaves = getSubtreeLeafCount(node);
  let currentAngle = -Math.PI / 2; // Start from top

  function assignRadial(n: TreeNode, startAngle: number, endAngle: number, depth: number): void {
    if (n.children.length === 0) return;

    const totalChildLeaves = n.children.reduce(
      (sum, child) => sum + getSubtreeLeafCount(child),
      0
    );

    let angle = startAngle;
    const angleRange = endAngle - startAngle;

    n.children.forEach((child) => {
      const childLeaves = getSubtreeLeafCount(child);
      const childAngleRange = (childLeaves / totalChildLeaves) * angleRange;
      const midAngle = angle + childAngleRange / 2;
      
      const radius = depth * radiusStep;
      const x = Math.cos(midAngle) * radius;
      const y = Math.sin(midAngle) * radius;
      
      positions.set(child.id, { x, y });
      
      if (child.children.length > 0) {
        assignRadial(child, angle, angle + childAngleRange, depth + 1);
      }
      
      angle += childAngleRange;
    });
  }

  assignRadial(node, -Math.PI, Math.PI, 1);
}

export function parseTextToMindMap(
  text: string,
  layout: 'horizontal' | 'vertical' | 'radial' = 'horizontal'
): { nodes: Node[]; edges: Edge[] } {
  resetCounter();
  const tree = parseTextToTree(text);
  if (!tree) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const positions = new Map<string, { x: number; y: number }>();

  switch (layout) {
    case 'horizontal':
      layoutHorizontal(tree, positions);
      break;
    case 'vertical':
      layoutVertical(tree, positions);
      break;
    case 'radial':
      layoutRadial(tree, positions);
      break;
  }

  flattenTree(tree, nodes, edges, positions);

  return { nodes, edges };
}
