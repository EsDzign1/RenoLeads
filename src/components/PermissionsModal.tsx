import React from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Check, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Users, 
  Eye, 
  Download, 
  Terminal, 
  Mail, 
  FileEdit,
  DollarSign
} from 'lucide-react';
import { AppUser, RoleType } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  currentUser: AppUser;
  onSelectUserRole: (role: RoleType) => void;
  onTogglePermission: (userId: string, permKey: keyof AppUser['permissions']) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUserRole,
  onTogglePermission,
}) => {
  if (!isOpen) return null;

  const PERMISSION_COLUMNS: Array<{ key: keyof AppUser['permissions']; label: string; icon: any }> = [
    { key: 'canRunScrapers', label: 'Run Scrapers', icon: Terminal },
    { key: 'canExportCsv', label: 'Export CSV', icon: Download },
    { key: 'canEditLeadStages', label: 'Edit Pipeline', icon: FileEdit },
    { key: 'canConfigureEmailAlerts', label: 'Config Alerts', icon: Mail },
    { key: 'canAccessFinancials', label: 'Financial Data', icon: DollarSign },
    { key: 'canManageTeamRoles', label: 'Manage Roles', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Stakeholder Access & Role-Based Permissions (RBAC)
                </h2>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active: {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Switch active stakeholder profiles and customize granular capabilities across your organization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Active User Switcher Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Switch Active Session Role</span>
              <span className="text-slate-400 font-normal">Click avatar to test stakeholder perspective</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {users.map(u => {
                const isActive = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => onSelectUserRole(u.role)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div className="overflow-hidden flex-1">
                      <div className="font-bold text-xs truncate">{u.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono truncate">{u.role}</div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Permission Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Stakeholder Role Access Matrix
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Stakeholder / Role</th>
                    {PERMISSION_COLUMNS.map(col => {
                      const IconComp = col.icon;
                      return (
                        <th key={col.key} className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <IconComp className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[80px]">{col.label}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {users.map(u => {
                    const isCurrentUser = currentUser.id === u.id;

                    return (
                      <tr key={u.id} className={isCurrentUser ? 'bg-amber-500/5' : ''}>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-xs">{u.name}</div>
                          <div className="text-[10px] text-amber-400 font-mono">{u.role}</div>
                        </td>

                        {PERMISSION_COLUMNS.map(col => {
                          const hasPerm = u.permissions[col.key];

                          return (
                            <td key={col.key} className="py-3 px-3 text-center">
                              <button
                                onClick={() => onTogglePermission(u.id, col.key)}
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition ${
                                  hasPerm
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-slate-800/80 text-slate-600 border border-slate-700 hover:text-slate-400'
                                }`}
                                title={`${hasPerm ? 'Allowed' : 'Restricted'}: ${col.label}`}
                              >
                                {hasPerm ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Permission changes take effect immediately across all active sessions.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
