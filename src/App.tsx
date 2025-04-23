import React, { useState } from 'react';
import { useBranchManagement, DEFAULT_RANGES } from './hooks/useBranchManagement';
import { useBranchActivity } from './hooks/useBranchActivity';
import { useBusinessMetrics } from './hooks/useBusinessMetrics';
import { Header } from './components/layout/Header';
import { BranchList } from './components/BranchList';
import { BranchDialog } from './components/BranchDialog';
import { SettingsPanel } from './components/SettingsPanel';
import { BranchDetails } from './components/dashboard/BranchDetails';
import { OverviewDashboard } from './components/OverviewDashboard';
import { NetworkSetupCosts } from './components/NetworkSetupCosts';

export default function App() {
  const {
    branches,
    selectedBranchId,
    selectedBranch,
    setSelectedBranchId,
    addBranch,
    updateBranch,
    deleteBranch,
    updateBranchMetrics,
    updateBranchRanges,
    updateBranchSetupCosts,
    monthlyData,
    costBreakdown,
    warnings,
  } = useBranchManagement();

  const {
    activeBranches,
    toggleBranch,
    branchHistory,
    logBranchAction,
  } = useBranchActivity(branches);

  const { calculateMetrics, calculateCostBreakdown, calculateWarnings, calculateAverages } = useBusinessMetrics();

  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [showOverview, setShowOverview] = useState(true);

  // Calculate business metrics for the selected branch
  const selectedBranchMonthlyData = selectedBranch
    ? calculateMetrics(selectedBranch.metrics)
    : [];
  const selectedBranchCostBreakdown = selectedBranch
    ? calculateCostBreakdown(selectedBranchMonthlyData)
    : null;
  const selectedBranchWarnings = selectedBranch
    ? calculateWarnings(selectedBranchMonthlyData, selectedBranch.metrics.branchCapacity)
    : [];
  const selectedBranchAverages = selectedBranch
    ? calculateAverages(selectedBranchMonthlyData)
    : null;

  const handleAddBranch = (name: string, location: string, setupCosts: any) => {
    const newBranchId = addBranch(name, location, setupCosts);
    setSelectedBranchId(newBranchId);
    setShowOverview(false);
  };

  const handleDeleteBranch = (branch: any) => {
    logBranchAction('delete', branch);
    deleteBranch(branch.id);
  };

  const activeBranchList = branches.filter(branch => activeBranches.has(branch.id));

  if (!selectedBranch) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Header
            showOverview={showOverview}
            onToggleView={() => setShowOverview(!showOverview)}
            branches={branches}
            selectedBranchId={selectedBranchId}
            onBranchSelect={(id) => {
              setSelectedBranchId(id);
              setShowOverview(false);
            }}
            onAddBranch={() => setIsAddBranchOpen(true)}
          />

          <BranchList
            branches={branches}
            activeBranches={activeBranches}
            onToggleBranch={toggleBranch}
            onDeleteBranch={handleDeleteBranch}
            onSelectBranch={(id) => {
              setSelectedBranchId(id);
              setShowOverview(false);
            }}
          />

          {showOverview ? (
            <>
              <OverviewDashboard
                branches={activeBranchList}
                onBranchSelect={(id) => {
                  setSelectedBranchId(id);
                  setShowOverview(false);
                }}
              />
              <NetworkSetupCosts branches={activeBranchList} />
            </>
          ) : (
            <BranchDetails
              branch={selectedBranch}
              monthlyData={selectedBranchMonthlyData}
              costBreakdown={selectedBranchCostBreakdown}
              warnings={selectedBranchWarnings}
              averages={selectedBranchAverages}
              onUpdateMetrics={(key, value) => updateBranchMetrics(selectedBranchId, key, value)}
              onUpdateBranch={(updates) => updateBranch(selectedBranchId, updates)}
              onDeleteBranch={deleteBranch}
              onUpdateSetupCosts={(costs) => updateBranchSetupCosts(selectedBranchId, costs)}
            />
          )}
        </div>
      </div>

      <SettingsPanel
        metrics={selectedBranch.metrics}
        onChange={(key, value) => updateBranchMetrics(selectedBranchId, key, value)}
        ranges={selectedBranch.ranges as Partial<typeof DEFAULT_RANGES>}
        onRangeChange={(key, range) => updateBranchRanges(selectedBranchId, key, range)}
      />

      <BranchDialog
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        onSave={handleAddBranch}
        title="Add New Branch"
      />
    </div>
  );
}
