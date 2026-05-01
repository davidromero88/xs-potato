# Project Context: xs-potato MVP

## 1. Project Description
xs-potato is a very basic mobile-first web app (PWA) for stock control (incomes and expenses) and cash management for a family-owned produce shop (greengrocer). 
**Target audience:** Non-technical users. The interface must be extremely simple, intuitive, with large touch targets and zero friction. 
**Key colors:** Light/bright green for "Incomes" (Ingresos) and Strong Red/Orange for "Expenses" (Egresos).

For the full user journey and feature descriptions, see [PROJECT-DESCRIPTION.md](PROJECT-DESCRIPTION.md).

## 2. Tech Stack
*   **Frontend Core:** React (Functional Components) with Vite.
*   **Styling:** Tailwind CSS.
*   **Icons:** Lucide React or Heroicons.
*   **Storage:** `localStorage` (Strictly. Do not generate relational databases or backend services).

## 3. Architecture & Code Rules (Best Practices)
*   **KISS (Keep It Simple, Stupid):** The simplest path is always the right one. Avoid over-engineering or complex data structures.
*   **Separation of Concerns (SoC):** 
    *   React components should be "dumb" (presentational) as much as possible. 
    *   All business logic, calculations, and `localStorage` manipulation MUST be extracted into Custom Hooks (e.g., `useStockData`).
*   **Clean Code:** 
    *   Do not add unnecessary or redundant comments. The code should be self-documenting through clear variable and function names.
    *   Avoid tight coupling between components.
*   **CRITICAL LANGUAGE RULE:** All underlying code (variable names, functions, custom hooks, types, comments) MUST be written in **English**. However, all UI text, labels, messages, and placeholders displayed to the user MUST be strictly in **Spanish**.

## 4. Storage & Data Model
The application does not use relational databases or separate product catalogs. Everything is based on the transaction history to maintain immutability and simplicity.

**Storage:** A single key in `localStorage` named `xs-potato_history`.
**Array Structure:**
```typescript
type Transaction = {
  id: string; // Timestamp or UUID
  type: 'ingreso' | 'egreso';
  product: string; // Raw string name entered by the user
  quantity: number;
  unit: 'Kg' | 'Unidad';
  price: number;
  date: string; // ISO String
}