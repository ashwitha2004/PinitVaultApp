import type { UploadedFile } from '../types';

export interface MappedPortfolio {
  profile: {
    name: string;
    role: string;
    summary: string;
  };
  sections: {
    resume: UploadedFile[];
    education: UploadedFile[];
    certifications: UploadedFile[];
    projects: UploadedFile[];
  };
}

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  layout: 'professional' | 'creative' | 'minimal';
}

export const templates: PortfolioTemplate[] = [
  {
    id: 'clean-professional',
    name: 'Clean Professional',
    description: 'Modern and professional layout perfect for corporate jobs',
    sections: ['resume', 'education', 'certifications', 'projects'],
    layout: 'professional'
  },
  {
    id: 'minimal-resume',
    name: 'Minimal Resume',
    description: 'Simple and elegant design focusing on content',
    sections: ['resume', 'education', 'projects'],
    layout: 'minimal'
  },
  {
    id: 'modern-creative',
    name: 'Modern Creative',
    description: 'Creative design for artistic and design portfolios',
    sections: ['projects', 'certifications', 'education'],
    layout: 'creative'
  }
];

export function mapDocumentsToPortfolio(docs: UploadedFile[]) {
  return {
    resume: docs.filter(d => d.portfolio === "Resume"),
    education: docs.filter(d => d.portfolio === "Academic"),
    certifications: docs.filter(d => d.portfolio === "Certificates"),
    projects: docs.filter(d => d.portfolio === "Projects")
  };
}

export function getTemplateById(templateId: string): PortfolioTemplate | undefined {
  return templates.find(template => template.id === templateId);
}

export function generatePortfolioStructure(
  templateId: string,
  selectedDocs: UploadedFile[],
  profileData?: any
): MappedPortfolio {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }

  const sections = mapDocumentsToPortfolio(selectedDocs);

  return {
    profile: {
      name: 'Ashwitha',
      role: 'Full Stack Developer',
      summary: 'Professional summary'
    },
    sections
  };
}

export function validatePortfolioData(portfolio: MappedPortfolio): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if at least one section has content
  const hasContent = Object.values(portfolio.sections).some(
    section => section.length > 0
  );

  if (!hasContent) {
    errors.push('Portfolio must contain at least one document');
  }

  // Check profile completeness
  if (!portfolio.profile.name.trim()) {
    errors.push('Profile name is required');
  }

  if (!portfolio.profile.role.trim()) {
    errors.push('Profile role is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function savePortfolioToStorage(
  templateId: string,
  portfolio: MappedPortfolio
): string {
  const portfolioData = {
    id: Date.now(),
    templateId,
    profile: portfolio.profile,
    sections: portfolio.sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    views: 0,
    shareableLink: `portfolio-${Date.now()}`
  };

  // Get existing portfolios
  const existing = localStorage.getItem('portfolios');
  const portfolios = existing ? JSON.parse(existing) : [];

  // Add new portfolio
  portfolios.unshift(portfolioData);

  // Save to localStorage
  localStorage.setItem('portfolios', JSON.stringify(portfolios));

  return portfolioData.id.toString();
}
