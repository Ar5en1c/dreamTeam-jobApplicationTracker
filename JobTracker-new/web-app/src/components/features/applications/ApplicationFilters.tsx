import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Search,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { APPLICATION_STATUSES, WORK_ARRANGEMENTS, COMPANY_SIZES } from '@/lib/constants';
import type { ApplicationStatus, WorkArrangement, CompanySize } from '@/types';

interface FilterOptions {
  search: string;
  statuses: ApplicationStatus[];
  companies: string[];
  locations: string[];
  workArrangements: WorkArrangement[];
  companySizes: CompanySize[];
  salaryRange: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  tags: string[];
}

interface ApplicationFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCompanies: string[];
  availableLocations: string[];
  availableTags: string[];
  className?: string;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCompanies,
  availableLocations,
  availableTags,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      statuses: [],
      companies: [],
      locations: [],
      workArrangements: [],
      companySizes: [],
      salaryRange: { min: 0, max: 500000 },
      dateRange: { start: null, end: null },
      tags: []
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.companies.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.workArrangements.length > 0) count++;
    if (filters.companySizes.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.salaryRange.min > 0 || filters.salaryRange.max < 500000) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const toggleArrayFilter = <T,>(array: T[], item: T, field: keyof FilterOptions) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFilters({ [field]: newArray });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Search and Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by company, position, or keywords..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
            className="w-full"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" size="sm">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown 
            className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-180"
            )} 
          />
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.statuses.map(status => (
            <Badge 
              key={status} 
              variant="secondary" 
              className="cursor-pointer"
              onClick={() => toggleArrayFilter(filters.statuses, status, 'statuses')}
            >
              {APPLICATION_STATUSES.find(s => s.value === status)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.companies.map(company => (
            <Badge 
              key={company} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleArrayFilter(filters.companies, company, 'companies')}
            >
              {company}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleArrayFilter(filters.tags, tag, 'tags')}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Status
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {APPLICATION_STATUSES.map(status => (
                        <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.statuses.includes(status.value)}
                            onChange={() => toggleArrayFilter(filters.statuses, status.value, 'statuses')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{status.label}</span>
                          <span className="text-xs">{status.icon}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Company
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableCompanies.map(company => (
                        <label key={company} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.companies.includes(company)}
                            onChange={() => toggleArrayFilter(filters.companies, company, 'companies')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{company}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableLocations.map(location => (
                        <label key={location} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.locations.includes(location)}
                            onChange={() => toggleArrayFilter(filters.locations, location, 'locations')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Work Arrangement Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Work Style
                    </label>
                    <div className="space-y-2">
                      {WORK_ARRANGEMENTS.map(arrangement => (
                        <label key={arrangement.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.workArrangements.includes(arrangement.value)}
                            onChange={() => toggleArrayFilter(filters.workArrangements, arrangement.value, 'workArrangements')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{arrangement.label}</span>
                          <span className="text-xs">{arrangement.icon}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Size Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Company Size
                    </label>
                    <div className="space-y-2">
                      {COMPANY_SIZES.map(size => (
                        <label key={size.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.companySizes.includes(size.value)}
                            onChange={() => toggleArrayFilter(filters.companySizes, size.value, 'companySizes')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div>
                            <span className="text-sm">{size.label}</span>
                            <p className="text-xs text-muted-foreground">{size.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Tags
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableTags.map(tag => (
                        <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.tags.includes(tag)}
                            onChange={() => toggleArrayFilter(filters.tags, tag, 'tags')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Salary Range */}
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm font-medium flex items-center mb-3">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Minimum</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.salaryRange.min || ''}
                        onChange={(e) => updateFilters({
                          salaryRange: { 
                            ...filters.salaryRange, 
                            min: parseInt(e.target.value) || 0 
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Maximum</label>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={filters.salaryRange.max === 500000 ? '' : filters.salaryRange.max}
                        onChange={(e) => updateFilters({
                          salaryRange: { 
                            ...filters.salaryRange, 
                            max: parseInt(e.target.value) || 500000 
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm font-medium flex items-center mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    Application Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">From</label>
                      <Input
                        type="date"
                        value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                        onChange={(e) => updateFilters({
                          dateRange: { 
                            ...filters.dateRange, 
                            start: e.target.value ? new Date(e.target.value) : null 
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">To</label>
                      <Input
                        type="date"
                        value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                        onChange={(e) => updateFilters({
                          dateRange: { 
                            ...filters.dateRange, 
                            end: e.target.value ? new Date(e.target.value) : null 
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};