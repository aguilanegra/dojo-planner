'use client';

import type { Transaction, TransactionStatus } from './FinancesTable';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type TransactionDetailModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  transaction: Transaction | null;
};

const statusVariantMap: Record<TransactionStatus, 'default' | 'secondary' | 'destructive' | 'outline' | 'warning'> = {
  paid: 'default',
  pending: 'outline',
  declined: 'destructive',
  refunded: 'warning',
  processing: 'outline',
};

// Mock detailed transaction data for demonstration (test-data, not real values)
// These represent different transaction scenarios a dojo might have
type TransactionDetail = {
  type: 'membership' | 'family_membership' | 'product' | 'seminar';
  membershipDetails?: {
    planName: string;
    frequency: string;
    startDate: string;
    nextPaymentDate: string;
  };
  familyMembers?: Array<{
    id: string;
    name: string;
    dueAmount: string;
    program: string;
  }>;
  productDetails?: {
    items: Array<{
      name: string;
      quantity: number;
      price: string;
    }>;
    subtotal: string;
    tax: string;
    total: string;
  };
  seminarDetails?: {
    name: string;
    instructor: string;
    date: string;
    location: string;
  };
};

// Mock function to get detailed transaction data based on purpose
function getTransactionDetails(transaction: Transaction): TransactionDetail {
  switch (transaction.purpose) {
    case 'Membership Dues':
      // Randomly assign family or individual membership based on member ID
      if (transaction.memberId === 'M001' || transaction.memberId === 'M004') {
        return {
          type: 'family_membership',
          membershipDetails: {
            planName: 'Family Gold Membership',
            frequency: 'Monthly',
            startDate: 'January 1, 2024',
            nextPaymentDate: 'May 15, 2025',
          },
          familyMembers: [
            { id: 'FM001', name: transaction.memberName, dueAmount: '$80.00', program: 'Adult BJJ' },
            { id: 'FM002', name: 'Alex Smith', dueAmount: '$40.00', program: 'Kids BJJ' },
            { id: 'FM003', name: 'Emma Smith', dueAmount: '$40.00', program: 'Kids BJJ' },
          ],
        };
      }
      return {
        type: 'membership',
        membershipDetails: {
          planName: 'Individual Monthly Membership',
          frequency: 'Monthly',
          startDate: 'March 15, 2024',
          nextPaymentDate: 'May 15, 2025',
        },
      };
    case 'Merchandise':
      return {
        type: 'product',
        productDetails: {
          items: [
            { name: 'BJJ Gi - White', quantity: 1, price: '$65.00' },
            { name: 'Rashguard - Black', quantity: 1, price: '$35.00' },
          ],
          subtotal: '$100.00',
          tax: '$8.00',
          total: transaction.amount,
        },
      };
    case 'Seminar':
      return {
        type: 'seminar',
        seminarDetails: {
          name: 'Advanced Guard Passing Seminar',
          instructor: 'Professor Garcia',
          date: 'April 22, 2024',
          location: 'Main Academy',
        },
      };
    case 'Private Lesson':
      return {
        type: 'product',
        productDetails: {
          items: [
            { name: 'Private Lesson - 1 Hour', quantity: 1, price: '$50.00' },
          ],
          subtotal: '$50.00',
          tax: '$0.00',
          total: transaction.amount,
        },
      };
    default:
      return {
        type: 'membership',
        membershipDetails: {
          planName: 'Standard Membership',
          frequency: 'Monthly',
          startDate: 'January 1, 2024',
          nextPaymentDate: 'May 15, 2025',
        },
      };
  }
}

export function TransactionDetailModal({
  isOpen,
  onCloseAction,
  transaction,
}: TransactionDetailModalProps) {
  const t = useTranslations('TransactionDetailModal');

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      onCloseAction();
    }
  }, [onCloseAction]);

  if (!transaction) {
    return null;
  }

  const details = getTransactionDetails(transaction);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Summary */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{transaction.memberName}</h3>
                <p className="text-sm text-muted-foreground">{transaction.transactionId}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{transaction.amount}</p>
                <Badge variant={statusVariantMap[transaction.status]}>
                  {t(`status_${transaction.status}`)}
                </Badge>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('date_label')}</span>
                <p className="font-medium">{transaction.date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('method_label')}</span>
                <p className="font-medium">{transaction.method}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('purpose_label')}</span>
                <p className="font-medium">{transaction.purpose}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('type_label')}</span>
                <p className="font-medium">{t(`type_${details.type}`)}</p>
              </div>
            </div>
          </div>

          {/* Membership Details */}
          {details.type === 'membership' && details.membershipDetails && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('membership_details_title')}</h4>
              <div className="rounded-lg border border-border p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('plan_name_label')}</span>
                    <p className="font-medium">{details.membershipDetails.planName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('frequency_label')}</span>
                    <p className="font-medium">{details.membershipDetails.frequency}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('start_date_label')}</span>
                    <p className="font-medium">{details.membershipDetails.startDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('next_payment_label')}</span>
                    <p className="font-medium">{details.membershipDetails.nextPaymentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Family Membership Details */}
          {details.type === 'family_membership' && details.membershipDetails && details.familyMembers && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('family_membership_title')}</h4>
              <div className="rounded-lg border border-border p-4">
                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('plan_name_label')}</span>
                    <p className="font-medium">{details.membershipDetails.planName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('frequency_label')}</span>
                    <p className="font-medium">{details.membershipDetails.frequency}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-sm font-medium text-foreground">{t('family_members_label')}</p>
                  <div className="space-y-2">
                    {details.familyMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{member.name}</span>
                          <span className="ml-2 text-muted-foreground">
                            (
                            {member.program}
                            )
                          </span>
                        </div>
                        <span className="font-medium">{member.dueAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Purchase Details */}
          {details.type === 'product' && details.productDetails && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('product_details_title')}</h4>
              <div className="rounded-lg border border-border p-4">
                <div className="space-y-2">
                  {details.productDetails.items.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-muted-foreground">
                          x
                          {item.quantity}
                        </span>
                      </div>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subtotal_label')}</span>
                    <span>{details.productDetails.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('tax_label')}</span>
                    <span>{details.productDetails.tax}</span>
                  </div>
                  <div className="mt-2 flex justify-between font-semibold">
                    <span>{t('total_label')}</span>
                    <span>{details.productDetails.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seminar Details */}
          {details.type === 'seminar' && details.seminarDetails && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('seminar_details_title')}</h4>
              <div className="rounded-lg border border-border p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{t('seminar_name_label')}</span>
                    <p className="font-medium">{details.seminarDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('instructor_label')}</span>
                    <p className="font-medium">{details.seminarDetails.instructor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('seminar_date_label')}</span>
                    <p className="font-medium">{details.seminarDetails.date}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('location_label')}</span>
                    <p className="font-medium">{details.seminarDetails.location}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction}>
            {t('close_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
