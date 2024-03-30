FROM rust:1.77-alpine AS build

RUN apk add libc-dev

WORKDIR /app

COPY ./Cargo.toml ./Cargo.lock ./

RUN mkdir src
RUN echo 'fn main() {}' > src/main.rs
RUN cargo build --release

COPY ./.sqlx ./.sqlx
COPY ./migrations ./migrations
COPY ./src ./src

RUN cargo build --release

FROM alpine

WORKDIR /app

COPY --from=build /app/target/release/backend ./backend

CMD [ "./backend" ]
