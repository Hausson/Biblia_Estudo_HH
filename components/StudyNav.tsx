
import React from 'react';
import { StudyFolder, StudyNode } from '../types';
import { TreeView } from './TreeView';
import { FolderIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface StudyNavProps {
  studyData: StudyNode[];
  setStudyData: React.Dispatch<React.SetStateAction<StudyNode[]>>;
  setSelectedStudyNode: (node: StudyNode | null) => void;
}

const findAndModifyNode = (nodes: StudyNode[], nodeId: string, action: (node: StudyNode, parents: StudyNode[]) => void): StudyNode[] => {
    const newNodes = JSON.parse(JSON.stringify(nodes));

    const search = (currentNodes: StudyNode[], parents: StudyNode[]): boolean => {
        if (!Array.isArray(currentNodes)) return false;
        for (let i = 0; i < currentNodes.length; i++) {
            const node = currentNodes[i];
            if (!node) continue;
            if (node.id === nodeId) {
                action(node, parents);
                return true;
            }
            if (node.type === 'folder') {
                if (search(node.children, [...parents, node])) {
                    return true;
                }
            }
        }
        return false;
    };
    search(newNodes, []);
    return newNodes;
};

const findAndRemoveNode = (nodes: StudyNode[], nodeId: string): StudyNode[] => {
    if (!Array.isArray(nodes)) return [];
    return nodes.filter(node => node && node.id !== nodeId).map(node => {
        if (node.type === 'folder') {
            return { ...node, children: findAndRemoveNode(node.children || [], nodeId) };
        }
        return node;
    });
};

const StudyNav: React.FC<StudyNavProps> = ({ studyData, setStudyData, setSelectedStudyNode }) => {
    const { t, language } = useLanguage();
    
    const handleAdd = (type: 'folder' | 'reference', parentId: string | null) => {
        const typeName = t(type);
        const name = prompt(`${t('enterName')} ${typeName}:`);
        if (!name) return;

        const newNode: StudyNode = type === 'folder'
            ? { id: Date.now().toString(), type: 'folder', name, children: [] }
            : { id: Date.now().toString(), type: 'reference', name, content: '' };


        if (parentId === null) {
            setStudyData(prevData => [...prevData, newNode]);
        } else {
            const newTree = findAndModifyNode(studyData, parentId, (node) => {
                if (node.type === 'folder') {
                    const folderNode = node as StudyFolder;
                    if (!Array.isArray(folderNode.children)) {
                        folderNode.children = [];
                    }
                    folderNode.children.push(newNode);
                }
            });
            setStudyData(newTree);
        }
    };
    
    const handleDelete = (nodeId: string) => {
        if (window.confirm(t('confirmDelete'))) {
            setStudyData(prevData => findAndRemoveNode(prevData, nodeId));
            setSelectedStudyNode(null);
        }
    };
    
    const handleSelect = (node: StudyNode) => {
        setSelectedStudyNode(node);
    }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('studies')}</h2>
        <div className="flex gap-2">
           <button onClick={() => handleAdd('folder', null)} className="flex items-center gap-1 p-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <FolderIcon /> {t('newTopic')}
            </button>
        </div>
      </div>
      {studyData.length > 0 ? (
        <TreeView nodes={studyData} onAdd={handleAdd} onDelete={handleDelete} onSelect={handleSelect} />
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>{t('noStudies')}</p>
            <p>{t('clickToStart')}</p>
        </div>
      )}
    </div>
  );
};

export default StudyNav;
