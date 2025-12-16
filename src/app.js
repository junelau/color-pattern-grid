// Constants
const GRID_SIZE = { rows: 6, cols: 14 };
const TARGET_COUNT = 12;
const PATTERN_TYPES = {
  DIAGONAL: "patternA",
  RANDOM: "patternB",
  BUG_EYE: "patternC",
  LOG_CABIN: "patternD",
};

// Color configuration
const colors = [
  "silver-gray",
  "deep-purple",
  "lime-green",
  "pale-yellow",
  "bright-blue",
  "light-cyan",
  "magenta",
];

// Pattern storage
const patterns = {
  [PATTERN_TYPES.DIAGONAL]: [],
  [PATTERN_TYPES.RANDOM]: [],
  [PATTERN_TYPES.BUG_EYE]: [],
  [PATTERN_TYPES.LOG_CABIN]: [],
  savedPatterns: [], // Array to store user-saved patterns
};

// Utility Functions
function createSquare(colorClass) {
  const square = document.createElement("div");
  square.className = `square ${colorClass}`;
  square.addEventListener("click", handleSquareClick);
  return square;
}

function countColors(grid) {
  const colorCounts = Object.fromEntries(
    colors.map((color) => [color, 0])
  );
  const squares = grid.getElementsByClassName("square");

  for (let square of squares) {
    for (let color in colorCounts) {
      if (square.classList.contains(color)) {
        colorCounts[color]++;
      }
    }
  }
  return colorCounts;
}

