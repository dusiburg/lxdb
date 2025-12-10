package utils

import (
	"context"
	"net/url"
	"os"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const (
	MinioEndpoint = "files.dusiburg.ru"
	MinioBucket   = "documents"
	URLExpiry     = 5 * time.Minute
	MinioTimeout  = 10 * time.Second
)

func NewMinioClient() (*minio.Client, error) {
	return minio.New(MinioEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(os.Getenv("S3_LOGIN"), os.Getenv("S3_PASSWORD"), ""),
		Secure: true,
	})
}

func GetSignedURL(client *minio.Client, objectKey string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), MinioTimeout)
	defer cancel()

	presignedURL, err := client.PresignedGetObject(ctx, MinioBucket, objectKey, URLExpiry, make(url.Values))
	if err != nil {
		return "", err
	}
	return presignedURL.String(), nil
}
