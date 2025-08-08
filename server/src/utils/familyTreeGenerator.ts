import { Person, Relationship } from '../types';

interface TreeNode {
  id: string;
  person: Person;
  x: number;
  y: number;
  generation: number;
  children: TreeNode[];
  parents: TreeNode[];
  spouse?: TreeNode;
}

interface TreeLayout {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    data: { person: Person };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
    style?: any;
    label?: string;
  }>;
}

export class FamilyTreeGenerator {
  private persons: Person[];
  private relationships: Relationship[];
  private nodeMap: Map<string, TreeNode>;

  constructor(persons: Person[], relationships: Relationship[]) {
    this.persons = persons;
    this.relationships = relationships;
    this.nodeMap = new Map();
  }

  generateLayout(): TreeLayout {
    this.buildNodeMap();
    this.establishRelationships();
    const rootNodes = this.findRootNodes();
    const layout = this.calculatePositions(rootNodes);
    
    return {
      nodes: this.generateNodes(layout),
      edges: this.generateEdges()
    };
  }

  private buildNodeMap(): void {
    this.persons.forEach(person => {
      this.nodeMap.set(person.id, {
        id: person.id,
        person,
        x: 0,
        y: 0,
        generation: 0,
        children: [],
        parents: [],
      });
    });
  }

  private establishRelationships(): void {
    this.relationships.forEach(rel => {
      const person = this.nodeMap.get(rel.personId);
      const relatedPerson = this.nodeMap.get(rel.relatedPersonId);
      
      if (!person || !relatedPerson) return;

      switch (rel.type) {
        case 'PARENT':
          person.children.push(relatedPerson);
          relatedPerson.parents.push(person);
          break;
        case 'CHILD':
          person.parents.push(relatedPerson);
          relatedPerson.children.push(person);
          break;
        case 'SPOUSE':
          person.spouse = relatedPerson;
          relatedPerson.spouse = person;
          break;
      }
    });
  }

  private findRootNodes(): TreeNode[] {
    // Finde Personen ohne Eltern (Wurzeln des Baums)
    return Array.from(this.nodeMap.values()).filter(node => 
      node.parents.length === 0
    );
  }

  private calculatePositions(rootNodes: TreeNode[]): TreeNode[] {
    const HORIZONTAL_SPACING = 250;
    const VERTICAL_SPACING = 150;
    const processedNodes = new Set<string>();
    
    // Berechne Generationen
    this.calculateGenerations(rootNodes, 0, processedNodes);
    
    // Gruppiere nach Generationen
    const generations = new Map<number, TreeNode[]>();
    this.nodeMap.forEach(node => {
      if (!generations.has(node.generation)) {
        generations.set(node.generation, []);
      }
      generations.get(node.generation)!.push(node);
    });

    // Positioniere Knoten
    generations.forEach((nodes, generation) => {
      nodes.forEach((node, index) => {
        node.x = index * HORIZONTAL_SPACING;
        node.y = generation * VERTICAL_SPACING;
      });
    });

    return Array.from(this.nodeMap.values());
  }

  private calculateGenerations(nodes: TreeNode[], generation: number, processed: Set<string>): void {
    nodes.forEach(node => {
      if (processed.has(node.id)) return;
      
      node.generation = Math.max(node.generation, generation);
      processed.add(node.id);
      
      if (node.children.length > 0) {
        this.calculateGenerations(node.children, generation + 1, processed);
      }
    });
  }

  private generateNodes(layout: TreeNode[]) {
    return layout.map(node => ({
      id: node.id,
      type: 'person',
      position: { x: node.x, y: node.y },
      data: { person: node.person }
    }));
  }

  private generateEdges() {
    const edges: any[] = [];
    
    this.relationships.forEach(rel => {
      const edgeId = `${rel.personId}-${rel.relatedPersonId}`;
      
      switch (rel.type) {
        case 'PARENT':
          edges.push({
            id: edgeId,
            source: rel.personId,
            target: rel.relatedPersonId,
            type: 'smoothstep',
            style: { stroke: '#10B981', strokeWidth: 2 },
            label: 'Kind'
          });
          break;
        case 'SPOUSE':
          edges.push({
            id: edgeId,
            source: rel.personId,
            target: rel.relatedPersonId,
            type: 'straight',
            style: { stroke: '#F59E0B', strokeWidth: 3 },
            label: 'Partner'
          });
          break;
        case 'EX_SPOUSE':
          edges.push({
            id: edgeId,
            source: rel.personId,
            target: rel.relatedPersonId,
            type: 'straight',
            style: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '5,5' },
            label: 'Ex-Partner'
          });
          break;
      }
    });

    return edges;
  }
}