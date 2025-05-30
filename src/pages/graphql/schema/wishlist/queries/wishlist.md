---
title: wishlist query
edition: paas
---

# wishlist query

<InlineAlert variant="warning" slots="text" />

The `wishlist` query has been deprecated. Wish list information is now provided by the [customer](../../customer/queries/customer.md) query.

Use the `wishlist` query to retrieve information about a customer's wish list. [Authorization tokens](../../../usage/authorization-tokens.md) describes how to supply an authorization token for a specific customer.

## Syntax

`wishlist: WishlistOutput`

## Reference

The [`wishlist`](https://developer.adobe.com/commerce/webapi/graphql-api/index.html#query-wishlist) reference provides detailed information about the types and fields defined in this query.

## Example usage

The following query returns the customer's wish list:

**Request:**

```graphql
{
  wishlist {
    items_count
    name
    sharing_code
    updated_at
    items {
      id
      qty
      description
      added_at
      product {
        sku
        name
      }
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "wishlist": {
      "items_count": 2,
      "name": "Wish List",
      "sharing_code": "KAXDj0HlM7Y2s58mllsVhSJvRj4fWIZj",
      "updated_at": "2019-02-13 22:47:45",
      "items": [
        {
          "id": 1,
          "qty": 1,
          "description": "My first priority",
          "added_at": "2019-02-20 14:38:02",
          "product": {
            "sku": "MJ09",
            "name": "Taurus Elements Shell"
          }
        },
        {
          "id": 2,
          "qty": 1,
          "description": null,
          "added_at": "2019-02-20 14:38:28",
          "product": {
            "sku": "MSH11",
            "name": "Arcadio Gym Short"
          }
        }
      ]
    }
  }
}
```
