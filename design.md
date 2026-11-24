# Design notes - Create an asset demo

Taken from the Figma file "BIS Assessment" (Flow 1 page). Values match the Figma tokens and components.

## Foundations

**Font:** Inter 400 / 600 / 700, numbers tabular. Sizes: page title 28/600, section title 18/600, body 14, field label 13/600, help text 12 in grey, button 16/600.

**Colour**

| Role | Value |
|---|---|
| Primary (buttons, links, focus) | `#0078b3`, hover `#00669a`, tint `#f2fcff` |
| Text / secondary text | `#191919` / `#666666` |
| Page / card background | `#f8f8f9` / `#feffff` |
| Borders | `#b2b2b3` (inputs), `#e2e2e3` (cards, dividers) |
| Active | `#167b00` on `#fafff2` |
| Needs Inspection | `#a1851f` on `#fffcf2` |
| In Repair | `#a85200` on `#fff7f0` |
| Out of Service / errors | `#cc2222` on `#fff2f2` |

**Shape and space:** 4px radius on buttons and inputs, 8px on cards and panels, pill radius on chips. 4px spacing base (8, 12, 16, 24, 32). Cards and panels have 24px padding and a 1px light border.

**Focus:** 2px primary outline with 2px offset; inputs also get a light blue ring.

## Components

- **Header:** BIS logo, user search, icons, Log Out, then the main menu with Assets.
- **Buttons:** primary (filled), secondary (outlined), tertiary (text), error outline for Discard. One primary per area.
- **Status chip:** pill with an icon and a label, never colour alone. Large size on the asset page.
- **Asset card:** 4px status-coloured strip, status chip, type icon tile (or the photo), type, bold name, make and model, colour swatch with its name, and a forms line. Out of Service and In Repair cards get a 2px status-coloured border.
- **Category cards:** three selectable cards with an icon and the types for each category.
- **Form field:** label above, red `*` for required, 34px high input, help text below, error text in red.
- **Colour picker:** named swatches (None, White, Silver, Grey, Black, Blue, Red, Green, Yellow, Orange, Brown, Purple).
- **Sticky footer** (Add asset) and **unsaved-changes bar** (asset page).
- **Dialog** with an overlay, **toast** (bottom right) and an **error summary** box.

## Screens and flow

1. **Asset list:** page title and Add asset, category tabs with counts, status counts, search and type filters, card grid sorted Active, Needs Inspection, In Repair, Out of Service, then A to Z.
2. **Add asset:** one column. Basics (category, name, type, status, all required), photo, optional details (identification, colour, usage by category, contact, description), and a note that forms appear after creation.
3. **Errors:** pressing Create asset with required fields empty or a bad value shows "Fix N fields to create this asset" with links to each field and an inline message under each one.
4. **Leave without saving:** Cancel or leaving with anything entered opens "Discard this asset?" with Keep editing and Discard.
5. **Asset page:** breadcrumb, name and status chip, next-step card, empty Forms section, editable details, photo and notes. After creating, a toast says the asset was added with View in list and Add another.
6. **List after adding:** the new card appears in its sorted place with a "New" tag and the counts go up by one.

## Rules the demo follows

- Required: category, name, type, status. No default status, so the user must choose.
- Mileage and hours must be numbers. Work phone must be 10 digits.
- Photo: JPG, PNG or WebP, up to 10 MB, with a preview, Replace and Remove.
- A duplicate name shows a warning but does not block saving.
- Changing the category clears a type that no longer fits and says so.
- Errors say what is wrong and how to fix it.
- Anything outside this flow shows the toast "Sorry, not in this demo!".

## Out of scope

Forms, tasks, More menu (move and deactivate), search and filters, the Deactivated view and the rest of the BIS app.
