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
1. Admin - Manage Box Type
    - [View all box types](/app/\(pages\)/protected/box_type/page.tsx)
    ![Feature_ViewAllBoxTypes.PNG](/Misc/Feature_ViewAllBoxTypes.PNG)
    - [Create new box type](/app/\(pages\)/protected/box_type/create/page.tsx)
    ![Feature_CreateNewBoxType.PNG](/Misc/Feature_CreateNewBoxType.PNG)
    - [Update existing box type](/app/\(pages\)/protected/box_type/[box_type_uid]/update/page.tsx)
    ![Feature_UpdateExistingBoxType.PNG](/Misc/Feature_UpdateExistingBoxType.PNG)
    - [Delete existing box type](/app/_actions/box_type.ts)
    ![Feature_DeleteExistingBoxType.PNG](/Misc/Feature_DeleteExistingBoxType.PNG)

2. Admin - Manage Tray Type
    - [View all tray types](/app/\(pages\)/protected/tray_type/page.tsx)
    ![Feature_ViewAllTrayTypes.PNG](/Misc/Feature_ViewAllTrayTypes.PNG)
    - [Create new tray type](/app/\(pages\)/protected/tray_type/create/page.tsx)
    ![Feature_CreateNewTrayType.PNG](/Misc/Feature_CreateNewTrayType.PNG)
    - [Update existing tray type](/app/\(pages\)/protected/tray_type/[tray_type_uid]/update/page.tsx)
    ![Feature_UpdateExistingTrayType.PNG](/Misc/Feature_UpdateExistingTrayType.PNG)
    - [Delete existing tray type](/app/_actions/tray_type.ts)
    ![Feature_DeleteExistingTrayType.PNG](/Misc/Feature_DeleteExistingTrayType.PNG)

3. Admin - Manage Shipdoc
    - [View all shipdocs](/app/\(pages\)/protected/shipdoc/page.tsx)
    ![Feature_ViewAllShipdocs.PNG](/Misc/Feature_ViewAllShipdocs.PNG)
    - [Create new tray type](/app/\(pages\)/protected/shipdoc/create/page.tsx)
    ![Feature_CreateNewShipdoc.PNG](/Misc/Feature_CreateNewShipdoc.PNG)
    - [Update existing tray type](/app/\(pages\)/protected/shipdoc/[shipdoc_uid]/update/page.tsx)
    ![Feature_UpdateExistingShipdoc.PNG](/Misc/Feature_UpdateExistingShipdoc.PNG)
    - [Delete existing tray type](/app/_actions/shipdoc.ts)
    ![Feature_DeleteExistingShipdoc.PNG](/Misc/Feature_DeleteExistingShipdoc.PNG)
    
<br>