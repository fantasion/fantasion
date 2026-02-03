# fantasion-backend

The API and administration backend for Fantasion. Written in Django.

## Requirements

Make sure you're running current version of Python and have `uv <https://docs.astral.sh/uv/>`_ installed.

## Installation

Install dependencies

```shell
uv sync
```

Create local database

```shell
uv run ./manage.py migrate
```

## Run local server

```shell
uv run ./manage.py runserver
```
