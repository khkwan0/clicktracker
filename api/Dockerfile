# Stage 1: build
FROM golang:1.23-alpine AS builder

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o main .

# Stage 2: minimal runtime
FROM alpine:3.20

RUN apk add --no-cache ca-certificates wget

WORKDIR /app

COPY --from=builder /usr/src/app/main .

EXPOSE 3000

CMD ["./main", "-port", "3000"]
