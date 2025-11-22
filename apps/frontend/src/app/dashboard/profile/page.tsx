'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/Layout';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { User } from '@workspace/shared';

type ProfileFormData = Partial<User>;

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { data: profile, loading: profileLoading, error: profileError, refetch } = useProfile();
  const { updateProfile, loading: updateLoading, error: updateError } = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences'>('personal');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setSuccessMessage('Profile updated successfully!');
      await refetch();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (profileLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const user = profile || authUser;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <Button variant="outline">
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </div>

          {profileError && (
            <Alert type="error" title="Error loading profile">
              {profileError}
            </Alert>
          )}

          {updateError && (
            <Alert type="error" title="Error updating profile">
              {updateError}
            </Alert>
          )}

          {successMessage && (
            <Alert type="success" title="Success">
              {successMessage}
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-10 w-10 text-primary-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <nav className="px-2 pb-6">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'personal'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium mt-1 ${
                      activeTab === 'preferences'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Preferences
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  {activeTab === 'personal' && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <Input
                              label="Full Name"
                              {...register('name', { required: 'Name is required' })}
                              error={errors.name?.message}
                            />
                          </div>
                          <div>
                            <Input
                              label="Email Address"
                              type="email"
                              {...register('email', { 
                                required: 'Email is required',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address'
                                }
                              })}
                              error={errors.email?.message}
                            />
                          </div>
                          <div>
                            <Input
                              label="Phone Number"
                              type="tel"
                              {...register('phone')}
                              helperText="Optional"
                            />
                          </div>
                        </div>
                      </div>

                      {user?.address && (
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Address Information
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <Input
                                label="Street Address"
                                {...register('address.street')}
                              />
                            </div>
                            <div>
                              <Input
                                label="City"
                                {...register('address.city')}
                              />
                            </div>
                            <div>
                              <Input
                                label="State"
                                {...register('address.state')}
                              />
                            </div>
                            <div>
                              <Input
                                label="ZIP Code"
                                {...register('address.zipCode')}
                              />
                            </div>
                            <div>
                              <Input
                                label="Country"
                                {...register('address.country')}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => reset(profile)}
                          disabled={!isDirty}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          loading={updateLoading}
                          disabled={!isDirty}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )}

                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Notification Preferences
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                              <p className="text-sm text-gray-500">Receive order updates and promotional emails</p>
                            </div>
                            <button
                              type="button"
                              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                                user?.preferences?.notifications ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                  user?.preferences?.notifications ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Newsletter</h4>
                              <p className="text-sm text-gray-500">Receive our weekly newsletter with deals and updates</p>
                            </div>
                            <button
                              type="button"
                              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                                user?.preferences?.newsletter ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                  user?.preferences?.newsletter ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Theme Preferences
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Theme</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="system">System</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}