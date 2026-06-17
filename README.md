# StuRaEasterEgg

This repository deploys automatically to an SFTP server using GitHub Actions.

## Automatic deployment

A deployment runs on every push to the `main` branch (and can also be triggered manually).

Configure these repository secrets in GitHub before running deployments:

- `SFTP_HOST`
- `SFTP_PORT` (optional, defaults to `22`)
- `SFTP_USERNAME`
- `SFTP_REMOTE_DIR`
- `SFTP_PASSWORD` (required if `SFTP_PRIVATE_KEY` is not set)
- `SFTP_PRIVATE_KEY` (optional alternative to password authentication)

> [!WARNING]
> The deployment uses `mirror -R --delete`, so files in `SFTP_REMOTE_DIR` that are not present in this repository will be removed from the server (including files created manually on the server). On first deployment to a non-empty directory, anything not tracked in this repository is deleted. Use a staging directory first if you need a safer rollout.
