---
title: Manage company credit
description: Learn how to manage company credit limits, available credit, and outstanding balances.
keywords:
  - B2B
  - REST
---

import CommerceOnly from '/src/_includes/commerce-only.md'

<CommerceOnly />

# Manage company credit

The company credit entity operates with the following attributes:

-  Credit limit
-  Available credit
-  Outstanding balance

The credit limit is allocated by seller, while available credit and outstanding balance are automatically calculated by the system based on the buyer transactions (place an order, return) and seller's transactions (refund, reimburse, update credit limit, cancel order).

## Manage company credit limits

When you create a company, the credit limit is set to 0. Use the `PUT /V1/companyCredits/:id` call to change this value and perform other updates to the company's credit settings.

**REST Endpoints:**

```terminal
PUT /V1/companyCredits/:id
GET /V1/companyCredits/:creditId
GET /V1/companyCredits/company/:companyId
GET /V1/companyCredits/
```

**Company credit parameters:**

Name | Description | Format | Requirements
--- | --- | --- | ---
`id` | The credit ID generated by the system | Integer | Required
`company_id` | Company ID | Integer | Required
`credit_limit` | The amount of credit granted to the company | Float | Required
`balance` | The amount the company currently owes the seller | Float | Optional
`currency_code` | The currency code for the company's credit, such as USD | String | Required
`exceed_limit` | Indicates whether the company can exceed their credit limit | Boolean  | Optional
`available_limit` | The amount of credit currently available to the company | Float | Optional
`credit_comment` | Describes the change being made | String | Optional

### Update a company credit limit

This call changes the company's credit limit to $1000. The `available_limit` parameter is calculated, so you cannot specify the value.

**Service Name:**

`companyCreditCreditLimitRepositoryV1`

**Sample Usage:**

`PUT <host>/rest/<store_code>/V1/companyCredits/2`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
{
  "creditLimit": {
  "id": 2,
  "company_id": 2,
  "credit_limit": 1000,
  "currency_code": "USD"
  }
}
```

#### Response

```json
{
    "id": 2,
    "company_id": 2,
    "credit_limit": 1000,
    "balance": 0,
    "currency_code": "USD",
    "exceed_limit": false,
    "available_limit": 1000
}
```

### Get details about a company's credit limit using credit ID

This call returns data on the credit limit for the specified credit ID.

**Service Name:**

`companyCreditCreditLimitRepositoryV1`

**Sample Usage:**

`GET <host>/rest/<store_code>/V1/companyCredits/2`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
// Not applicable
```

#### Response

```json
{
  "id": 2,
  "company_id": 2,
  "credit_limit": 500,
  "balance": 0,
  "currency_code": "USD",
  "exceed_limit": false,
  "available_limit": 500
}
```

### Get details about a company's credit limit using company ID

This call returns information about the credit limit for a specified company.

**Service Name:**

`companyCreditCreditLimitManagementV1`

**Sample Usage:**

`GET <host>/rest/<store_code>/V1/companyCredits/company/2`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
// Not applicable
```

#### Response

```json
{
  "id": 2,
  "company_id": 2,
  "credit_limit": 500,
  "balance": 0,
  "currency_code": "USD",
  "exceed_limit": false,
  "available_limit": 500
}
```

### Search credit IDs

The following call returns information for all companies whose credit balance is 0.

See [Search using REST APIs](../use-rest/performing-searches.md) for information about constructing a search query.

**Sample Usage:**

`GET <host>/rest/<store_code>/V1/companyCredits?searchCriteria[filter_groups][0][filters][0][field]=balance&searchCriteria[filter_groups][0][filters][0][value]=0&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
// Not applicable
```

#### Response

```json
{
    "items": [
        {
            "id": 2,
            "company_id": 2,
            "credit_limit": 1000,
            "balance": 0,
            "currency_code": "USD",
            "exceed_limit": false,
            "available_limit": 1000
        },
        {
            "id": 3,
            "company_id": 3,
            "balance": 0,
            "currency_code": "USD",
            "exceed_limit": false,
            "available_limit": 0
        },
        {
            "id": 4,
            "company_id": 4,
            "credit_limit": 2000,
            "balance": 0,
            "currency_code": "USD",
            "exceed_limit": false,
            "available_limit": 2000
        }
    ],
    "search_criteria": {
        "filter_groups": [
            {
                "filters": [
                    {
                        "field": "balance",
                        "value": "0",
                        "condition_type": "eq"
                    }
                ]
            }
        ]
    },
    "total_count": 3
}
```

## Balance operations

The company's outstanding balance can be updated as the buyer makes payments, purchases, and other transactions.

**Service Name:**

`companyCreditCreditBalanceManagementV1`

**REST Endpoints:**

```terminal
POST /V1/companyCredits/:creditId/decreaseBalance
POST /V1/companyCredits/:creditId/increaseBalance
```

**Balance Parameters:**

Name | Description | Format | Requirements
--- | --- | --- | ---
`value` | Indicates how much money is involved in this company credit balance operation. | Number | Required
`currency` | The currency of the transaction, such as USD | String | Required
`operationType` | Must be one of the following: 1 - Allocated; 2 - Updated; 3 - Purchased; 4 - Reimbursed; 5 - Refunded; 6 - Reverted | Integer | Required
`comment` | Describers the operation | String | Optional
`options` | An object that provides additional information for increasing or decreasing the credit balance | Object | Optional

**`options` parameters:**

Name | Description | Format | Requirements
--- | --- | --- | ---
`purchase_order` | The company's purchase order number  | String | Optional
`order_increment` | Order increment | String | Optional
`currency_display` | Currency code for displaying the operation | String | Optional
`currency_base` | The base currency | String | Optional

### Increase the company credit balance

This call increases the company credit with an Allocate, Update, Refund, Revert, or Reimburse transaction. (You cannot specify the Purchased (3) operation type.) This call also decreases the company's outstanding balance.

**Sample Usage:**

`POST <host>/rest/<store_code>/V1/companyCredits/2/increaseBalance`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
{
  "value": 250,
  "currency": "USD",
  "operationType": 2,
  "comment": "update limit"
}
```

