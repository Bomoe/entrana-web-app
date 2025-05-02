package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type DB struct {
	Pool *pgxpool.Pool
}

func New(dsn string) (*DB, error) {
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("error parsing database DSN: %w", err)
	}

	// Set pool configuration
	config.MaxConns = 25                      // Maximum number of connections in the pool
	config.MinConns = 5                       // Minimum number of connections in the pool
	config.MaxConnLifetime = 1 * time.Hour    // Maximum connection lifetime
	config.MaxConnIdleTime = 30 * time.Minute // Maximum idle time for a connection

	// Create connection pool
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("error creating connection pool: %w", err)
	}

	// Verify connection
	if err := pool.Ping(context.Background()); err != nil {
		pool.Close()
		return nil, fmt.Errorf("error pinging database: %w", err)
	}

	return &DB{Pool: pool}, nil
}

func (db *DB) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
}

// OpenDB initializes a database connection using the DATABASE_URL from .env
func OpenDB() (*DB, error) {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	// Get DATABASE_URL from environment
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL not found in environment")
	}

	return New(databaseURL)
}
