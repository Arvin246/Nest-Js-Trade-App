# Customer API – cURL examples for Postman

Base URL: `http://localhost:3000`

Use a valid MongoDB ObjectId (e.g. from a create response) in place of `:id` for GET/PATCH/DELETE.

---

## Create customer

```bash
curl --request POST \
  --url http://localhost:3000/customers \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1 555-123-4567"
}'
```

Minimal (no optional `phone`):

```bash
curl --request POST \
  --url http://localhost:3000/customers \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}'
```

---

## Get all customers

```bash
curl --request GET \
  --url http://localhost:3000/customers
```

---

## Get one customer by ID

```bash
curl --request GET \
  --url 'http://localhost:3000/customers/507f1f77bcf86cd799439011'
```

Replace `507f1f77bcf86cd799439011` with a real customer `_id` from create/list.

---

## Update customer (partial)

```bash
curl --request PATCH \
  --url 'http://localhost:3000/customers/507f1f77bcf86cd799439011' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Jane Smith",
  "phone": "+1 555-999-0000"
}'
```

You can send any subset of `name`, `email`, and `phone`. Replace the ID with a real customer `_id`.

---

## Delete customer

```bash
curl --request DELETE \
  --url 'http://localhost:3000/customers/507f1f77bcf86cd799439011'
```

Replace `507f1f77bcf86cd799439011` with the customer `_id` to delete.
