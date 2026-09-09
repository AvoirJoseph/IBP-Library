# Koha Integrated Library System (ILS) — Comprehensive Operational Workflows Guide

This guide details step-by-step processes for every operational action in the Koha Integrated Library System, covering Circulation, Cataloging, Patron Management, Serials & Acquisitions, Reports, and System Administration.

---

## 1. Cataloging & MARC21 Bibliographic Management

### Action 1.1: Adding a New Bibliographic Record
1. Navigate to **Catalog (OPAC)** or **MARC21 Cataloging** module.
2. Click **New Bibliographic Record**.
3. Enter key bibliographic details:
   - **Title Statement** (`MARC 245 $a`): Full book or item title.
   - **Main Entry Author** (`MARC 100 $a`): Primary author or creator.
   - **ISBN / ISSN** (`MARC 020 / 022`): 10/13-digit standard identifier.
   - **Call Number** (`MARC 852 $h`): Library of Congress (LC) or Dewey Decimal classification.
   - **Publication Info** (`MARC 260`): Publisher, location, and year.
   - **Copies & Holding Branch**: Total physical copies and initial branch location.
4. Click **Save & Generate MARC21 Tag**.

### Action 1.2: Editing MARC21 Standard Tags & Subfields
1. Open the **MARC21 Cataloging** tab.
2. Select a record from the bibliographic dropdown list.
3. Review and edit tag specifications:
   - `001`: System Control Number.
   - `020`: ISBN ($a ISBN number).
   - `100`: Author ($a Last name, First name, $e role).
   - `245`: Title statement ($a Title, $b Subtitle, $c Statement of responsibility).
   - `260`: Publication ($a Place, $b Publisher, $c Date).
   - `650`: Subject headings ($a Subject term).
   - `852`: Location ($b Branch, $c Shelving, $h Call #, $p Barcode).
4. Add new tag fields using **Add MARC Tag Field** or remove unused fields with the deletion icon.
5. Click **Save MARC Record**.

### Action 1.3: Exporting Bibliographic Data
1. Select the desired bibliographic record.
2. Click **Export MARC21 JSON**.
3. Save the ISO 2709 standard structured JSON data file for backup or inter-library exchange.

---

## 2. Circulation & Loan Workstation Operations

### Action 2.1: Checking Out (Issuing) Items to a Patron
1. Open the **Circulation** workstation tab.
2. Under **Check Out (Issue)**:
   - **Step 1**: Select or scan the **Patron Card Number** (e.g., `2390100491`).
   - System automatically verifies patron borrowing status, active loan counts, and fine balance.
   - **Step 2**: Select or scan the **Item Barcode** (e.g., `399990148201`).
   - **Step 3**: Verify the calculated **Due Date** based on system rules.
3. Click **Confirm & Execute Check Out**.
4. *Result*: The item's available copy count decreases, the patron's active loans count increases, and a transaction record is created.

### Action 2.2: Checking In (Returning) Items
1. Click the **Check In (Return)** tab in the Circulation module.
2. Scan or enter the **Item Barcode**.
3. Click **Process Book Return**.
4. *Result*:
   - Item status instantly updates back to `Available`.
   - The active loan transaction is marked as `Returned`.
   - If the return date is past the due date, Koha calculates overdue fines automatically.

### Action 2.3: Managing Holds & Reserves Queue
1. Open **Holds & Reserves Queue**.
2. View pending requests placed by patrons for checked-out items.
3. Upon item return, click **Notify Patron** to trigger an automated notification for pickup at the designated branch.

### Action 2.4: Collecting Patron Fines & Fees
1. Open the **Fines & Fees Payment** tab.
2. Search for the patron by name or card number.
3. Review the itemized fine balance.
4. Click **Clear Balance** upon payment receipt to restore full patron privileges.

---

## 3. Patron Management & Administration

### Action 3.1: Registering a New Patron
1. Open the **Patrons** module and click **Register New Patron**.
2. Complete the profile form:
   - **Full Legal Name** & Contact Info (Email, Phone).
   - **Patron Category**: Select Student, Faculty, Research Fellow, or Guest.
   - **Home Library Branch**: Assign primary branch.
3. Click **Save & Issue Library Card**.
4. *Result*: Koha generates a unique 10-digit library card barcode ID.

### Action 3.2: Printing Digital Library Cards
1. Locate the patron in the **Patrons** list.
2. Click **Library Card**.
3. Inspect the digital card preview containing the patron name, category, home branch, expiration date, and scannable barcode.
4. Click **Print Card**.

---

## 4. Serials & Acquisitions Operations

### Action 4.1: Managing Library Budgets & Purchase Orders
1. Open **Serials & Acq.**.
2. Monitor annual budget metrics (Total Fiscal Budget vs Committed Expenditures).
3. Create purchase orders with vendors (e.g., Springer Nature, IEEE Press, ACM).

### Action 4.2: Periodical & Journal Issue Check-In
1. Locate the active subscription in the **Subscriptions Table**.
2. When a weekly or monthly issue arrives, click **Receive Issue**.
3. Increment issue count and update subscription status.

---

## 5. Reports & Custom SQL Analytics

### Action 5.1: Running Pre-configured & Custom SQL Reports
1. Open the **Reports & SQL** module.
2. Choose a pre-written report from the **Saved SQL Query Library**:
   - *List Overdue Loans & Calculated Fines*
   - *Top Borrowed Items Count*
   - *Patrons with Balance > $0*
3. View or edit the SQL syntax in the **SQL Statement Editor** (querying tables: `biblio`, `items`, `borrowers`, `issues`).
4. Click **Execute SQL Query**.
5. View the generated data table and click **Export CSV** for offline spreadsheet analysis.

---

## 6. Koha System Administration & Preferences

### Action 6.1: Configuring Circulation & Fine Rules
1. Open **Koha Admin**.
2. Adjust system preference controls:
   - **Default Loan Duration**: Number of days (e.g., 14 days).
   - **Daily Fine Rate**: Overdue charge per day (e.g., $0.50/day).
   - **Max Loan Limits**: Set independent limits for Students (e.g., 5 items) vs Faculty (e.g., 15 items).
3. Click **Save System Preferences**.

### Action 6.2: Managing Library Branches
1. Under **Active Library Branches**, view and configure branch locations (Main Campus, Science Library, Law Library, Medical Center).
2. Assign items and staff users to specific branches.
