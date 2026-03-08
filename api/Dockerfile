FROM ubuntu:latest

ADD https://go.dev/dl/go1.26.1.linux-amd64.tar.gz /tmp
RUN rm -rf /usr/local/go
RUN tar -C /usr/local -xzf /tmp/go1.26.1.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN go build -o main main.go

CMD ./main
