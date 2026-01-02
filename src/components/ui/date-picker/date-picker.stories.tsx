'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { DatePicker, DateTimePicker } from './date-picker';

const meta = {
  title: 'UI/Form/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Pick a date',
  },
};

export const WithValue: Story = {
  args: {
    value: new Date('2024-06-15'),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled date picker',
  },
};

export const DisabledWithValue: Story = {
  args: {
    disabled: true,
    value: new Date('2024-06-15'),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Select start date',
  },
};

function ControlledDatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
      <p className="text-sm text-muted-foreground">
        Selected:
        {' '}
        {date ? date.toISOString().split('T')[0] : 'None'}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDatePicker />,
};

// DateTimePicker Stories
const _dateTimeMeta = {
  title: 'UI/Form/DateTimePicker',
  component: DateTimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    datePlaceholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof DateTimePicker>;

type DateTimeStory = StoryObj<typeof _dateTimeMeta>;

export const DateTimeDefault: DateTimeStory = {
  render: () => (
    <DateTimePicker
      datePlaceholder="Pick a date"
    />
  ),
};

export const DateTimeWithValue: DateTimeStory = {
  render: () => (
    <DateTimePicker
      date="2024-06-15"
      time="14:30:00"
    />
  ),
};

export const DateTimeWithLabels: DateTimeStory = {
  render: () => (
    <DateTimePicker
      date="2024-06-15"
      time="14:30:00"
      dateLabel="Start Date"
      timeLabel="Start Time"
    />
  ),
};

export const DateTimeDisabled: DateTimeStory = {
  render: () => (
    <DateTimePicker
      date="2024-06-15"
      time="14:30:00"
      disabled
      dateLabel="Start Date"
      timeLabel="Start Time"
    />
  ),
};

function ControlledDateTimePicker() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('00:00:00');
  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker
        date={date}
        time={time}
        onDateChange={setDate}
        onTimeChange={setTime}
        dateLabel="Event Date"
        timeLabel="Event Time"
      />
      <p className="text-sm text-muted-foreground">
        Selected:
        {' '}
        {date || 'No date'}
        {' '}
        {time || 'No time'}
      </p>
    </div>
  );
}

export const DateTimeControlled: DateTimeStory = {
  render: () => <ControlledDateTimePicker />,
};

export const States: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Default</p>
        <DatePicker placeholder="Pick a date" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">With Value</p>
        <DatePicker value={new Date('2024-06-15')} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Disabled</p>
        <DatePicker disabled placeholder="Disabled" />
      </div>
    </div>
  ),
};
