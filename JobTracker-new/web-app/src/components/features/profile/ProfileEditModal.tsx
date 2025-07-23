import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Save,
  X,
  Plus
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Partial<UserProfile>) => void;
  profile: UserProfile;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile
}) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      websites: [] as string[]
    }
  });

  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        personalInfo: {
          name: profile.personalInfo.name,
          email: profile.personalInfo.email,
          phone: profile.personalInfo.phone || '',
          location: profile.personalInfo.location || '',
          websites: [...profile.personalInfo.websites]
        }
      });
    }
  }, [profile, isOpen]);

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addWebsite = () => {
    if (newWebsite.trim() && !formData.personalInfo.websites.includes(newWebsite.trim())) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          websites: [...prev.personalInfo.websites, newWebsite.trim()]
        }
      }));
      setNewWebsite('');
    }
  };

  const removeWebsite = (websiteToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        websites: prev.personalInfo.websites.filter(website => website !== websiteToRemove)
      }
    }));
  };

  const handleSave = () => {
    const updatedProfile: Partial<UserProfile> = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        ...formData.personalInfo
      },
      updatedAt: new Date()
    };

    onSave(updatedProfile);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal information and contact details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-4">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
            alt={formData.personalInfo.name}
            fallback={formData.personalInfo.name}
            size="2xl"
            className="ring-2 ring-primary/20"
          />
          <div>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                placeholder="Enter your full name"
                value={formData.personalInfo.name}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                placeholder="City, State/Country"
                value={formData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                leftIcon={<MapPin className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        {/* Websites */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Websites & Social Links
          </h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addWebsite)}
              className="flex-1"
            />
            <Button onClick={addWebsite} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.personalInfo.websites.map((website, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => removeWebsite(website)}
              >
                {website} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          
          {formData.personalInfo.websites.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Add your portfolio, LinkedIn, GitHub, or other professional links
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Professional Bio</h3>
          <textarea
            className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={4}
            placeholder="Write a brief professional summary about yourself..."
            defaultValue="Experienced software engineer passionate about creating innovative solutions and building scalable applications. Strong background in full-stack development with expertise in modern web technologies."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-2 pt-6 border-t border-border mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};