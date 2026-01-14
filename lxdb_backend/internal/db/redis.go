package db

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var Redis *redis.Client

func InitRedis() {
	opt, err := redis.ParseURL(os.Getenv("REDIS_URL"))

	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	Redis = redis.NewClient(opt)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := Redis.Ping(ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
}
