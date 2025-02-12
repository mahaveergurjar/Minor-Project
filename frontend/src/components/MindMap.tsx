import React, { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface Node {
  id: string;
  label: string;
}

interface Link {
  source: string;
  target: string;
}

interface MindMapProps {
  nodes: Node[];
  links: Link[];
  central: string;
}

export default function MindMap({ nodes, links, central }: MindMapProps) {
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [nodeWidths, setNodeWidths] = useState<{ [key: string]: number }>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const textMeasureRef = useRef<HTMLDivElement>(null);

  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-red-500", "bg-pink-500"];
  const gradients = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-yellow-400 to-yellow-600",
    "from-red-400 to-red-600",
    "from-pink-400 to-pink-600",
  ];

  const getNodeColor = (index: number) => colors[index % colors.length];
  const getGradient = (index: number) => gradients[index % gradients.length];

  const calculateNodePositions = () => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const padding = 40;
    const levelSpacing = (width - padding * 2) / 3;
    const newPositions: NodePosition[] = [];

    const rootX = padding + 100;
    const rootY = height / 2;
    newPositions.push({ id: "central", x: rootX, y: rootY });

    const mainTopics = nodes.filter((node) => links.some((link) => link.source === "central" && link.target === node.id));
    const mainTopicSpacing = height / (mainTopics.length + 1);

    mainTopics.forEach((node, index) => {
      const x = rootX + levelSpacing;
      const y = mainTopicSpacing * (index + 1);
      newPositions.push({ id: node.id, x, y });

      const descriptions = nodes.filter((n) => links.some((link) => link.source === node.id && link.target === n.id));
      const subtopicSpacing = mainTopicSpacing / (descriptions.length + 1);
      const subtopicStartY = y - mainTopicSpacing / 2 + subtopicSpacing;

      descriptions.forEach((descNode, descIndex) => {
        newPositions.push({
          id: descNode.id,
          x: x + levelSpacing,
          y: subtopicStartY + descIndex * subtopicSpacing,
        });
      });
    });

    setPositions(newPositions);
  };

  useEffect(() => {
    calculateNodePositions();
    window.addEventListener("resize", calculateNodePositions);
    return () => window.removeEventListener("resize", calculateNodePositions);
  }, [nodes, links]);

  useEffect(() => {
    if (textMeasureRef.current) {
      const newWidths: { [key: string]: number } = {};
      nodes.forEach((node) => {
        textMeasureRef.current!.innerText = node.label;
        const width = Math.min(Math.max(textMeasureRef.current!.offsetWidth + 20, 80), 300);
        newWidths[node.id] = width;
      });
      setNodeWidths(newWidths);
    }
  }, [nodes]);

  const getNodePosition = (id: string) => positions.find((pos) => pos.id === id);

  const renderConnections = () => {
    return links.map((link, index) => {
      const sourcePos = getNodePosition(link.source);
      const targetPos = getNodePosition(link.target);

      if (sourcePos && targetPos) {
        const controlPoint1X = sourcePos.x + (targetPos.x - sourcePos.x) / 2;
        const controlPoint2X = controlPoint1X;

        return (
          <path
            key={`${sourcePos.id}-${targetPos.id}`}
            d={`M ${sourcePos.x} ${sourcePos.y} 
                C ${controlPoint1X} ${sourcePos.y} 
                  ${controlPoint2X} ${targetPos.y} 
                  ${targetPos.x} ${targetPos.y}`}
            fill="none"
            stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
            strokeWidth="3"
            className="transition-all duration-300"
          />
        );
      }
      return null;
    });
  };

  const renderNodes = (node: Node, index: number) => {
    const pos = getNodePosition(node.id);
    if (!pos) return null;

    const width = nodeWidths[node.id] || 100;

    return (
      <React.Fragment key={node.id}>
        <foreignObject x={pos.x - width / 2} y={pos.y - 20} width={width} height="40" className="overflow-visible">
          <div
            className={`flex items-center justify-center px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer
              bg-gradient-to-r ${getGradient(index)} text-white`}
            style={{ minWidth: "80px", maxWidth: "300px", borderRadius: "12px", boxShadow: "3px 3px 10px rgba(0,0,0,0.2)" }}
          >
            {node.label}
          </div>
        </foreignObject>
      </React.Fragment>
    );
  };

  return (
    <>
      <div ref={textMeasureRef} className="absolute invisible whitespace-nowrap px-4 py-2 font-medium"></div>
      
      <div className="card-hover bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mind Map</h2>
        </div>

        <div className="h-[1400px] bg-gray-50 rounded-lg overflow-hidden">
          <svg ref={svgRef} className="w-full h-full">
            {renderConnections()}
            {nodes.map((node, index) => renderNodes(node, index))}
          </svg>
        </div>
      </div>
    </>
  );
}
