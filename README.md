# Introduction
This is a packing app, templated from [react-next-app-template](https://github.com/jiajunlee19/react-next-app-template), developed by [jiajunlee](https://github.com/jiajunlee19).

Visit to the production-deployed website: [https://react-next-app-packing.vercel.app/](https://react-next-app-packing.vercel.app/)

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
1. [Sign Up](/app/\(pages\)/auth/signUp/page.tsx)
    ![Feature_SignUp.PNG](/Misc/Feature_SignUp.PNG)

2. [Sign In](/app/\(pages\)/auth/signIn/page.tsx)
    ![Feature_SignIn.PNG](/Misc/Feature_SignIn.PNG)

3. [Sign Out](/app/\(pages\)/auth/signOut/page.tsx)
    ![Feature_SignOut.PNG](/Misc/Feature_SignOut.PNG)

4. [Manage Own User](/app/\(pages\)/auth/user/[user_uid]/page.tsx)
    ![Feature_ManageOwnUser.PNG](/Misc/Feature_ManageOwnUser.PNG)

5. [Update Any User Role to user/admin](/app/\(pages\)/protected/auth/updateRoleByEmail/page.tsx)
    ![Feature_UpdateAnyUserRoleAdmin.PNG](/Misc/Feature_UpdateAnyUserRoleAdmin.PNG)

6. Admin - Manage Box Type
    - [View all box types](/app/\(pages\)/protected/box_type/page.tsx)
    ![Feature_ViewAllBoxTypes.PNG](/Misc/Feature_ViewAllBoxTypes.PNG)
    - [Create new box type](/app/\(pages\)/protected/box_type/create/page.tsx)
    ![Feature_CreateNewBoxType.PNG](/Misc/Feature_CreateNewBoxType.PNG)
    - [Update existing box type](/app/\(pages\)/protected/box_type/[box_type_uid]/update/page.tsx)
    ![Feature_UpdateExistingBoxType.PNG](/Misc/Feature_UpdateExistingBoxType.PNG)

7. Admin - Manage Tray Type
    - [View all tray types](/app/\(pages\)/protected/tray_type/page.tsx)
    ![Feature_ViewAllTrayTypes.PNG](/Misc/Feature_ViewAllTrayTypes.PNG)
    - [Create new tray type](/app/\(pages\)/protected/tray_type/create/page.tsx)
    ![Feature_CreateNewTrayType.PNG](/Misc/Feature_CreateNewTrayType.PNG)
    - [Update existing tray type](/app/\(pages\)/protected/tray_type/[tray_type_uid]/update/page.tsx)
    ![Feature_UpdateExistingTrayType.PNG](/Misc/Feature_UpdateExistingTrayType.PNG)

8. Admin - Manage Shipdoc
    - [View all shipdocs](/app/\(pages\)/protected/shipdoc/page.tsx)
    ![Feature_ViewAllShipdocs.PNG](/Misc/Feature_ViewAllShipdocs.PNG)
    - [Create new tray type](/app/\(pages\)/protected/shipdoc/create/page.tsx)
    ![Feature_CreateNewShipdoc.PNG](/Misc/Feature_CreateNewShipdoc.PNG)
    - [Update existing tray type](/app/\(pages\)/protected/shipdoc/[shipdoc_uid]/update/page.tsx)
    ![Feature_UpdateExistingShipdoc.PNG](/Misc/Feature_UpdateExistingShipdoc.PNG)

9. Manage Box
    - [View all box](/app/\(pages\)/box/page.tsx)
    ![Feature_ViewAllBox.PNG](/Misc/Feature_ViewAllBox.PNG)
    - [Create new box](/app/\(pages\)/box/create/page.tsx)
    ![Feature_CreateNewBox.PNG](/Misc/Feature_CreateNewBox.PNG)

10. Manage Tray in a Box
    - [View all tray](/app/\(pages\)/box/[box_uid]/tray/page.tsx)
    ![Feature_ViewAllTray.PNG](/Misc/Feature_ViewAllTray.PNG)
    - [Create new tray](/app/\(pages\)/box/[box_uid]/tray/create/page.tsx)
    ![Feature_CreateNewTray.PNG](/Misc/Feature_CreateNewTray.PNG)

11. Manage Lot in a Tray
    - [View all Lot](/app/\(pages\)/box/[box_uid]/tray/[tray_uid]/lot/page.tsx)
    ![Feature_ViewAllLot.PNG](/Misc/Feature_ViewAllLots.PNG)
    - [Create new Lot](/app/\(pages\)/box/[box_uid]/tray/[tray_uid]/lot/create/page.tsx)
    ![Feature_CreateNewLot.PNG](/Misc/Feature_CreateNewLot.PNG)
    - [Update existing Lot](/app/\(pages\)/box/[box_uid]/tray/[tray_uid]/lot/[lot_uid]/update/page.tsx)
    ![Feature_UpdateExistingLot.PNG](/Misc/Feature_UpdateExistingLot.PNG)

12. [View History of shipped Box](/app/\(pages\)/history/page.tsx)
    ![Feature_ViewShippedBox.PNG](/Misc/Feature_ViewShippedBox.PNG)

13. [Admin - Undo Ship Box](/app/\(pages\)/protected/history/page.tsx)
    ![Feature_UndoShipBoxAdmin.PNG](/Misc/Feature_UndoShipBoxAdmin.PNG)

<br>

# Restriction Controls
1. User is not allowed to ship empty box with tray count = 0.
    ![Restriction_ShipBoxTrayCountZero.PNG](/Misc/Restriction_ShipBoxTrayCountZero.PNG)

2. User is not allowed to ship empty box with drive qty = 0.
    ![Restriction_ShipBoxDriveCountZero.PNG](/Misc/Restriction_ShipBoxDriveCountZero.PNG)

3. User is not allowed to modify or delete any Lot on a shipped Box.
    ![Restriction_ShippedBoxLot.PNG](/Misc/Restriction_ShippedBoxLot.PNG)

4. User is now allowed to modify or delete any Tray on a shipped Box.
    ![Restriction_ShippedBoxTray.PNG](/Misc/Restriction_ShippedBoxTray.PNG)

<br>