function balanceColors(pattern) {
  const colorCounts = {};
  pattern.forEach((row) => {
    row.forEach((color) => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
  });

  colors.forEach((targetColor) => {
    while (colorCounts[targetColor] < TARGET_COUNT) {
      const colorsToReplace = Object.keys(colorCounts).filter(
        (color) =>
          color !== targetColor && colorCounts[color] > TARGET_COUNT
      );

      if (colorsToReplace.length === 0) break;

      const colorToReplace = colorsToReplace[0];
      for (let row = 0; row < GRID_SIZE.rows; row++) {
        for (let col = 0; col < GRID_SIZE.cols; col++) {
          if (pattern[row][col] === colorToReplace) {
            pattern[row][col] = targetColor;
            colorCounts[colorToReplace]--;
            colorCounts[targetColor]++;
            break;
          }
        }
      }
    }
  });
  return pattern;
}

// Pattern Generation Functions
function generateDiagonalPattern() {
  const pattern = Array(GRID_SIZE.rows)
    .fill()
    .map(() => Array(GRID_SIZE.cols).fill(null));

  for (let row = 0; row < GRID_SIZE.rows; row++) {
    for (let col = 0; col < GRID_SIZE.cols; col++) {
      const colorIndex = (row + col) % colors.length;
      pattern[row][col] = colors[colorIndex];
    }
  }

  return balanceColors(pattern);
}

function generateRandomPattern() {
  const pattern = Array(GRID_SIZE.rows)
    .fill()
    .map(() => Array(GRID_SIZE.cols).fill(null));
  const colorCounts = Object.fromEntries(
    colors.map((color) => [color, 0])
  );

  function getValidColors(row, col) {
    return colors.filter((color) => {
      if (colorCounts[color] >= TARGET_COUNT) return false;

      // Check for clusters
      return !(
        (col > 0 && pattern[row][col - 1] === color) ||
        (col < GRID_SIZE.cols - 1 && pattern[row][col + 1] === color) ||
        (row > 0 && pattern[row - 1][col] === color) ||
        (row < GRID_SIZE.rows - 1 && pattern[row + 1][col] === color) ||
        (row > 0 && col > 0 && pattern[row - 1][col - 1] === color) ||
        (row > 0 &&
          col < GRID_SIZE.cols - 1 &&
          pattern[row - 1][col + 1] === color) ||
        (row < GRID_SIZE.rows - 1 &&
          col > 0 &&
          pattern[row + 1][col - 1] === color) ||
        (row < GRID_SIZE.rows - 1 &&
          col < GRID_SIZE.cols - 1 &&
          pattern[row + 1][col + 1] === color)
      );
    });
  }

  // Fill initial pattern
  for (let row = 0; row < GRID_SIZE.rows; row++) {
    for (let col = 0; col < GRID_SIZE.cols; col++) {
      const validColors = getValidColors(row, col);
      const color =
        validColors[Math.floor(Math.random() * validColors.length)] ||
        colors[0];
      pattern[row][col] = color;
      colorCounts[color]++;
    }
  }

  return balanceColors(pattern);
}

function generateLogCabinPattern() {
  const pattern = Array(GRID_SIZE.rows)
    .fill()
    .map(() => Array(GRID_SIZE.cols).fill(null));

  // Define block size
  const BLOCK_SIZE = 2;

  // Create diagonal pattern with 2x2 blocks
  for (let row = 0; row < GRID_SIZE.rows; row += BLOCK_SIZE) {
    for (let col = 0; col < GRID_SIZE.cols; col += BLOCK_SIZE) {
      // Calculate diagonal position
      const diagonalPos = row + col;
      const colorIndex =
        Math.floor(diagonalPos / BLOCK_SIZE) % colors.length;

      // Fill 2x2 block with the same color
      for (let r = 0; r < BLOCK_SIZE && row + r < GRID_SIZE.rows; r++) {
        for (let c = 0; c < BLOCK_SIZE && col + c < GRID_SIZE.cols; c++) {
          pattern[row + r][col + c] = colors[colorIndex];
        }
      }
    }
  }

  return pattern; // Remove balanceColors to keep the diagonal pattern intact
}

function generateBugEyePattern() {
  const pattern = Array(GRID_SIZE.rows)
    .fill()
    .map(() => Array(GRID_SIZE.cols).fill(null));

  // Define two eye centers
  const eye1 = { row: 2, col: 4 };
  const eye2 = { row: 2, col: 8 };

  // Create initial pattern with all colors
  const colorAssignments = [];
  for (let row = 0; row < GRID_SIZE.rows; row++) {
    for (let col = 0; col < GRID_SIZE.cols; col++) {
      // Calculate distance from both eyes
      const dist1 = Math.sqrt(
        Math.pow(row - eye1.row, 2) + Math.pow(col - eye1.col, 2)
      );
      const dist2 = Math.sqrt(
        Math.pow(row - eye2.row, 2) + Math.pow(col - eye2.col, 2)
      );

      // Use the minimum distance to determine the color
      const distance = Math.min(dist1, dist2);
      colorAssignments.push({ row, col, distance });
    }
  }

  // Sort by distance and assign colors evenly
  colorAssignments.sort((a, b) => a.distance - b.distance);
  const totalSquares = GRID_SIZE.rows * GRID_SIZE.cols;
  const squaresPerColor = Math.floor(totalSquares / colors.length);
  const extraSquares = totalSquares % colors.length;

  // Assign colors evenly
  let colorIndex = 0;
  let squaresAssigned = 0;
  colorAssignments.forEach(({ row, col }) => {
    if (
      squaresAssigned >=
      squaresPerColor + (colorIndex < extraSquares ? 1 : 0)
    ) {
      colorIndex = (colorIndex + 1) % colors.length;
      squaresAssigned = 0;
    }
    pattern[row][col] = colors[colorIndex];
    squaresAssigned++;
  });

  return balanceColors(pattern);
}

// Function to generate random pattern in sandbox
function generateRandomPatternInSandbox() {
  const pattern = Array(GRID_SIZE.rows)
    .fill()
    .map(() => Array(GRID_SIZE.cols).fill(null));

  // Calculate how many squares we need of each color
  const totalSquares = GRID_SIZE.rows * GRID_SIZE.cols;
  const squaresPerColor = Math.floor(totalSquares / colors.length);
  const extraSquares = totalSquares % colors.length;

  // Create an array of all colors with the correct number of occurrences
  let colorArray = [];
  colors.forEach((color, index) => {
    const count = squaresPerColor + (index < extraSquares ? 1 : 0);
    colorArray = colorArray.concat(Array(count).fill(color));
  });

  // Shuffle the color array
  for (let i = colorArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colorArray[i], colorArray[j]] = [colorArray[j], colorArray[i]];
  }

  // Fill the pattern with shuffled colors
  let colorIndex = 0;
  for (let row = 0; row < GRID_SIZE.rows; row++) {
    for (let col = 0; col < GRID_SIZE.cols; col++) {
      pattern[row][col] = colorArray[colorIndex++];
    }
  }

  renderPattern("sandbox", pattern);
  testColorCounts("sandbox");
}

// UI Functions
function renderPattern(patternId, pattern) {
  const grid = document.getElementById(patternId);
  grid.innerHTML = "";

  pattern.forEach((row) => {
    row.forEach((color) => {
      grid.appendChild(createSquare(color));
    });
  });
}

