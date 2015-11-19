# mixmax-spotify
`mixmax-spotify` is a slash command built on top of the [Mixmax SDK](http://sdk.mixmax.com/).

### Adding the integration
To add `mixmax-spotify` to your Mixmax configuration, find the 'Integrations' section of your Mixmax dashboard and use the 'Add Slash Command' button to add a command with the following configuration:
* **Name:** `Insert Spotify link`
* **Command:** `spotify`
* **Parameter placeholder:** `Track name`
* **Command Parameter Suggestions API URL:** ~~`https://warm-hamlet-7436.herokuapp.com/searchTracks`~~ _no longer available_
* **Command Parameter Resolver API URL:** ~~`https://warm-hamlet-7436.herokuapp.com/resolveTrack`~~ _no longer available_
