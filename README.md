# img
Simple, fast, end-to-end encrypted, temporary image sharing.

## Run

The container runs as user `1000:1000`, so the data directory must be writable by it.

```sh
mkdir data && sudo chown 1000:1000 data
docker run -d --name img --init -p 3000:3000 -v ./data:/data nylyk/img
```

Or with Docker Compose:

```yaml
services:
  img:
    image: nylyk/img
    container_name: img
    init: true
    restart: unless-stopped
    ports:
      - 3000:3000
    volumes:
      - ./data:/data
```

The app is then available at http://localhost:3000. Put it behind a reverse proxy with HTTPS, because the browser only allows encryption in a secure context.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `POST_MAX_SIZE_BYTES` | `26214400` | Maximum size of an encrypted post |
| `POST_EXPIRE_TIMES_SECONDS` | `3600,86400,604800,2592000` | Selectable expiry times |
| `POST_DEFAULT_EXPIRE_TIME_SECONDS` | `86400` | Preselected expiry time |
| `CLEANUP_INTERVAL_SECONDS` | `600` | Interval for deleting expired posts |
| `FOOTER` | | Footer text |
| `FOOTER_LINK_TITLE_<NAME>`, `FOOTER_LINK_URL_<NAME>` | | Footer link |
