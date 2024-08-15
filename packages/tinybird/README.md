## Getting Started

First time:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install tinybird-cli
tb auth
```

More notes: [Quickstart](https://www.tinybird.co/docs/quick-start-cli.html)

Thereafter:

```sh
source .venv/bin/activate
```

### Docker

You can also use the Docker image. This worked a lot better for me.

Run the following from this directory:

```sh
docker run -v .:/mnt/data -it tinybirdco/tinybird-cli-docker
```

Then within Docker:

```sh
cd mnt/data
```

Now you can run `tb` commands. First you'll want to run `tb auth` to sign in.

## Datasource

```sh
tb push datasources
# or:
tb push datasources/comment.datasource
```

## Pipe

```sh
tb push pipes
# or:
tb push pipes/get_comments_by_period.pipe
# or to force changes:
tb push pipes --force --no-check
```

## Switch workspace

```sh
tb workspace ls # list workspaces
tb workspace use <workspace_name>
```
