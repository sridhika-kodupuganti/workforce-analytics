import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App.tsx';

describe('Workforce Analytics Dashboard UI/UX Integration Tests', () => {
  const renderApp = async () => {
    await act(async () => {
      render(<App />);
    });
  };

  it('renders brand identity and platform title', async () => {
    await renderApp();
    expect(screen.getAllByText(/Workforce/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Workforce & Attendance Analytics/i })).toBeInTheDocument();
  });

  it('renders all five KPI cards', async () => {
    await renderApp();
    expect(screen.getByText(/Total Workforce/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Attendance Rate/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Present Today/i)).toBeInTheDocument();
    expect(screen.getAllByText(/On Leave/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Absent/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Overtime & Logged Hours/i)).toBeInTheDocument();
  });

  it('renders the filter toolbar with interactive controls', async () => {
    await renderApp();
    expect(screen.getByLabelText(/Time Window/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hub \/ Office Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Attendance Status/i)).toBeInTheDocument();
  });

  it('renders recent workforce activity feed', async () => {
    await renderApp();
    expect(screen.getByText(/Recent Workforce Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Julian Alvarez/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sarah Chen/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sridhika/i).length).toBeGreaterThan(0);
  });

  it('switches to Error state when Error button is clicked and recovers on Retry', async () => {
    await renderApp();
    const errorBtn = screen.getByRole('button', { name: /Error/i });
    await act(async () => {
      fireEvent.click(errorBtn);
    });

    expect(screen.getByText(/Telemetry Sync Error \[HTTP 503\]/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Sync/i });
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(screen.queryByText(/Telemetry Sync Error \[HTTP 503\]/i)).not.toBeInTheDocument();
  });

  it('switches to Empty state when Empty button is clicked', async () => {
    await renderApp();
    const emptyBtn = screen.getByRole('button', { name: /Empty/i });
    await act(async () => {
      fireEvent.click(emptyBtn);
    });

    expect(screen.getByText(/No Matching Workforce Records Found/i)).toBeInTheDocument();
  });

  it('toggles theme mode button', async () => {
    await renderApp();
    const themeBtn = screen.getByLabelText(/toggle color theme/i);
    expect(themeBtn).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(themeBtn);
    });
  });
});
