# StuRaEasterEgg

This repository deploys automatically to an SFTP server using GitHub Actions.

## Automatic deployment

A deployment runs on every push to the `main` branch (and can also be triggered manually).

Configure these repository secrets in GitHub before running deployments:

- `SFTP_HOST`
- `SFTP_PORT` (optional, defaults to `22`)
- `SFTP_USERNAME`
- `SFTP_PASSWORD`
- `SFTP_REMOTE_DIR`
