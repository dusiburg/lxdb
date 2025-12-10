package main

import (
	"log"
	"os"
	"time"

	"lxdb_backend/internal/db"
	"lxdb_backend/internal/handlers"
	"lxdb_backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found, relying on environment variables: %v", err)
	}

	port := os.Getenv("PORT")

	db.Init()
	defer db.Pool.Close()

	router := gin.Default()

	router.Use(middleware.RateLimiter(60, time.Minute))

	router.GET("/api/documents", handlers.GetDocuments)
	router.GET("/api/document/:id", handlers.GetDocument)

	//router.GET("/api/parse", handlers.GetParsedDocuments)

	log.Println("Server starting on port", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
