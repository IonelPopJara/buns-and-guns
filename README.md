# buns-and-guns

Buns and Guns is a game where you are a priest trying to stop the Easter Bunny from spreading their pagan rituals in the world. You are the only hope left.

Play the game here: https://mults.itch.io/buns-and-guns

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IonelPopJara/buns-and-guns.git
   ```

2. Navigate to the project directory:
   ```bash
   cd buns-and-guns
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Run the game:
   ```bash
   npm run dev
   ```

## Building for Production

When building for production:

1. Run the build command:
   ```bash
   npm run build
   ```

2. Important: You'll need to add a `.` to the paths in `index.html` after building to compile successfully:
   ```html
   <!-- Change this -->
   <script type="module" crossorigin src="/assets/index-8fk2OFK9.js"></script>
   <link rel="stylesheet" crossorigin href="/assets/index-BInPu93N.css">
   <!-- To this -->
   <script type="module" crossorigin src="./assets/index-8fk2OFK9.js"></script>
   <link rel="stylesheet" crossorigin href="./assets/index-BInPu93N.css">
   ```