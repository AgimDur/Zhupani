import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PersonNode } from './PersonNode.tsx';
import { api } from '../../services/api.ts';
import toast from 'react-hot-toast';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthName?: string;
  birthYear?: number;
  deathYear?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  photo?: string;
  relationshipsFrom: Array<{
    id: string;
    type: string;
    relatedPerson: Person;
  }>;
}

interface FamilyTreeVisualizationProps {
  familyId: string;
  onPersonSelect?: (person: Person) => void;
}

const nodeTypes: NodeTypes = {
  person: PersonNode,
};

export const FamilyTreeVisualization: React.FC<FamilyTreeVisualizationProps> = ({
  familyId,
  onPersonSelect,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    loadFamilyData();
  }, [familyId]);

  const loadFamilyData = async () => {
    try {
      const response = await api.get(`/families/${familyId}`);
      const family = response.data;
      setPersons(family.persons);
      generateTreeLayout(family.persons);
    } catch (error) {
      toast.error('Fehler beim Laden der Familiendaten');
    } finally {
      setLoading(false);
    }
  };

  const generateTreeLayout = (persons: Person[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Erweiterte Layout-Logik
    const generations = new Map<number, Person[]>();
    const personGenerations = new Map<string, number>();
    
    // Finde Wurzelpersonen (ohne Eltern)
    const rootPersons = persons.filter(person => 
      !person.relationshipsFrom.some(rel => rel.type === 'CHILD')
    );

    // Berechne Generationen
    const calculateGeneration = (person: Person, generation: number, visited: Set<string>) => {
      if (visited.has(person.id)) return;
      visited.add(person.id);
      
      const currentGen = personGenerations.get(person.id) || generation;
      personGenerations.set(person.id, Math.max(currentGen, generation));
      
      // Kinder sind eine Generation tiefer
      person.relationshipsFrom
        .filter(rel => rel.type === 'PARENT')
        .forEach(rel => {
          calculateGeneration(rel.relatedPerson, generation + 1, visited);
        });
    };

    // Starte mit Wurzelpersonen
    rootPersons.forEach(person => calculateGeneration(person, 0, new Set()));
    
    // Gruppiere nach Generationen
    persons.forEach(person => {
      const gen = personGenerations.get(person.id) || 0;
      if (!generations.has(gen)) {
        generations.set(gen, []);
      }
      generations.get(gen)!.push(person);
    });

    // Positioniere Knoten
    const HORIZONTAL_SPACING = 280;
    const VERTICAL_SPACING = 180;
    
    generations.forEach((genPersons, generation) => {
      genPersons.forEach((person, index) => {
        const totalWidth = (genPersons.length - 1) * HORIZONTAL_SPACING;
        const startX = -totalWidth / 2;
        
        newNodes.push({
          id: person.id,
          type: 'person',
          position: { 
            x: startX + index * HORIZONTAL_SPACING, 
            y: generation * VERTICAL_SPACING 
          },
          data: {
            person,
            onSelect: onPersonSelect,
          },
        });
      });
    });

    // Erstelle Edges für Beziehungen
    persons.forEach(person => {
      person.relationshipsFrom.forEach((relationship) => {
        const edgeId = `${person.id}-${relationship.relatedPerson.id}`;
        
        switch (relationship.type) {
          case 'PARENT':
            newEdges.push({
              id: edgeId,
              source: person.id,
              target: relationship.relatedPerson.id,
              type: 'smoothstep',
              style: {
                stroke: '#10B981',
                strokeWidth: 2,
              },
              label: 'Kind',
              labelStyle: { fontSize: 12, fontWeight: 600 },
            });
            break;
          case 'SPOUSE':
            newEdges.push({
              id: edgeId,
              source: person.id,
              target: relationship.relatedPerson.id,
              type: 'straight',
              style: {
                stroke: '#F59E0B',
                strokeWidth: 3,
              },
              label: 'Partner',
              labelStyle: { fontSize: 12, fontWeight: 600 },
            });
            break;
          case 'EX_SPOUSE':
            newEdges.push({
              id: edgeId,
              source: person.id,
              target: relationship.relatedPerson.id,
              type: 'straight',
              style: {
                stroke: '#EF4444',
                strokeWidth: 2,
                strokeDasharray: '5,5',
              },
              label: 'Ex-Partner',
              labelStyle: { fontSize: 12, fontWeight: 600 },
            });
            break;
          case 'SIBLING':
            newEdges.push({
              id: edgeId,
              source: person.id,
              target: relationship.relatedPerson.id,
              type: 'step',
              style: {
                stroke: '#8B5CF6',
                strokeWidth: 2,
              },
              label: 'Geschwister',
              labelStyle: { fontSize: 12, fontWeight: 600 },
            });
            break;
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};