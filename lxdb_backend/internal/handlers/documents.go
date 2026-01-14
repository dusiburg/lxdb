package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"lxdb_backend/internal/db"
	"lxdb_backend/internal/models"
	"lxdb_backend/internal/parsers"
	"lxdb_backend/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetDocuments(c *gin.Context) {
	documents, err := repository.GetDocuments(db.Pool)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal error occurred"})
		return
	}

	if len(documents) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Documents not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"documents": documents})
}

func GetDocument(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Document ID required"})
		return
	}

	document, err := repository.GetCashedDocument(db.Redis, db.Pool, id)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal error occurred"})
		return
	}

	if document.ID == uuid.Nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Document not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"document": document})
}

func GetParsedDocuments(c *gin.Context) {
	documents, err := parsers.ParseDocuments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal error occurred"})
		return
	}

	if len(documents) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Documents not found"})
		return
	}

	if err := repository.SaveDocuments(db.Pool, documents); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal error occurred"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"documents": documents})
}

func CreateDocument(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Missing or invalid token"})
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	if token != os.Getenv("TOKEN") {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid token"})
		return
	}

	var document models.Document
	if err := c.ShouldBindJSON(&document); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid payload"})
		return
	}

	if document.FullTitle == "" || document.File == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Required fields missing"})
		return
	}

	document.ID = uuid.New()

	if err := repository.SaveDocuments(db.Pool, []models.Document{document}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save document"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"document": document})
}
