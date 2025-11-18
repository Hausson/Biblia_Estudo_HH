import React, { useState } from 'react';
import { StudyNode } from '../types';
import { ChevronRightIcon, FileIcon, FolderIcon, PlusIcon, TrashIcon } from './Icons';

interface TreeViewProps {
  nodes: StudyNode[];
  level?: number;
  onAdd: (type: 'folder' | 'reference', parentId: string | null) => void;
  onDelete: (nodeId: string) => void;
  onSelect: (node: StudyNode) => void;
}

const TreeNode: React.FC<{ node: StudyNode; level: number; onAdd: TreeViewProps['onAdd']; onDelete: TreeViewProps['onDelete']; onSelect: TreeViewProps['onSelect']; }> = ({ node, level, onAdd, onDelete, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
  };
  
  const handleSelect = () => {
    if (node.type === 'reference') {
      onSelect(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 ${node.type === 'reference' ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ paddingLeft: `${level * 1.25}rem` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSelect}
      >
        <div className="flex items-center gap-2 flex-grow" onClick={handleToggle}>
          {node.type === 'folder' && <ChevronRightIcon isRotated={isExpanded} />}
          <span className="w-5 h-5">{node.type === 'folder' ? <FolderIcon /> : <FileIcon />}</span>
          <span className="truncate">{node.name}</span>
        </div>

        {isHovered && (
          <div className="flex items-center gap-2 pr-2">
            {node.type === 'folder' && (
                <>
                    <button onClick={(e) => { e.stopPropagation(); onAdd('folder', node.id); }} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon /><FolderIcon/></button>
                    <button onClick={(e) => { e.stopPropagation(); onAdd('reference', node.id); }} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon /><FileIcon/></button>
                </>
            )}
            <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} className="p-1 rounded text-red-500 hover:bg-red-200 dark:hover:bg-red-800/50"><TrashIcon /></button>
          </div>
        )}
      </div>
      {isExpanded && node.type === 'folder' && (
        <TreeView nodes={node.children} level={level + 1} onAdd={onAdd} onDelete={onDelete} onSelect={onSelect} />
      )}
    </div>
  );
};


export const TreeView: React.FC<TreeViewProps> = ({ nodes, level = 0, onAdd, onDelete, onSelect }) => {
  return (
    <div className="space-y-1">
      {(nodes || []).map(node => (
        <TreeNode key={node.id} node={node} level={level} onAdd={onAdd} onDelete={onDelete} onSelect={onSelect}/>
      ))}
    </div>
  );
};