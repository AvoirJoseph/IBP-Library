import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let Icon = CheckCircle2;
        let toastClass = 'toast-success';
        if (t.type === 'danger') {
          Icon = AlertCircle;
          toastClass = 'toast-danger';
        } else if (t.type === 'warning') {
          Icon = AlertTriangle;
          toastClass = 'toast-warning';
        } else if (t.type === 'info') {
          Icon = Info;
          toastClass = 'toast-info';
        }

        return (
          <div key={t.id} className={`toast ${toastClass}`}>
            <Icon size={18} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
