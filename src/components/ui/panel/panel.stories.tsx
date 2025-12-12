import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Panel, PanelContent, PanelFooter, PanelHeader, PanelTabs } from './panel';

const meta: Meta<typeof Panel> = {
  title: 'UI/Containers/Panel',
  component: Panel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: () => (
    <Panel>
      <PanelHeader
        title="Panel Title"
        actions={<Button>Action</Button>}
      />
      <PanelContent padded>
        <p>Panel content goes here.</p>
      </PanelContent>
    </Panel>
  ),
};

export const WithTabs: Story = {
  render: () => (
    <Panel>
      <Tabs defaultValue="all">
        <PanelHeader withDivider={true}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-medium text-foreground">My Users</h2>
              <div className="flex gap-2">
                <Button>Add User</Button>
              </div>
            </div>
            <PanelTabs>
              <TabsList className="h-auto bg-transparent p-0">
                <TabsTrigger value="all" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">All</TabsTrigger>
                <TabsTrigger value="admins" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">Admins</TabsTrigger>
                <TabsTrigger value="coaches" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">Coaches</TabsTrigger>
              </TabsList>
            </PanelTabs>
          </div>
        </PanelHeader>
        <TabsContent value="all" className="mt-0">
          <PanelContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Coach</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </PanelContent>
        </TabsContent>
      </Tabs>
      <PanelFooter>
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          onPageChangeAction={() => {}}
        />
      </PanelFooter>
    </Panel>
  ),
};
