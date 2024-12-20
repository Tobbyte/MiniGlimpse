# MiniGlimpse

MiniGlimpse displays the minimap only when text is selected, providing a cleaner and more focused coding environment.

##
##
##
### ### Please upvote on GitHub ### ###
* This feature request is now a candidate for the official VS CODE backlog. The community has 60 days to upvote the issue. If it receives 20 upvotes it will be moved to the vs code backlog.
### ### Upvote on GitHub to [make it real](https://github.com/microsoft/vscode/issues/232011) ### ###

##
##
##
## Commands

This extension provides the following commands:

* `MiniGlimpse.enable`: Enable MiniGlimpse.
* `MiniGlimpse.disable`: Disable MiniGlimpse and reset the minimap to VS Code's default settings.


## Extension Settings

* `miniGlimpse.enabled`


## Release Notes

### 1.2.3
* fix: stop registering the build-in `actions.find` command b/c messing with the find widget is no fun.
So no minimap auto open on cmd-f without having to select a word first like a neandertaler.

### 1.2.2
* fix: search widget openes with "test" as searchString.

### 1.2.1
* now with updated readme :roll_eyes:

### 1.2.0
* Set own settings
* show Minimap when find widget is opened

### 1.0.0
* Initial release



## TODOs

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

* [ ] enable when start search - see 1.2.3: will not implement.

## Warning

VS Code's API currently doesn't allow direct manipulation of the DOM for extensions.
Due to this limitation, MiniGlimpse toggles the minimap by changing its on/off state in the User/Workspace setting.