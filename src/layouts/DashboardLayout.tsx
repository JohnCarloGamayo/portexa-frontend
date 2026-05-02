import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, Moon, Search, User, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { useRef, useEffect } from 'react';

type CurrentUser = {
  email: string;
  full_name?: string | null;
};

type ProfileFormState = {
  fullName: string;
  password: string;
  confirmPassword: string;
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const loadCurrentUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setCurrentUser(data);
        setProfileForm((previous) => ({
          ...previous,
          fullName: data.full_name || '',
        }));
      } catch {
        // Keep the header usable even if profile lookup fails.
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const openManageProfile = () => {
    setIsUserMenuOpen(false);
    setProfileError('');
    setProfileForm({
      fullName: currentUser?.full_name || '',
      password: '',
      confirmPassword: '',
    });
    setShowProfileModal(true);
  };

  const validateProfileForm = () => {
    if (!profileForm.fullName.trim()) {
      setProfileError('Full name is required.');
      return false;
    }

    if (profileForm.password || profileForm.confirmPassword) {
      if (profileForm.password.length < 8) {
        setProfileError('Password must be at least 8 characters long.');
        return false;
      }

      if (profileForm.password !== profileForm.confirmPassword) {
        setProfileError('Password and confirm password must match.');
        return false;
      }
    }

    if (
      currentUser?.full_name?.trim() === profileForm.fullName.trim() &&
      !profileForm.password
    ) {
      setProfileError('No changes to save.');
      return false;
    }

    setProfileError('');
    return true;
  };

  const handleProfileSubmit = () => {
    if (!validateProfileForm()) {
      return;
    }

    setShowProfileConfirm(true);
  };

  const saveProfileChanges = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: profileForm.fullName.trim(),
          password: profileForm.password || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to update profile');
      }

      setCurrentUser(data);
      setShowProfileConfirm(false);
      setShowProfileModal(false);
      setProfileForm({ fullName: data.full_name || '', password: '', confirmPassword: '' });
    } catch (error: any) {
      setProfileError(error.message || 'Unable to update profile');
      setShowProfileConfirm(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setIsUserMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/portfolios': return 'Portfolios';
      case '/analytics': return 'Analytics';
      case '/api-keys': return 'API Credentials';
      case '/settings': return 'Dashboard / Chatbot Customization';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 flex flex-col bg-[#FAFAFD] relative pb-10 overflow-y-auto min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md px-4 md:px-8 py-5 border-b border-transparent flex items-center justify-between gap-4">
          
          <button 
            className="md:hidden text-slate-500 hover:text-slate-800 transition mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 max-w-xl hidden md:block">
             <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-brand-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search portfolios or queries..." 
                  className="w-full bg-white border border-slate-100 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 shadow-sm shadow-slate-100/50"
                />
             </div>
          </div>
          
          <div className="flex-1 text-center font-semibold text-slate-700 tracking-tight md:ml-0 -ml-2 text-sm sm:text-base truncate">
            {getTitle()}
          </div>
          
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
             <button className="text-slate-400 hover:text-slate-600 transition-colors hidden md:block">
               <Moon className="w-5 h-5" />
             </button>
             <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-50"></span>
             </button>
             <div ref={userMenuRef} className="relative">
               <button 
                 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                 className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 hover:border-slate-400 cursor-pointer overflow-hidden flex items-center justify-center shrink-0 transition-colors"
               >
                 <User className="w-5 h-5 text-slate-500" />
               </button>

               {isUserMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                   <div className="px-4 py-3 border-b border-slate-100">
                     <p className="text-sm font-semibold text-slate-700">My Account</p>
                     <p className="text-xs text-slate-500 mt-1">Manage your profile</p>
                   </div>
                   <button
                     onClick={openManageProfile}
                     className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                   >
                     <Settings className="w-4 h-4 text-slate-400" />
                     Manage Account
                   </button>
                   <button
                     onClick={handleLogout}
                     className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-slate-100"
                   >
                     <LogOut className="w-4 h-4" />
                     Logout
                   </button>
                 </div>
               )}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 md:px-8 pt-6 md:pt-8 max-w-[1400px] w-full mx-auto pb-16">
          {children}
        </div>

        {/* Manage Profile Modal */}
        {showProfileModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Manage Profile</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update your display name and set a new password if needed.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, fullName: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">New Password</label>
                  <input
                    type="password"
                    value={profileForm.password}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, password: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, confirmPassword: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Repeat new password"
                  />
                </div>

                {profileError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {profileError}
                  </div>
                )}

                <p className="text-xs font-medium text-slate-400">
                  Name is pulled from your account profile, including Google sign-in when available.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Review Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Confirmation Modal */}
        {showProfileConfirm && (
          <div
            className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowProfileConfirm(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900">Confirm Profile Update</h3>
              <p className="mt-2 text-sm text-slate-500">
                Please confirm the changes before saving your account.
              </p>

              <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Full name</span>
                  <span className="text-slate-900">{profileForm.fullName.trim()}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Password</span>
                  <span className="text-slate-900">{profileForm.password ? 'Will be updated' : 'No change'}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfileConfirm(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  disabled={isSavingProfile}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={saveProfileChanges}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? 'Saving...' : 'Confirm Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
};

export default DashboardLayout;
