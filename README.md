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
* [x] use autohide animation
* [x] enable/disable settings
* [ ] autohide delay
* [ ] use Global or Workspace settings
* [ ] save all changed settings on first init and restore when disabled
* [ ] option to disable minimapGutter.added/modified/deleted-Background
* [ ] tests

* considerations:
    * [ ] debounce handleSelectionChange
    * [ ] fade in animation (not directly supported by VS Code, needs manually transitioning opacity)


## Warning

VS Code's API currently doesn't allow direct manipulation of the DOM for extensions.
Due to this limitation, MiniGlimpse toggles the minimap by changing its on/off state in the User/Workspace setting.