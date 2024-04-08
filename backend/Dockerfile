FROM rust:1.77-alpine AS build

RUN apk add libc-dev

WORKDIR /app

RUN \
  --mount=source=Cargo.lock,target=Cargo.lock \
  --mount=source=Cargo.toml,target=Cargo.toml \
  --mount=source=src,target=src \
  --mount=source=.sqlx,target=.sqlx \
  --mount=source=migrations,target=migrations \
  --mount=type=cache,target=target \
  --mount=type=cache,target=/usr/local/cargo/registry \
  cargo build --release && cp ./target/release/backend /app/backend

FROM alpine

WORKDIR /app

COPY --from=build /app/backend ./backend

CMD [ "./backend" ]
