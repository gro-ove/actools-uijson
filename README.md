# actools-uijson
Small utility for easy editing *ui_car.json* files. Written using [NW.js](http://nwjs.io/).

#### Features
* Enable/disable cars; edit name, brand, class, tags, description & specs
* Search for description online
* Reassign parents, change and create new upgrade icons
* View skins & liveries
* Auto-update Previews to Kunos-style or something else
* Body/Wheels Ambient Shadow Fixer
* Open showroom, start quick practive
* Restoration Wizard, Batch Processing
* Delete cars to Recycle Bin

#### TODO
* New custom fields: year, country, version, author
* Data Application
* New mods installation
* More hotkeys
* Optional sorting, sorting by brand/id/…
* Detect broken cars
* Skins Editor
    * Drag'n'Drop textures
    * Extend selected skins with selected files
* View/edit torque & powes curves, load from data/power.lut
* Switchable & custom search providers (?)
* Custom Batch Processing (?)
* Clone cars, modify in-game specs (?)
* Tracks/Showrooms Edit Mode (?)
* Custom Launcher (with GT-like career mode?)

#### Changelog
* 0.3.36
    * Introducing: Body/Wheels Ambient Shadow Fixer
    * Body Ambient Shadow editing (works with packed data too!)
    * Introducing: Custom Showroom
    * Restoration Wizard:
        * Fix broken ui_skin.json
    * New Auto-update Previews modes (GT5/6, Seat Leon Euro Cup Style)
        * I don't recommend to use them tho, Custom Showroom is pile of garbage, at least for now
        * By the way, if you know how to shaders work, I would be really glad if you could help me
* 0.3.35
    * Car deleting
    * Added a lot of missing brand's icons
    * Fixer for SUSP_XX error
    * Filters list fixed
* 0.3.34
    * Badge changing
    * Regular file selection for upgrade icon or badge
        * Or Drag'n'Drop
* 0.3.33
    * App packed in one executable file
    * Now without UPX, app is bigger, but faster and requires less RAM
* 0.3.20
    * Auto-change name on brand's change is some cases
    * Bugfixes (sorry)
* 0.3.19
    * Auto-update Previews:
        * Options: camera distance
    * Bugfixes
* 0.3.18
    * Auto-update Previews camera rotation fixed
* 0.3.17
    * Bugfixes
* 0.3.12
    * Introducing: Data Collection
    * Introducing: Restoration Wizard
        * Damaged ui_car.json
        * Renamed badge.png
        * Missing or incorrent parent
        * Missing name/brand
        * Missing upgrade.png
        * Missing or empty skins folder
    * Introducing: Batch Processing
        * Add/remove brand names to car names
        * Lowercase classes, lowercase & fix tags
        * Remove logo.png, or replace it with ui/badge.png
    * Sorting
    * Search icon
    * Bugfixes
* 0.3.10
    * Changable parent
    * Filter by brand & class
    * Auto-update Previews: 
        * New changes viewer
        * Fixed filter
        * Auto-disable SweetFX
        * Black Showroom download helper (but not auto-download, you gotta respect creator!)
        * Options: showroom, camera position, sweetfx, filter, resize, extra delay
        * Skin switch bug fixed
* 0.3.0
    * Now with Js-Ext & LESS, reworked
    * Folder “locales” removed
    * Updates check optimized
    * Bugfixes
* 0.2.23
    * Two branches (Stable/Beta) in options
    * Added Upgrade Icon Editor Feature
* 0.2.22
    * Auto-update feature (still could be pretty buggy though)
    * Binary module rebuilded properly
    * Renaming to Cars Manager in process
    * Disappearing tags fixed
    * Parent car view (changing temporary disabled)
* 0.2.21
    * Fancy progressbar
    * Perfomance improvements
* 0.2.20
    * Smart filters
    * New tools menu for list
* 0.2.19
    * Settings
    * Icon
    * Bugfixes
    * Now without laggy JQuery UI
* 0.2.18
    * Massive optimization
    * Normal disableable tips
    * App renamed to AcTools Cars Manager
* 0.2.17
    * Group enabling/disabling fixed
* 0.2.16
    * Fixed description load/save line breaks 
    * View/edit brand, class and specs
    * Auto-recalculate PW-ratio
* 0.2.15
    * Added Quick Practive Feature
    * Tips on launch
    * Error handling improved
* 0.2.14
    * Groups
    * Bugfixes
* 0.2.10
    * Reload button
    * Select showroom
* 0.2.9
    * Auto-disable watermark for skin shots
* 0.2.7
    * Updated UI
    * Improved skins view (livery.png & stuff)
    * Auto-update skins previews fixed and improved
    * Added manual mode

#### Requirements
* [.NET Framework 4.5](https://www.microsoft.com/en-US/Download/details.aspx?id=30653)
* [Visual C++ Redistributable 2013 (x86)](https://www.microsoft.com/en-us/download/details.aspx?id=40784)

#### Download
* [Last (0.3.35)](https://yadi.sk/d/fLG-SXmVhUFZG)
* [Stable (0.3.20)](http://www.racedepartment.com/downloads/actools-cars-manager.6518/)
* [Previous](http://www.racedepartment.com/downloads/actools-cars-manager.6518/history) [builds](https://yadi.sk/d/eHr0NCP4hSAfq)

#### Tips
* Double click on preview to launch showroom
* Press RMB to open controls bar
* Select found text in built-in browser and press “OK”
* Don't forget to save changes (Ctrl+S)
* In some cases (editing kn5, for example) app removes original files to Trash Bin, so you can easily restore them if something goes wrong.
    *Warning!* Ctrl+Z in Windows Explorer restores them, so be careful!

#### Troubleshooting
* Error “App doesn't have access to this folder”
    You have to grant access to Assetto Corsa root folder. Overwise app won't be able to edit files, and it's its main purpose! To grand access you can run app as Administrator, but it's a worst way. Much better way is to change Security Properties of the folder. When app get access to game files and nothing else.
* Error “Cannot get previews. Process exited.”
    If AC Showroom closes on launch, maybe there is a problem with the car. Open log file and check last lines.

#### Data Collection
This feature allows to collect huge database with correct information (description, tags and etc.) about every car! All you have to do is open Settings, enable option “Upload some changes” (it's disabled by default because of privacy and stuff) and then some of your fixes will be uploaded on server! After that everybody will have access to clean, right and actual information!

#### How to update previews
* Install [Black Showroom](http://www.racedepartment.com/downloads/studio-black-showroom.4353/)
* Press RMB and click “Update Previews”
* Manual mode: set the right camera position and press F8
* Wait until all skins will be screenshoted
* Check result and press “Apply” if everything is OK
    *Warning!* This thing could be pretty buggy. Sometimes you'll have to terminate updating (by press Esc) and try again.

#### Known bugs
* Auto-update wasn't tested
* Practice: if Steam isn't running, default launcher will be opened instead

#### Screenshots
![Screenshot](http://i.imgur.com/kGJCn2L.png)
![Upgrade Icon Editor](http://i.imgur.com/qhYp3Mp.png)

#### Auto-updated Previews
![Porsche 944 Turbo S](https://pp.vk.me/c621730/v621730892/2e1e7/LO25pCMqvpg.jpg)
![Aston Martin Vanquish V12](https://pp.vk.me/c621730/v621730048/29d84/Yzk1DN_rUI0.jpg)
![Volvo S60R](https://pp.vk.me/c621730/v621730107/33687/j-n4apx1GA8.jpg)
