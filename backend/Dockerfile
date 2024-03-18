FROM rust AS build

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
