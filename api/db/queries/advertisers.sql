-- name: GetAdvertiserByID :one
SELECT * FROM advertisers WHERE id = $1 LIMIT 1;

-- name: GetAllAdvertisers :many
SELECT * FROM advertisers WHERE is_active = TRUE AND is_deleted = FALSE;

-- name: CreateAdvertiser :one
INSERT INTO advertisers (name, url, logo, description, phone, email, address, city, state, zip, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;

-- name: UpdateAdvertiser :one
UPDATE advertisers SET name = $2, url = $3, logo = $4, description = $5, phone = $6, email = $7, address = $8, city = $9, state = $10, zip = $11, country = $12 WHERE id = $1 RETURNING *;

-- name: DeleteAdvertiser :one
DELETE FROM advertisers WHERE id = $1 RETURNING *;