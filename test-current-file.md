# Testing the currentFile Property

## What was implemented:

1. **Added `currentFile` property to `CodeEditorState` interface** in `src/types/index.ts`:
   - `currentFile: string | null` - stores the current file name
   - `setCurrentFile: (fileName: string | null) => void` - action to set the current file

2. **Updated `useCodeEditorStore`** in `src/store/useCodeEditorStore.tsx`:
   - Added `currentFile: null` to initial state
   - Added localStorage persistence for current file
   - Implemented `setCurrentFile` action with localStorage support
   - Updated `resetCode` to clear current file when resetting

3. **Updated `OutputPanel`** in `src/app/(root)/_components/OutputPanel.tsx`:
   - Now uses `currentFile` from store instead of hardcoded language-based names
   - Falls back to language-based naming if no current file is set

4. **Updated `NavFiles`** in `src/components/nav-files.tsx`:
   - Added click handler to set current file when a file is clicked
   - Added "Run File" menu item functionality

## How to test:

1. Open the application
2. Click on a file in the sidebar - the file name should appear in the output panel header
3. Run code - the output panel should show the selected file name
4. Reset code - the current file should be cleared and fall back to language-based naming
5. The current file selection should persist across page refreshes (stored in localStorage)

## Benefits:

- Dynamic file names in the output panel based on user selection
- Better user experience with file management
- Persistent file selection across sessions
- Clean fallback to language-based naming when no file is selected
