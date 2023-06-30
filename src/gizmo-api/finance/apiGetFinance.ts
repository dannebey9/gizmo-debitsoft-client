import { z } from "zod"
import { getConfigApi } from "../_credentials/credentials"
import { gizmoApi } from "../GizmoApi"
import { DateStringSchema } from "../../shared/types/DateStringSchema"

const DepositSchema = z.object({
  createdTime: z.string(),
  transactionType: z.number(),
  paymentMethodId: z.number(),
  paymentMethodName: z.string(),
  amount: z.number(),
  quantity: z.number(),
  total: z.number(),
  operatorId: z.null(),
  userGroupId: z.number(),
  isGuest: z.boolean(),
  isVoid: z.boolean(),
})

const GroupInvoiceProductSchema = z.object({
  id: z.number(),
  productName: z.string(),
  unitPrice: z.number(),
  unitCost: z.number(),
  quantity: z.number(),
  totalCost: z.number(),
  value: z.number(),
  pointsValue: z.number(),
  pointsAward: z.number(),
  taxRate: z.number(),
  tax: z.number(),
  isInBundle: z.boolean(),
})

const GroupInvoiceSchema = z.object({
  name: z.null(),
  fixedTimeProductsSold: z.array(GroupInvoiceProductSchema),
  sessionTimeProductsSold: z.array(GroupInvoiceProductSchema),
  timeOffersSold: z.array(GroupInvoiceProductSchema),
  productsSold: z.array(GroupInvoiceProductSchema),
  bundlesSold: z.array(GroupInvoiceProductSchema),
})

const DepositsSummarySchema = z.object({
  paymentMethodId: z.number(),
  paymentMethodName: z.string(),
  quantity: z.number(),
  value: z.number(),
  invoiceIsVoided: z.boolean(),
})

const SalesSummarySchema = z.object({
  paymentMethodId: z.number(),
  paymentMethodName: z.string(),
  quantity: z.number(),
  value: z.number(),
  invoiceIsVoided: z.boolean(),
})

const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const RegisterTransactionSchema = z.object({
  createdTime: z.string(),
  transactionType: z.number(),
  paymentMethodName: z.string(),
  amount: z.number(),
  quantity: z.number(),
  total: z.number(),
  operatorId: z.null(),
})

const ResultSchema = z.object({
  operatorId: z.null(),
  operatorName: z.null(),
  registerId: z.null(),
  registerName: z.null(),
  financialReportType: z.number(),
  deposits: z.array(DepositSchema),
  withdrawals: z.array(z.unknown()),
  depositVoids: z.array(z.unknown()),
  groupInvoices: z.array(GroupInvoiceSchema),
  groupVoidInvoices: z.array(GroupInvoiceSchema),
  depositsSummary: z.array(DepositsSummarySchema),
  salesSummary: z.array(SalesSummarySchema),
  voidInvoicesPaidCash: z.array(z.unknown()),
  voidInvoicesNoRefundOrUnpaid: z.object({
    paymentMethodId: z.number(),
    paymentMethodName: z.null(),
    quantity: z.number(),
    value: z.number(),
    invoiceIsVoided: z.boolean(),
  }),
  pastSalesPaymentsSummary: z.array(z.unknown()),
  paymentMethods: z.array(PaymentMethodSchema),
  registerTransactions: z.array(RegisterTransactionSchema),
  name: z.null(),
  dateFrom: z.string(),
  dateTo: z.string(),
  companyName: z.string(),
  reportType: z.number(),
})

const ApiResponseSchema = z.object({
  version: z.null(),
  result: ResultSchema,
  httpStatusCode: z.number(),
  message: z.null(),
  isError: z.boolean(),
})

const paramsSchema = z.object({
  dateFrom: DateStringSchema,
  dateTo: DateStringSchema,
})

type ParamsType = z.infer<typeof paramsSchema>

const TAG = "apiGetFinance.ts"

export const apiGetFinance = async (date: ParamsType, userId: number) => {
  try {
    const { headers, url } = await getConfigApi(userId)
    const response = await gizmoApi
      .get(`${url}reports/financial`, {
        headers,
        searchParams: { DateFrom: date.dateFrom, DateTo: date.dateTo, FinancialReportType: 3 },
      })
      .json()

    const validationResult = ApiResponseSchema.safeParse(response)

    if (validationResult.success) {
      return validationResult.data.result // Return the validated data
    } else {
      console.error(`${TAG} Validation error:`, validationResult.error)
      throw new Error(`${TAG} API data validation failed.`)
    }
  } catch (error) {
    console.error(`${TAG} API request error:`, error)
    throw error // Propagate the error to be handled outside of this function
  }
}
