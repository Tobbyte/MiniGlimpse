# mini-glimpse README
# MiniGlimpse

MiniGlimpse is an extension that displays the minimap only when text is selected, providing a cleaner and more focused coding environment.


## Commands

This extension provides the following commands:

* `MiniGlimpse.enable`: Enable MiniGlimpse.
* `MiniGlimpse.disable`: Disable MiniGlimpse and reset the minimap to VS Code's default settings.


## Extension Settings

* coming soon


## Release Notes

### 1.0.0
* Initial release


## TODOs

* [x] enable when start search
* [ ] settings: enable/disable, autohide delay, use autohide animation
* [ ] ? option to disable setting "Editor: Selection Highlight" ?
* [ ] save minimap and autohide settings on first init and restore to when disabled
* [ ] debounce handleSelectionChange
* [ ] tests
* Add Features:
* * [ ] fade in animation (not directly supported by VS Code, needs manually transitioning opacity)
* * [ ] autohide delay setting
* * [ ] open / close when search is active