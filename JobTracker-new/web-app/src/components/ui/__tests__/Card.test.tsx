import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
    });

    it('applies hover variant', () => {
      render(
        <Card hover="lift" data-testid="card">
          <div>Card content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('hover:scale-105', 'transition-transform');
    });

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          <div>Card content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    it('renders with proper styling', () => {
      render(
        <CardHeader data-testid="header">
          <div>Header content</div>
        </CardHeader>
      );
      
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });
  });

  describe('CardTitle', () => {
    it('renders with proper styling', () => {
      render(
        <CardTitle data-testid="title">
          Card Title
        </CardTitle>
      );
      
      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-2xl', 'font-semibold');
    });
  });

  describe('CardContent', () => {
    it('renders with proper styling', () => {
      render(
        <CardContent data-testid="content">
          <div>Content</div>
        </CardContent>
      );
      
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('Complete Card Structure', () => {
    it('renders full card structure correctly', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the card content</p>
          </CardContent>
        </Card>
      );
      
      const card = screen.getByTestId('full-card');
      const title = screen.getByText('Test Card');
      const content = screen.getByText('This is the card content');
      
      expect(card).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });
});