# Introduction
This is a packing app, templated from [react-next-app-template](https://github.com/jiajunlee19/react-next-app-template), developed by [jiajunlee](https://github.com/jiajunlee19).


<br>

# Core Elements
These are the core elements used in this project.
1. BoxType
    - Define all types of box, with box part number and how many trays can the box contains up to.
2. TrayType
    - Define all types of tray, with tray part number and how many drives can the tray contains up to.
3. Shipdoc
    - Define shipdoc number and shipdoc contact.
4. Box
    - Box is the highest hierachy, each box can contains multiple trays.
5. Tray
    - Tray is the second highest hierachy, each tray can contains multiple Lots.
6. Lot
    - Lot is the third highest hierachy, each Lot can contains multiple drives.
7. Drive
    - Drive is the lowest hierachy, each unique drive are being contained within a Lot.

<br>

# Database Schema Diagram
Relationships between all core elements are defined in the schema diagram below.
![SCHEMA_DIAGRAM.png](/Misc/SCHEMA_DIAGRAM.png)

<br>

# Project Workflow
Project workflow is visualized in the flowchart below.
![flowchart.png](/Misc/flowchart.png)

<br>

# Key features
1. Feature 1

<br>