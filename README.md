# actools-uijson
Small utility for easy editing *ui_car.json* files. Written using [NW.js](http://nwjs.io/).

#### Requirements
* [.NET Framework 4.5](https://www.microsoft.com/en-US/Download/details.aspx?id=30653)
* [Visual C++ Redistributable 2013 (x86)](https://www.microsoft.com/en-us/download/details.aspx?id=40784)

#### Download
* [Last (0.3.18)](https://yadi.sk/d/ThhqnZ3uhSKrV)
* [Stable (0.3.18)](http://www.racedepartment.com/downloads/actools-cars-manager.6518/)

#### Features
* Enable/disable vehicles
* Edit name, brand, tags, description, class & specs
* Search for description online
* Preview cars
* Auto-update Previews
* Quick Practive
* Upgrade Icon Editor
* Restoration Wizard
* Batch Processing

#### Tips
* Double click on preview to launch acShowroom.
* Press RMB to open controls bar
* Select found text in built-in browser and press “OK”
* Don't forget to save changes (Ctrl+S)

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

#### TODO
* Brand logo select
* New mods installation
* New custom fields: year, country
* Data Application part
* More hotkeys
* Optional sorting, sorting by brand/id/…
* Detect broken cars
* Skins Editor
* View/edit torque & powes curves, load from data/power.lut
* Switchable & custom search providers (?)
* Custom Batch Processing (?)
* Fix body_shadow.png, custom auto-previews generator (?)
* Clone cars, modify in-game specs (?)

#### Changelog
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

#### Screenshots
![Screenshot](http://i.imgur.com/kGJCn2L.png)
![Upgrade Icon Editor](http://i.imgur.com/qhYp3Mp.png)

#### Auto-updated Previews
![Porsche 944 Turbo S](https://pp.vk.me/c621730/v621730892/2e1e7/LO25pCMqvpg.jpg)
![Aston Martin Vanquish V12](https://pp.vk.me/c621730/v621730048/29d84/Yzk1DN_rUI0.jpg)
![Volvo S60R](https://pp.vk.me/c621730/v621730107/33687/j-n4apx1GA8.jpg)