function testColorCounts(patternId) {
  const grid = document.getElementById(patternId);
  const errorElement = document.getElementById(`${patternId}-error`);
  const colorCounts = countColors(grid);

  let lessThan13 = [];
  let moreThan13 = [];
  let hasErrors = false;

  for (let color in colorCounts) {
    const count = colorCounts[color];
    if (count < TARGET_COUNT) {
      lessThan13.push(`${color}: ${count}`);
      hasErrors = true;
    } else if (count > TARGET_COUNT) {
      moreThan13.push(`${color}: ${count}`);
      hasErrors = true;
    }
  }

  const tableHtml = `
    <table class="w-full border-collapse text-sm font-mono">
      <tr class="bg-gray-50">
        <th class="p-2 text-left border border-gray-200">Less than ${TARGET_COUNT}</th>
        <th class="p-2 text-left border border-gray-200">More than ${TARGET_COUNT}</th>
      </tr>
      <tr>
        <td class="p-2 border border-gray-200 text-red-500">${
          lessThan13.join("<br>") || "-"
        }</td>
        <td class="p-2 border border-gray-200 text-orange-500">${
          moreThan13.join("<br>") || "-"
        }</td>
      </tr>
    </table>
  `;

  errorElement.innerHTML = hasErrors
    ? tableHtml
    : `<div class="text-green-500 text-sm font-mono">All colors have exactly ${TARGET_COUNT} squares</div>`;

  return !hasErrors;
}

// Event Handlers
function handleSquareClick(event) {
  const square = event.target;
  const currentColor = Array.from(square.classList).find((className) =>
    colors.includes(className)
  );
  showColorPicker(event, square, currentColor);
}

function savePattern(patternId) {
  const grid = document.getElementById(patternId);
  const squares = grid.getElementsByClassName("square");
  const pattern = [];

  for (let i = 0; i < squares.length; i += GRID_SIZE.cols) {
    const row = [];
    for (let j = 0; j < GRID_SIZE.cols; j++) {
      const square = squares[i + j];
      const colorClass = Array.from(square.classList).find((className) =>
        colors.includes(className)
      );
      row.push(colorClass);
    }
    pattern.push(row);
  }

  patterns[patternId] = pattern;
  localStorage.setItem(patternId, JSON.stringify(pattern));
  testColorCounts(patternId);
}

// Function to show color picker
function showColorPicker(event, square, currentColor) {
  const dialog = document.getElementById("colorPicker");
  const overlay = document.getElementById("dialogOverlay");
  const colorOptions = document.getElementById("colorOptions");

  // Clear previous options
  colorOptions.innerHTML = "";

  // Position the dialog near the clicked square
  const dialogWidth = 300; // Approximate width of the dialog
  const dialogHeight = 150; // Approximate height of the dialog

  // Calculate position to keep dialog within viewport
  let left = event.clientX;
  let top = event.clientY;

  // Adjust if dialog would go off screen
  if (left + dialogWidth > window.innerWidth) {
    left = left - dialogWidth;
  }
  if (top + dialogHeight > window.innerHeight) {
    top = top - dialogHeight;
  }

  dialog.style.left = `${left}px`;
  dialog.style.top = `${top}px`;

  // Create color options with keyboard shortcuts
  colors.forEach((color, index) => {
    const option = document.createElement("div");
    option.className = `color-option ${color} ${
      color === currentColor ? "selected" : ""
    }`;
    option.innerHTML = `<span class="shortcut">${index + 1}</span>`;

    const selectColor = () => {
      // Remove old color class and add new one
      square.classList.remove(currentColor);
      square.classList.add(color);

      // Hide dialog
      closeDialog();
    };

    option.addEventListener("click", selectColor);
    colorOptions.appendChild(option);
  });

  // Function to close the dialog and clean up
  const closeDialog = () => {
    dialog.classList.remove("active");
    overlay.classList.remove("active");
    document.removeEventListener("keydown", handleKeyPress);
    overlay.removeEventListener("click", closeDialog);
  };

  // Add keyboard event listener
  const handleKeyPress = (event) => {
    const num = parseInt(event.key);
    if (num >= 1 && num <= colors.length) {
      const color = colors[num - 1];
      square.classList.remove(currentColor);
      square.classList.add(color);
      closeDialog();
      testColorCounts(square.closest(".grid").id);
    } else if (event.key === "Escape") {
      closeDialog();
    }
  };

  document.addEventListener("keydown", handleKeyPress);

  // Show dialog
  dialog.classList.add("active");
  overlay.classList.add("active");

  // Close dialog when clicking overlay
  overlay.addEventListener("click", closeDialog);
}

