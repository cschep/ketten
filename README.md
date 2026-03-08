# KETTEN

This is the backend that powers the baby ketten karaoke song search. On the website and in the app. Written in Rails 8.

## Setup

```
docker compose up -d
bundle install
rails db:create db:schema:load db:seed
rails server
```

## Default Account

Seeds create a default admin user:

- Email: `admin@example.com`
- Password: `password`
