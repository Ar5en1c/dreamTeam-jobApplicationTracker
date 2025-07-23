import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Building2, 
  Clock,
  Home,
  Target,
  Heart,
  Save,
  RotateCcw,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { 
  JOB_TYPES, 
  WORK_ARRANGEMENTS, 
  COMPANY_SIZES, 
  INDUSTRIES,
  JOB_ROLES
} from '@/lib/constants';
import type { 
  JobType, 
  WorkArrangement, 
  CompanySize, 
  UserProfile 
} from '@/types';

interface CareerPreferencesProps {
  preferences: UserProfile['preferences'];
  onPreferencesChange: (preferences: UserProfile['preferences']) => void;
  className?: string;
}

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

const POPULAR_LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Denver, CO',
  'Atlanta, GA',
  'Remote',
  'Hybrid'
];

const POPULAR_BENEFITS = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  '401k Matching',
  'Stock Options',
  'Equity',
  'Flexible PTO',
  'Unlimited PTO',
  'Remote Work',
  'Flexible Hours',
  'Learning Budget',
  'Gym Membership',
  'Commuter Benefits',
  'Parental Leave',
  'Mental Health Support',
  'Life Insurance',
  'Disability Insurance',
  'Wellness Programs'
];

export const CareerPreferences: React.FC<CareerPreferencesProps> = ({
  preferences,
  onPreferencesChange,
  className
}) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const updatePreferences = (updates: Partial<UserProfile['preferences']>) => {
    onPreferencesChange({ ...preferences, ...updates });
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setUnsavedChanges(false);
    console.log('Preferences saved:', preferences);
  };

  const handleReset = () => {
    // Reset to default preferences
    const defaultPreferences: UserProfile['preferences'] = {
      jobTypes: ['full-time'],
      locations: ['Remote'],
      industries: ['Technology'],
      roles: ['Software Engineer'],
      salaryRange: {
        min: 80000,
        max: 200000,
        currency: 'USD'
      },
      workArrangement: ['remote'],
      companySize: ['medium', 'large'],
      benefits: ['Health Insurance', 'Remote Work', 'Flexible PTO']
    };
    onPreferencesChange(defaultPreferences);
    setUnsavedChanges(true);
  };

  const toggleArrayItem = <T,>(array: T[], item: T, field: keyof UserProfile['preferences']) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updatePreferences({ [field]: newArray });
  };

  const addCustomItem = (value: string, field: keyof UserProfile['preferences']) => {
    if (!value.trim()) return;
    const currentArray = preferences[field] as string[];
    if (!currentArray.includes(value.trim())) {
      updatePreferences({ [field]: [...currentArray, value.trim()] });
    }
  };

  const removeCustomItem = (item: string, field: keyof UserProfile['preferences']) => {
    const currentArray = preferences[field] as string[];
    updatePreferences({ [field]: currentArray.filter(i => i !== item) });
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: preferences.salaryRange.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Career Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Set your job search preferences to get better matches
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!unsavedChanges}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {unsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Click "Save Changes" to update your preferences.
          </p>
        </motion.div>
      )}

      {/* Job Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Job Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map(jobType => (
              <Button
                key={jobType.value}
                variant={preferences.jobTypes.includes(jobType.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleArrayItem(preferences.jobTypes, jobType.value, 'jobTypes')}
              >
                {jobType.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Arrangements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Work Arrangement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {WORK_ARRANGEMENTS.map(arrangement => (
              <Button
                key={arrangement.value}
                variant={preferences.workArrangement.includes(arrangement.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleArrayItem(preferences.workArrangement, arrangement.value, 'workArrangement')}
                className="flex items-center"
              >
                <span className="mr-2">{arrangement.icon}</span>
                {arrangement.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salary Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Salary Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Minimum</label>
              <Input
                type="number"
                value={preferences.salaryRange.min}
                onChange={(e) => updatePreferences({
                  salaryRange: {
                    ...preferences.salaryRange,
                    min: parseInt(e.target.value) || 0
                  }
                })}
                placeholder="80000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Maximum</label>
              <Input
                type="number"
                value={preferences.salaryRange.max}
                onChange={(e) => updatePreferences({
                  salaryRange: {
                    ...preferences.salaryRange,
                    max: parseInt(e.target.value) || 0
                  }
                })}
                placeholder="200000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <select
                value={preferences.salaryRange.currency}
                onChange={(e) => updatePreferences({
                  salaryRange: {
                    ...preferences.salaryRange,
                    currency: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Your target range: <span className="font-medium text-foreground">
                {formatSalary(preferences.salaryRange.min)} - {formatSalary(preferences.salaryRange.max)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Preferred Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {preferences.locations.map(location => (
              <Badge
                key={location}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeCustomItem(location, 'locations')}
              >
                {location}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LOCATIONS.filter(loc => !preferences.locations.includes(loc)).map(location => (
              <Button
                key={location}
                variant="outline"
                size="sm"
                onClick={() => addCustomItem(location, 'locations')}
              >
                <Plus className="w-3 h-3 mr-1" />
                {location}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom location..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCustomItem(newLocation, 'locations');
                  setNewLocation('');
                }
              }}
            />
            <Button
              onClick={() => {
                addCustomItem(newLocation, 'locations');
                setNewLocation('');
              }}
              disabled={!newLocation.trim()}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Company Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPANY_SIZES.map(size => (
              <label
                key={size.value}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={preferences.companySize.includes(size.value)}
                  onChange={() => toggleArrayItem(preferences.companySize, size.value, 'companySize')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium">{size.label}</p>
                  <p className="text-sm text-muted-foreground">{size.description}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Industries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {preferences.industries.map(industry => (
              <Badge
                key={industry}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeCustomItem(industry, 'industries')}
              >
                {industry}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.filter(industry => !preferences.industries.includes(industry)).map(industry => (
              <Button
                key={industry}
                variant="outline"
                size="sm"
                onClick={() => addCustomItem(industry, 'industries')}
              >
                <Plus className="w-3 h-3 mr-1" />
                {industry}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Target Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {preferences.roles.map(role => (
              <Badge
                key={role}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeCustomItem(role, 'roles')}
              >
                {role}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {JOB_ROLES.filter(role => !preferences.roles.includes(role)).map(role => (
              <Button
                key={role}
                variant="outline"
                size="sm"
                onClick={() => addCustomItem(role, 'roles')}
              >
                <Plus className="w-3 h-3 mr-1" />
                {role}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom role..."
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCustomItem(newRole, 'roles');
                  setNewRole('');
                }
              }}
            />
            <Button
              onClick={() => {
                addCustomItem(newRole, 'roles');
                setNewRole('');
              }}
              disabled={!newRole.trim()}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Important Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {preferences.benefits.map(benefit => (
              <Badge
                key={benefit}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeCustomItem(benefit, 'benefits')}
              >
                {benefit}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_BENEFITS.filter(benefit => !preferences.benefits.includes(benefit)).map(benefit => (
              <Button
                key={benefit}
                variant="outline"
                size="sm"
                onClick={() => addCustomItem(benefit, 'benefits')}
              >
                <Plus className="w-3 h-3 mr-1" />
                {benefit}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom benefit..."
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCustomItem(newBenefit, 'benefits');
                  setNewBenefit('');
                }
              }}
            />
            <Button
              onClick={() => {
                addCustomItem(newBenefit, 'benefits');
                setNewBenefit('');
              }}
              disabled={!newBenefit.trim()}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Job Types:</p>
              <p className="text-muted-foreground">{preferences.jobTypes.join(', ')}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Work Arrangement:</p>
              <p className="text-muted-foreground">{preferences.workArrangement.join(', ')}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Salary Range:</p>
              <p className="text-muted-foreground">
                {formatSalary(preferences.salaryRange.min)} - {formatSalary(preferences.salaryRange.max)}
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Locations:</p>
              <p className="text-muted-foreground">{preferences.locations.slice(0, 3).join(', ')}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Industries:</p>
              <p className="text-muted-foreground">{preferences.industries.slice(0, 3).join(', ')}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Top Benefits:</p>
              <p className="text-muted-foreground">{preferences.benefits.slice(0, 3).join(', ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};