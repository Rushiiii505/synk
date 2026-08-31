'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { DocList } from './DocList';
import { DocEditor } from './DocEditor';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DocsTab() {
  const { docs, selectedDocId, setSelectedDocId, openQuickAction } = useWorkspace();

  const activeDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar List */}
      <DocList
        onSelectDoc={(id) => setSelectedDocId(id)}
        selectedDocId={activeDoc?.id || null}
      />

      {/* Main Editor Pane */}
      {activeDoc ? (
        <DocEditor doc={activeDoc} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Document Selected</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Select a document from the sidebar or draft a new collaborative spec.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openQuickAction('doc')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Document
          </Button>
        </div>
      )}
    </div>
  );
}
