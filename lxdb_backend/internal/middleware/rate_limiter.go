package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type clientInfo struct {
	lastReset time.Time
	requests  int
}

var (
	clients   = make(map[string]*clientInfo)
	clientsMu sync.Mutex
)

func RateLimiter(maxRequests int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		now := time.Now()

		clientsMu.Lock()
		info, ok := clients[ip]
		if !ok || now.Sub(info.lastReset) > window {
			info = &clientInfo{lastReset: now, requests: 0}
			clients[ip] = info
		}
		info.requests++
		count := info.requests
		clientsMu.Unlock()

		if count > maxRequests {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"message": "Too many requests",
			})
			return
		}

		c.Next()
	}
}
