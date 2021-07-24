// Instead use GitHub releases? All the cool boys are using it!

export function get_CHANGELOG(): string {

  let date = new Date();
  // https://stackoverflow.com/a/29774197/10247962
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset * 60 * 1000));
  /** YYYY-MM-DD format */
  const formattedDate: string = date.toISOString().split('T')[0]!;


  return (
    `# Changelog

<!-- Template, # for major version, ## for minor and patch

# 1.0.0 (YYYY-MM-DD)
### Added
*
### Changed
*
### Fixed
*
-->


## 0.1.0 (${formattedDate})

* Project started
`);
}