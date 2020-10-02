# MisCord

A discord bot for Miscreated Community Server Admins.



NOTICE:

> This Project is Currently under active Development. as such the Codebase is Unstable and is Likely to (It Will) change on a regular basis.

> The `master` branch will always have the **latest** *working release* and all active development will be kept to the development branch, this means the master branch will often become stale and outdated. but will always have the most recent "stable" code
> while the Development Branch will have the latest and  greatest changes but may break at anytime, i will use tagged releases to define working builds at each major change but smaller feature changes and hotfixes will Not be tagged.

> Developers & Those using the Development Branch i Suggest you use specific Commits or Releases when cloning to avoid issues and update only when a release is tagged.



_The default bot prefix is_: `m>`

__Currently Implemented Features__:

- Manage Multiple Servers per Guild. (added servers are assigned a short random serverId like: `2yll4d`)

  - add new servers to manage using `{prefix} server-add` command

  - remove servers using `{prefix} server-delete` command

  - list servers using `{prefix} server-list` command

  - get server-status for added servers using `{prefix} server-info {serverId}` command

    - shows `servername`,`current map`,`current gameRules`,`restart info`,`ingame time and weather info`

    - shows all currently connected players with stats like: `name`, `steamId`,`ping`

      -  includes  `SteamName`,`SteamProfileVisability` with link to profile and steam-rep pages

      

- manage the whitelist of added servers

  - list whitelisted players using `{prefix} whitelist-show`

    - shows player `SteamId`, `SteamProfile Name`, `SteamProfile Visability`, with handy links to the profile and 

      steam-rep pages for that user





__Instructions__:

For Setup & Usage info check out the Wiki: [MisCord: Setup and Config](https://github.com/Therosin/MisCord/wiki/1-MisCord:-Setup-and-Config)

For Building and Development Docs checkout the Wiki: [Development Info](https://github.com/Therosin/MisCord/wiki/11-Development-Info)
