# Contributing to Codefolio

First off, thank you for considering contributing to Codefolio! We welcome any contributions, from fixing typos to implementing major new features. This document provides a set of guidelines to help make the contribution process smooth and effective for everyone.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior. 
## How Can I Contribute?

There are many ways to contribute to Codefolio:

*   **Reporting Bugs:** If you find a bug, please open an issue and provide as much detail as possible, including steps to reproduce it.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue to start a discussion.
*   **Pull Requests:** If you're ready to contribute code, you can open a pull request.

## Setting Up Your Development Environment

To get started with the code, please follow the detailed setup instructions in our main [**README.md**](README.md) file. This will guide you through setting up both the Python backend and the React frontend.

## Pull Request Process

We follow the standard "Fork & Pull" Git workflow.

1.  **Fork the repository** to your own GitHub account.
2.  **Clone your fork** to your local machine: `git clone https://github.com/YOUR_USERNAME/codefolio.git`
3.  **Create a new branch** for your changes. Please use a descriptive name (e.g., `feat/add-new-template` or `fix/login-bug`).
    ```bash
    git checkout -b your-branch-name
    ```
4.  **Make your changes.** Write clean, readable code and add comments where necessary.
5.  **Test your changes** thoroughly to ensure they work as expected and don't introduce new bugs.
6.  **Commit your changes** with a clear and descriptive commit message. We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
    ```bash
    # Example commit messages:
    git commit -m "feat: Add support for a new minimalist resume template"
    git commit -m "fix: Correctly handle CORS preflight requests from the extension"
    git commit -m "docs: Update README with new deployment instructions"
    ```
7.  **Push your branch** to your fork on GitHub.
    ```bash
    git push origin your-branch-name
    ```
8.  **Open a Pull Request (PR)** from your fork's branch to the `main` branch of the original Codefolio repository.
9.  **Describe your changes** in the PR description. Explain the "why" behind your changes and reference any related issues.

## Style Guides

### Git Commit Messages

As mentioned, we use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). This helps keep our release history clean and automated.

### Python Code

*   We follow the **PEP 8** style guide.
*   We use `black` for automatic code formatting.

### TypeScript/React Code

*   We use `prettier` for automatic code formatting.
*   Follow the standard React hooks and functional components patterns.

Thank you again for your interest in contributing to Codefolio! We're excited to see what you build.
