package repository

import (
	"context"
	"time"

	"lxdb_backend/internal/models"
	"lxdb_backend/internal/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

const queryTimeout = 30 * time.Second

func GetDocuments(pool *pgxpool.Pool) ([]models.Document, error) {
	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	rows, err := pool.Query(ctx, "SELECT id, full_title, short_title, published_at, authority, country FROM documents ORDER BY published_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var documents []models.Document

	for rows.Next() {
		var doc models.Document
		if err := rows.Scan(&doc.ID, &doc.FullTitle, &doc.ShortTitle, &doc.PublishedAt, &doc.Authority, &doc.Country); err != nil {
			return nil, err
		}
		documents = append(documents, doc)
	}

	return documents, rows.Err()
}

func GetDocument(pool *pgxpool.Pool, id uuid.UUID) (models.Document, error) {
	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	var document models.Document

	err := pool.QueryRow(ctx, "SELECT id, full_title, short_title, published_at, authority, file, country, text FROM documents WHERE id = $1", id).Scan(&document.ID, &document.FullTitle, &document.ShortTitle, &document.PublishedAt, &document.Authority, &document.File, &document.Country, &document.Text)

	if err != nil {
		return models.Document{}, err
	}

	client, err := utils.NewMinioClient()
	if err != nil {
		return models.Document{}, err
	}

	signedUrl, _ := utils.GetSignedURL(client, document.File)
	document.File = signedUrl

	return document, nil
}

func SaveDocuments(pool *pgxpool.Pool, documents []models.Document) error {
	if len(documents) == 0 {
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	stmt := `INSERT INTO documents (id, full_title, short_title, published_at, authority, file, country, text)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (id) DO NOTHING`

	for _, d := range documents {
		if _, err := tx.Exec(ctx, stmt, d.ID, d.FullTitle, d.ShortTitle, d.PublishedAt, d.Authority, d.File, d.Country, d.Text); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
