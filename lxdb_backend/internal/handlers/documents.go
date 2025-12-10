package handlers

import (
	"fmt"
	"net/http"

	"lxdb_backend/internal/db"
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

	document, err := repository.GetDocument(db.Pool, id)

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
