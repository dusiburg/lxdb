package models

import (
	"time"

	"github.com/google/uuid"
)

type Document struct {
	ID          uuid.UUID `json:"id" db:"id"`
	FullTitle   string    `json:"full_title" db:"full_title"`
	ShortTitle  string    `json:"short_title" db:"short_title"`
	PublishedAt time.Time `json:"published_at" db:"published_at"`
	Authority   string    `json:"authority" db:"authority"`
	File        string    `json:"file" db:"file"`
	Country     string    `json:"country" db:"country"`
	Text        string    `json:"text" db:"text"`
}
