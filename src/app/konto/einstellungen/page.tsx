'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function EinstellungenPage() {
  const { user, refreshUser } = useAuth();

  // Name
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaving(true);
    setNameError(null);
    setNameSuccess(false);

    const res = await fetch('/api/auth/customer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName }),
    });

    const data = await res.json();
    setNameSaving(false);

    if (data.success) {
      setNameSuccess(true);
      await refreshUser();
      setTimeout(() => setNameSuccess(false), 3000);
    } else {
      setNameError(data.error || 'Speichern fehlgeschlagen');
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword.length < 8) {
      setPwError('Neues Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('Passwörter stimmen nicht überein');
      return;
    }

    setPwSaving(true);

    // Verify current password by trying to login
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user?.email, password: currentPassword }),
    });

    const loginData = await loginRes.json();

    if (!loginData.success) {
      setPwError('Aktuelles Passwort ist falsch');
      setPwSaving(false);
      return;
    }

    // Update password via WooCommerce
    const res = await fetch('/api/auth/customer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();
    setPwSaving(false);

    if (data.success) {
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSuccess(false), 3000);
    } else {
      setPwError(data.error || 'Passwort konnte nicht geändert werden');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-[family-name:var(--font-poppins-bold)] text-dark mb-6">
        Einstellungen
      </h1>

      {/* Name ändern */}
      <form onSubmit={handleNameSave} className="bg-white border border-ash rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-dark mb-4">Persönliche Daten</h2>

        {nameSuccess && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">Daten gespeichert</p>
          </div>
        )}
        {nameError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{nameError}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-mid mb-1">Vorname</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs text-mid mb-1">Nachname</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-mid mb-1">E-Mail</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm bg-gray-50 text-mid"
            />
            <p className="text-xs text-mid mt-1">E-Mail kann nicht geändert werden. Kontaktieren Sie uns bei Bedarf.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={nameSaving}
          className="mt-4 px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400"
        >
          {nameSaving ? 'Wird gespeichert...' : 'Speichern'}
        </button>
      </form>

      {/* Passwort ändern */}
      <form onSubmit={handlePasswordSave} className="bg-white border border-ash rounded-lg p-5">
        <h2 className="text-sm font-semibold text-dark mb-4">Passwort ändern</h2>

        {pwSuccess && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">Passwort geändert</p>
          </div>
        )}
        {pwError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{pwError}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-mid mb-1">Aktuelles Passwort</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs text-mid mb-1">Neues Passwort</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs text-mid mb-1">Neues Passwort bestätigen</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pwSaving}
          className="mt-4 px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400"
        >
          {pwSaving ? 'Wird geändert...' : 'Passwort ändern'}
        </button>
      </form>
    </div>
  );
}
