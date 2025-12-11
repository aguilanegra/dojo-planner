import { CustomStaffPage } from './CustomStaffPage';

export function StaffPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground">Staff</h1>

      {/* Custom Staff Page with Clerk data */}
      <CustomStaffPage />
    </div>
  );
}
