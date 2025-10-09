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

  const panelSurfaceClass =
    "rounded-xl border border-borderMuted bg-surface-1 shadow-sm transition-colors";
  const filterLabelClass =
    "flex items-center text-sm font-semibold text-foreground";
  const optionLabelClass =
    "flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-surface-2 cursor-pointer";
  const checkboxClass =
    "h-4 w-4 rounded border-borderMuted bg-surface-1 text-primary focus:ring-primary/40";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Search and Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by company, position, or keywords..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
            className="w-full rounded-lg"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
        >
          <SlidersHorizontal className="h-4 w-4" />
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
          <Button variant="ghost" onClick={clearFilters} size="sm" className="h-9 px-3 text-sm text-muted-foreground">
            <X className="mr-1 h-4 w-4" />
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
            <Card variant="surface" className={cn(panelSurfaceClass, "mt-4")}>
              <CardContent className="relative z-10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <label className={filterLabelClass}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Status
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {APPLICATION_STATUSES.map(status => (
                        <label key={status.value} className={optionLabelClass}>
                          <input
                            type="checkbox"
                            checked={filters.statuses.includes(status.value)}
                            onChange={() => toggleArrayFilter(filters.statuses, status.value, 'statuses')}
                            className={checkboxClass}
                          />
                          <span>{status.label}</span>
                          <span className="text-xs opacity-70">{status.icon}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Filter */}
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-foreground">
                      <Building2 className="mr-2 h-4 w-4" />
                      Company
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableCompanies.map(company => (
                        <label key={company} className={optionLabelClass}>
                          <input
                            type="checkbox"
                            checked={filters.companies.includes(company)}
                            onChange={() => toggleArrayFilter(filters.companies, company, 'companies')}
                            className={checkboxClass}
                          />
                          <span>{company}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <label className={filterLabelClass}>
                      <MapPin className="mr-2 h-4 w-4" />
                      Location
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableLocations.map(location => (
                        <label key={location} className={optionLabelClass}>
                          <input
                            type="checkbox"
                            checked={filters.locations.includes(location)}
                            onChange={() => toggleArrayFilter(filters.locations, location, 'locations')}
                            className={checkboxClass}
                          />
                          <span>{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Work Arrangement Filter */}
                  <div className="space-y-3">
                    <label className={filterLabelClass}>
                      <Clock className="mr-2 h-4 w-4" />
                      Work Style
                    </label>
                    <div className="space-y-2">
                      {WORK_ARRANGEMENTS.map(arrangement => (
                        <label key={arrangement.value} className={optionLabelClass}>
                          <input
                            type="checkbox"
                            checked={filters.workArrangements.includes(arrangement.value)}
                            onChange={() => toggleArrayFilter(filters.workArrangements, arrangement.value, 'workArrangements')}
                            className={checkboxClass}
                          />
                          <span>{arrangement.label}</span>
                          <span className="text-xs opacity-70">{arrangement.icon}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Size Filter */}
                  <div className="space-y-3">
                    <label className={filterLabelClass}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Company Size
                    </label>
                    <div className="space-y-2">
                      {COMPANY_SIZES.map(size => (
                        <label key={size.value} className={optionLabelClass}>
                          <input
                            type="checkbox"
                            checked={filters.companySizes.includes(size.value)}
                            onChange={() => toggleArrayFilter(filters.companySizes, size.value, 'companySizes')}
                            className={checkboxClass}
                          />
                          <div>
                            <span>{size.label}</span>
                            <p className="text-xs text-muted-foreground/80">{size.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="space-y-3">
                    <label className={filterLabelClass}>
                      <Filter className="mr-2 h-4 w-4" />
                      Tags
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableTags.map(tag => (
                        <label key={tag} className={optionLabelClass}>
                          <input
                            type="checkbox"
                            checked={filters.tags.includes(tag)}
                            onChange={() => toggleArrayFilter(filters.tags, tag, 'tags')}
                            className={checkboxClass}
                          />
                          <span>{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Salary Range */}
                <div className="mt-6 border-t border-borderMuted pt-6">
                  <label className={cn(filterLabelClass, "mb-3")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground/80">Minimum</label>
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
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground/80">Maximum</label>
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
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="mt-6 border-t border-borderMuted pt-6">
                  <label className={cn(filterLabelClass, "mb-3")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Application Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground/80">From</label>
                      <Input
                        type="date"
                        value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                        onChange={(e) => updateFilters({
                          dateRange: { 
                            ...filters.dateRange, 
                            start: e.target.value ? new Date(e.target.value) : null 
                          }
                        })}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground/80">To</label>
                      <Input
                        type="date"
                        value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                        onChange={(e) => updateFilters({
                          dateRange: { 
                            ...filters.dateRange, 
                            end: e.target.value ? new Date(e.target.value) : null 
                          }
                        })}
                        className="rounded-lg"
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
