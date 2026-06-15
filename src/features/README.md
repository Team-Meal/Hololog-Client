# features (FSD layer)

User-facing interactions that deliver business value (e.g. `auth/login`,
`post/like`). A feature owns its `ui`, `model` (state), and `api` segments. Features
may use `entities` and `shared`; they must not import from other features, `widgets`,
or `views`.
