## HarvardX: CS50's Web Programming with Python and JavaScript

### Course's Certified

See [here](https://courses.edx.org/certificates/2ce31451e0dc406dabe116c6d1ffb10c).

### Requirements of this project

See [here](https://cs50.harvard.edu/web/2020/projects/final/capstone/).

### Final project

The project used Django as a backend, and Javascript on the frontend, in addition to using HTML and CSS. The database is Django's default, being SQLite. The Maps API used was OpenLayers, based on OpenStreetMaps.

The project is mobile-responsive.

### Distinctiveness and Complexity

The project uses Maps and Georeferencing, allows to capture coordinates, create markers, and manipulate them. It took a lot of time to learn about coordinates, maps, as well as solving syntax problems and understanding the use of the OpenLayers API, entirely in Javascript. Other controls and processes, using the concepts learned in the course.

#### Files and directories

  - `complaints` - Main application directory.
    - `static/complaints` Contains all static content.
        - `app.js` - Application script and map control.	
	- `style.css` - Cascading Style Sheets.
	- `*.png` - Icons used on maps. 
    - `templates/complaints` contains all application templates.
        - `add.html` - Template to add new complaint (only for registered users).
        - `edit.html` - Template to edit complaint (only for registered users).
        - `index.html` - Initial template, with map rendering.
        - `layout.html` Extended default layout on all pages
        - `login.html` - Login registered users.
        - `register.html` - Register new user.
    - `admin.py` - Registered Models for Admin, example: administrator handle complaints.
    - `urls.py` - Routes of Application.
    - `models.py` Contain one model used in the project. `UserExtended` model extends the standard User model, `Complaint` model is for markers of Complatins.
    - `views.py` All application views.
  - `finalproject` - project directory.

#### Model

    `id` = complaint identifier
    `description` = complaint description
    `created` = complaint data/time created
    `user` = owner of the complaint 
    `enabled` = complaint enabled or disabled 
    `latitude` = complaint latitude for maps marker   
    `longitude` = complaint longitude for maps marker   
    `photo` = photo of the complaint or problem    
    `danger` = level of danger

#### Installation

  - Install pip [here](https://pip.pypa.io/en/stable/installation/).
  - Once you have Pip installed, you can run `pip3 install Django` in your terminal to install Django.
  - No dependencies are required other than Django.
  - Make and apply migrations by running `python manage.py makemigrations` and `python manage.py migrate`.
  - Create superuser with `python manage.py createsuperuser`. This step is optional.
  - Run app with `python manage.py runserver`
  - Go to website address and register an account.

#### How the project works

  - Any user can view the map and find complaints pothole in the streets.	
  - New users can register, and registered users can log in.
  - Registered users can create complaints: for this, he goes to Create Complaint, chooses a place on the map to capture the coordinates, informs a description of the problem, a photo and informs the level of danger.
  - Registered users can change, delete, or close their own complatins, but cannot do so on other users' complatins.
  - Each marker has its color to identify the level of danger, being green (little danger), yellow (intermediate danger), red (high danger). 
  - Only enabled complaints are displayed.

#### Tools e APIs Javascript

  `OpenStreetMap`
 
  OpenStreetMap is a free, open geographic database updated and maintained by a community of volunteers via open collaboration. Contributors collect data from surveys, trace from aerial imagery and also import from other freely licensed geodata sources.

  See [here] (https://www.openstreetmap.org/)

  `OpenLayers`
 
  OpenLayers makes it easy to put a dynamic map in any web page. It can display map tiles, vector data and markers loaded from any source. OpenLayers has been developed to further the use of geographic information of all kinds. It is completely free, Open Source JavaScript, released under the 2-clause BSD License (also known as the FreeBSD).

  See [here] (https://openlayers.org/)	   

  `Bootstrap`

  Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains HTML, CSS and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.

  See [here] (https://getbootstrap.com/)
    
  `Sweetalert`

  Javascript library for beautiful alerts.

  See [here] (https://sweetalert.js.org/guides/)
  