#### Response

```json
// `true`, indicating the increase to the company credit balance succeeded
```

### Decrease the balance

This call decreases the company credit with an Update (operation type = 2), Purchased (3), or Reimbursed (4) transaction. (You cannot specify the other operation types.) This call also increases company's outstanding balance.

**Sample Usage:**

`POST <host>/rest/<store_code>/V1/companyCredits/2/decreaseBalance`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
{
  "value": 250,
  "currency": "USD",
  "operationType": 4,
  "comment": "issue refund"
}
```

#### Response

```json
// `true`, indicating the decrease to the company credit balance succeeded
```

## Credit history

A Reimburse transaction can be updated to include a purchase order and comment.

**Service Name:**
`companyCreditCreditHistoryManagementV1`

**REST Endpoints:**

```text
GET /V1/companyCredits/history
PUT /V1/companyCredits/history/:historyId
```

### Save the credit history

This call updates the credit history to specify a purchase order number.

**Sample Usage:**

`PUT <host>/rest/<store_code>/V1/companyCredits/history/6`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
{
  "purchaseOrder": "A12345",
  "comment": "Adding PO info"
}
```

#### Response

```json
// `true`, indicating the call was successful
```

### Search credit history IDs

The following call returns a list instances in which the credit limit was set to a value higher than $500.

See [Search using REST APIs](../use-rest/performing-searches.md) for information about constructing a search query.

**Sample Usage:**

`GET <host>/rest/<store_code>/V1/companyCredits/history?searchCriteria[filter_groups][0][filters][0][field]=credit_limit&searchCriteria[filter_groups][0][filters][0][value]=500&searchCriteria[filter_groups][0][filters][0][condition_type]=gt`

<CodeBlock slots="heading, code" repeat="2" languages="JSON, JSON" />

#### Payload

```json
// Not applicable
```

#### Response

```json
{
    "items": [
        {
            "id": 6,
            "company_credit_id": 2,
            "user_id": 1,
            "user_type": 2,
            "currency_credit": "USD",
            "currency_operation": "USD",
            "rate": 1,
            "rate_credit": 0,
            "amount": -250,
            "balance": 0,
            "credit_limit": 1000,
            "available_limit": 1000,
            "type": 4,
            "datetime": "2017-06-12 02:26:28",
            "purchase_order": "A12345",
            "comment": "{\"custom\":\"Adding PO info\"}"
        },
        {
            "id": 7,
            "company_credit_id": 4,
            "user_id": 1,
            "user_type": 2,
            "currency_credit": "USD",
            "currency_operation": "USD",
            "rate": 1,
            "rate_credit": 0,
            "amount": 0,
            "balance": 0,
            "credit_limit": 2000,
            "available_limit": 2000,
            "type": 1,
            "datetime": "2017-07-20 21:28:35",
            "comment": ""
        }
    ],
    "search_criteria": {
        "filter_groups": [
            {
                "filters": [
                    {
                        "field": "credit_limit",
                        "value": "500",
                        "condition_type": "gt"
                    }
                ]
            }
        ]
    },
    "total_count": 2
}
```
