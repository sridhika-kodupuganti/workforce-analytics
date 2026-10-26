import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App.tsx';

describe('Workforce Analytics Dashboard UI/UX Integration Tests', () => {
  it('renders brand identity and platform title', () => {
    render(<App />);
    expect(screen.getAllByText(/Workforce/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Workforce & Attendance Analytics/i })).toBeInTheDocument();
  });

  it('renders all five KPI cards', () => {
    render(<App />);
    expect(screen.getByText(/Total Workforce/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Attendance Rate/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Present Today/i)).toBeInTheDocument();
    expect(screen.getByText(/On Leave \/ Absent/i)).toBeInTheDocument();
    expect(screen.getByText(/Overtime & Logged Hours/i)).toBeInTheDocument();
  });

  it('renders the filter toolbar with interactive controls', () => {
    render(<App />);
    expect(screen.getByLabelText(/Time Window/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hub \/ Office Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Attendance Status/i)).toBeInTheDocument();
  });

  it('renders recent workforce activity feed', () => {
    render(<App />);
    expect(screen.getByText(/Recent Workforce Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Julian Alvarez/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sarah Chen/i).length).toBeGreaterThan(0);
  });

  it('switches to Error state when Error button is clicked and recovers on Retry', () => {
    render(<App />);
    const errorBtn = screen.getByRole('button', { name: /Error/i });
    fireEvent.click(errorBtn);

    expect(screen.getByText(/Telemetry Sync Error \[HTTP 503\]/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Sync/i });
    fireEvent.click(retryBtn);

    expect(screen.queryByText(/Telemetry Sync Error \[HTTP 503\]/i)).not.toBeInTheDocument();
  });

  it('switches to Empty state when Empty button is clicked', () => {
    render(<App />);
    const emptyBtn = screen.getByRole('button', { name: /Empty/i });
    fireEvent.click(emptyBtn);

    expect(screen.getByText(/No Matching Workforce Records Found/i)).toBeInTheDocument();
  });

  it('toggles theme mode button', () => {
    render(<App />);
    const themeBtn = screen.getByLabelText(/toggle color theme/i);
    expect(themeBtn).toBeInTheDocument();
    fireEvent.click(themeBtn);
  });
});
