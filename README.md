# GitHub Issue Search Export
> A node utility to export all GitHub Issues and their associated PRs or linked Issues when given a search string.

## Pre-Requisites

- Make sure you create a `.env` file or rename the example in the repository to `.env` and then enter a PAT that has the appropriate permissions into the file.

## Installation

```sh
$ npm install 
```

## Usage

### Before Running

Alter line `21` in `index.js` to contain the appropriate search criteria. 

To understand GitHub's Search syntax, please [see this link.](https://docs.github.com/en/github/searching-for-information-on-github/understanding-the-search-syntax)

### After Adding the Criteria

Run the following:

```js
node index.js
```

After a few minutes, you should have a file named `search-results.json` in your folder.

## License

MIT © [Jon Cardona](https://github.com/hollywood)


