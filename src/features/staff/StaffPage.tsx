import { CustomStaffPage } from './CustomStaffPage';

export function StaffPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your team members</p>
      </div>

      {/* Custom Staff Page with Clerk data */}
      <CustomStaffPage />
    </div>
  );
}
