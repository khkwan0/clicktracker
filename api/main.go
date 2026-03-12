package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	port := flag.String("port", "3000", "port to listen on")
	flag.Parse()
	addr := ":" + *port
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})
	http.HandleFunc("/click", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		aid := r.URL.Query().Get("aid")
		oid := r.URL.Query().Get("oid")
		afid := r.URL.Query().Get("afid")
		if aid == "" || oid == "" || afid == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		log.Printf("click: aid=%q oid=%q afid=%q", aid, oid, afid)
		w.WriteHeader(http.StatusOK)
	})

	log.Printf("Listening on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
