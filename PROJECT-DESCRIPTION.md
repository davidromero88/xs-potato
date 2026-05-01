## Detailed Functional Description (User Journey & Features)

This section describes exactly how the end-users (the shop owners) will interact with the app, feature by feature. No technical implementation details are described here, only the expected user experience.

### 1. Main Navigation
When the user opens the app, they immediately see three main sections via tabs or buttons: "**Ingresos**" (Incomes), "**Egresos**" (Expenses), and "**Historial**" (History).
*   On mobile, navigation lives in a bottom bar with icons. On desktop, it appears as a top tab bar.
*   If they are on the "Ingresos" tab, the visual theme uses green accents.
*   If they switch to "Egresos", the visual theme switches to red/orange accents.
This ensures they always know whether they are adding money to the till or taking money out.

### 2. Registering an Item (Core Flow)
Whether adding an Income or an Expense, the flow is identical:
1.  **Typing the Product:** The user taps the "Producto" field and starts typing. As they type, a dropdown appears showing products they have entered in the past.
    *   *Scenario A (New Product):* If it's a new product, they just finish typing. The app automatically capitalizes the first letter and reuses the existing casing if the name was entered before.
    *   *Scenario B (Existing Product):* They tap a product from the suggestion list to auto-fill the input. The app also pre-fills the last known unit price for that product.
2.  **Entering Quantity & Unit:** They type the number (e.g., "2.5") and select from a dropdown whether that number means "**Kg**" or "**Unidad**" (Unit).
3.  **Entering Unit Price:** They type the price per unit. The app calculates and displays the **total cost** in real time (quantity × unit price).
4.  **Saving:** They tap the large "**Guardar Ingreso**" (or "Guardar Egreso") button. The app clears the form instantly, ready for the next entry.

### 3. Fixing Typos Before Saving (The Pencil Feature)
Sometimes a user selects an existing product from the autocomplete dropdown but notices it was misspelled in the past (e.g., they select "Manzanaa" instead of "Manzana").
*   When they select a suggestion, a **pencil icon** appears next to the product name.
*   They tap the pencil, correct the text to "Manzana", and proceed to enter the quantity and price.
*   When they hit "Guardar", the app notices the correction and interrupts them with a **Confirmation Modal**.
*   The modal asks: *"Cambiaste 'Manzanaa' por 'Manzana'. ¿Querés actualizar este nombre en todos los registros anteriores también?"* (You changed 'Manzanaa' to 'Manzana'. Do you want to update this name in all previous records too?).
*   They can choose "**Solo esta vez**" (Only this time), "**Actualizar en todo el historial**" (Update all past history), or simply cancel.

### 4. Viewing the History & Totals
When the user taps the "**Historial**" tab:
*   They see a list of all their recent transactions. On mobile, these appear as individual cards. On desktop, they are displayed as a spreadsheet-style table.
*   At the top of the view, there is a clear summary showing **Total Ingresos** (money in) and **Total Egresos** (money out) for the currently filtered period.
*   They can tap quick filter buttons ("**Día**", "**Mes**", "**Año**") to change the timeframe. The list and the totals update instantly based on the selected filter.
*   When there are no transactions for the selected period, a friendly empty state message is shown.

### 5. Fixing Mistakes "On The Fly" (History Editing)
If the user is looking at the History list and realizes they entered a wrong price, quantity, or a misspelled product, they don't need to go to a complex edit screen.
*   They simply tap directly on the product name, quantity, or price right there on the history card/row.
*   The text becomes editable inline. They type the correction, tap outside or press Enter, and the change is saved immediately.

### 6. Exporting Data
In the History view, there is an "**Exportar a CSV**" button. Tapping this instantly downloads a spreadsheet file containing exactly what they are currently viewing (based on their active Day/Month/Year filter), which they can send to their accountant or keep as a backup.

### 7. Installable PWA & Offline Support
The app is a Progressive Web App. Users can install it on their phone's home screen for a native-like experience. Once loaded, the app works offline thanks to service worker caching.