// Function to save sandbox pattern
function saveSandboxPattern() {
  const nameInput = document.getElementById("patternName");
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter a pattern name");
    return;
  }

  // Get the current pattern from sandbox
  const grid = document.getElementById("sandbox");
  const squares = grid.getElementsByClassName("square");
  const pattern = [];

  for (let i = 0; i < squares.length; i += GRID_SIZE.cols) {
    const row = [];
    for (let j = 0; j < GRID_SIZE.cols; j++) {
      const square = squares[i + j];
      const colorClass = Array.from(square.classList).find((className) =>
        colors.includes(className)
      );
      row.push(colorClass);
    }
    pattern.push(row);
  }

  // Create new pattern object
  const newPattern = {
    id: `saved-${Date.now()}`,
    name: name,
    pattern: pattern,
  };

  // Add to saved patterns
  patterns.savedPatterns.push(newPattern);

  // Create new pattern section in showcase
  const showcaseContainer = document.querySelector(".space-y-8");
  const newPatternSection = document.createElement("div");
  newPatternSection.className = "bg-white rounded-lg shadow-md p-6";
  newPatternSection.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">${name}</h2>
    </div>
    <div class="flex gap-6">
      <div class="w-64">
        <p id="${newPattern.id}-error" class="text-red-500 text-sm font-mono"></p>
      </div>
      <div class="relative">
        <div class="grid" id="${newPattern.id}"></div>
      </div>
    </div>
  `;
  showcaseContainer.appendChild(newPatternSection);

  // Render the pattern
  renderPattern(newPattern.id, pattern);
  testColorCounts(newPattern.id);

  // Clear the name input
  nameInput.value = "";

  // Scroll the new pattern into view
  newPatternSection.scrollIntoView({ behavior: "smooth" });
}

// Function to clear all patterns
function clearPatterns() {
  // Clear localStorage
  Object.keys(PATTERN_TYPES).forEach((type) => {
    localStorage.removeItem(PATTERN_TYPES[type]);
  });

  // Clear patterns object
  Object.keys(patterns).forEach((key) => {
    patterns[key] = [];
  });
}

// Initialize color customization
function initializeColorCustomization() {
  const colorInputs = document.querySelectorAll('input[data-color]');

  colorInputs.forEach(input => {
    input.addEventListener('input', (event) => {
      const colorName = event.target.getAttribute('data-color');
      const hexValue = event.target.value.trim();

      // Basic hex validation (with or without #)
      const hexPattern = /^#?[0-9A-Fa-f]{6}$/;
      if (hexPattern.test(hexValue)) {
        // Ensure hex value has # prefix
        const normalizedHex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;

        // Update CSS variable
        document.documentElement.style.setProperty(`--${colorName}`, normalizedHex);

        // Update the visual preview box
        const previewBox = event.target.previousElementSibling;
        if (previewBox) {
          previewBox.style.backgroundColor = normalizedHex;
        }

        // Update input value to normalized form
        event.target.value = normalizedHex;
      }
    });

    // Also handle blur event to validate and correct format
    input.addEventListener('blur', (event) => {
      const hexValue = event.target.value.trim();
      const hexPattern = /^#?[0-9A-Fa-f]{6}$/;

      if (!hexPattern.test(hexValue)) {
        // Reset to CSS variable value if invalid
        const colorName = event.target.getAttribute('data-color');
        const currentValue = getComputedStyle(document.documentElement)
          .getPropertyValue(`--${colorName}`).trim();
        event.target.value = currentValue;
      }
    });
  });
}

// Initialize patterns
function initializePatterns() {
  // Clear all patterns first
  clearPatterns();

  // Generate new patterns
  patterns[PATTERN_TYPES.DIAGONAL] = generateDiagonalPattern();
  patterns[PATTERN_TYPES.RANDOM] = generateRandomPattern();
  patterns[PATTERN_TYPES.BUG_EYE] = generateBugEyePattern();
  patterns[PATTERN_TYPES.LOG_CABIN] = generateLogCabinPattern();

  // Save patterns to localStorage
  Object.entries(patterns).forEach(([patternId, pattern]) => {
    if (patternId !== "savedPatterns") {
      localStorage.setItem(patternId, JSON.stringify(pattern));
    }
  });

  // Render all patterns
  Object.entries(patterns).forEach(([patternId, pattern]) => {
    renderPattern(patternId, pattern);
    testColorCounts(patternId);
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initializePatterns();
  initializeColorCustomization();
});

// Make functions globally available for inline onclick handlers
window.generateRandomPatternInSandbox = generateRandomPatternInSandbox;
window.saveSandboxPattern = saveSandboxPattern;
window.savePattern = savePattern;
