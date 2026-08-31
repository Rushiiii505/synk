'use client';

import React from 'react';
import { Expense } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReceiptViewerModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptViewerModal({ expense, isOpen, onClose }: ReceiptViewerModalProps) {
  if (!expense) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            <FileText className="w-4 h-4" />
          </div>
          <span>Receipt Attachment & Tax Verification</span>
        </div>
      }
      description={`Transaction ID: ${expense.id} • ${formatDate(expense.date)}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Receipt summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Merchant / Item</span>
            <h4 className="text-sm font-extrabold text-slate-900">{expense.title}</h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Charged</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {formatCurrency(expense.amount, expense.currency)}
            </div>
          </div>
        </div>

        {/* Image preview */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-2 min-h-[240px]">
          {expense.receiptUrl ? (
            <img
              src={expense.receiptUrl}
              alt="Receipt Attachment"
              className="max-h-72 w-full object-contain rounded-xl shadow-xs"
            />
          ) : (
            <div className="text-center p-8 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No image receipt uploaded.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Paid via {expense.paymentMethod}</p>
            </div>
          )}
        </div>

        {/* Verification banner */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified & Signed by Financial Controller ({expense.paidBy.name})</span>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
          {expense.receiptUrl && (
            <a
              href={expense.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Full Image</span>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
