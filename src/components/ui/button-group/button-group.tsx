'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/Helpers';

type ButtonGroupContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const ButtonGroupContext = React.createContext<ButtonGroupContextType | undefined>(undefined);

type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

function ButtonGroup({ className, value, onValueChange, ...props }: ButtonGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn('inline-flex items-center gap-0 overflow-hidden rounded-md border border-border', className)}
      {...props}
    />
  );
}

type ButtonGroupItemProps = React.ComponentPropsWithoutRef<typeof Button> & {
  value: string;
};

function ButtonGroupItem({ className, value, onClick, ...props }: ButtonGroupItemProps) {
  const buttonGroup = React.use(ButtonGroupContext);

  return (
    <Button
      size="sm"
      variant={buttonGroup?.value === value ? 'default' : 'ghost'}
      className={cn('flex items-center justify-center rounded-none', className)}
      onClick={(e) => {
        buttonGroup?.onValueChange?.(value);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

// Wrapper component that manages state
type ButtonGroupRootProps = ButtonGroupProps;

export function ButtonGroupRoot({ value, onValueChange, children, ...props }: ButtonGroupRootProps) {
  const contextValue = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);

  return (
    <ButtonGroupContext value={contextValue}>
      <ButtonGroup {...props}>
        {children}
      </ButtonGroup>
    </ButtonGroupContext>
  );
}

export { ButtonGroup, ButtonGroupItem };
