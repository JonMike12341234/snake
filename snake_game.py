import pygame
import sys
import random

# --- Global variables for screen dimensions (will be updated in initialize_game) ---
SCREEN_WIDTH = 0
SCREEN_HEIGHT = 0
GRID_SIZE = 20  # Size of each block (snake segment or food)
GRID_WIDTH = 0
GRID_HEIGHT = 0

# --- Sound Files (placeholders - actual files needed) ---
EAT_SOUND_FILE = "eat_sound.wav"
GAME_OVER_SOUND_FILE = "game_over_sound.wav"

# --- Global sound objects ---
eat_sound = None
game_over_sound = None

# Colors
DARK_GRAY = (50, 50, 50)   # Background
WHITE = (255, 255, 255)    # Text
VIBRANT_GREEN = (0, 200, 0) # Snake body
DARKER_GREEN = (0, 150, 0) # Snake border
BRIGHT_RED = (255, 0, 0)   # Food body
DARKER_RED = (200, 0, 0)   # Food border
GRAY = (128, 128, 128)     # Grid color (optional)
BLACK = (0,0,0) # Kept for old references if any, though DARK_GRAY is preferred

# Snake properties / Difficulty Levels
# Higher value = faster snake = harder difficulty
SPEED_EASY = 7
SPEED_MEDIUM = 10
SPEED_HARD = 15
# SNAKE_SPEED will be set by difficulty selection

# Directions
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)


# --- Game Initialization ---
def initialize_game():
    """Initializes Pygame, the display in full-screen, and the clock."""
    global SCREEN_WIDTH, SCREEN_HEIGHT, GRID_WIDTH, GRID_HEIGHT
    pygame.init()
    pygame.mixer.init() # Initialize the mixer

    # Load sounds (actual .wav files need to be in the same directory)
    global eat_sound, game_over_sound
    try:
        eat_sound = pygame.mixer.Sound(EAT_SOUND_FILE)
        game_over_sound = pygame.mixer.Sound(GAME_OVER_SOUND_FILE)
    except pygame.error as e:
        print(f"Warning: Could not load sound files ({EAT_SOUND_FILE}, {GAME_OVER_SOUND_FILE}). Game will run without sound. Error: {e}")
        eat_sound = None
        game_over_sound = None


    # Get screen info and set to full-screen
    info = pygame.display.Info()
    SCREEN_WIDTH = info.current_w
    SCREEN_HEIGHT = info.current_h

    # Adjust screen dimensions to be multiples of GRID_SIZE for a perfect grid
    SCREEN_WIDTH = (SCREEN_WIDTH // GRID_SIZE) * GRID_SIZE
    SCREEN_HEIGHT = (SCREEN_HEIGHT // GRID_SIZE) * GRID_SIZE

    GRID_WIDTH = SCREEN_WIDTH // GRID_SIZE
    GRID_HEIGHT = SCREEN_HEIGHT // GRID_SIZE

    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.FULLSCREEN)
    pygame.display.set_caption("Snake Game")
    clock = pygame.time.Clock()
    return screen, clock


# --- Drawing Functions ---
def draw_grid(screen):
    """Draws the grid lines on the screen (optional)."""
    # Access global SCREEN_WIDTH, SCREEN_HEIGHT if needed, or pass them if they change
    for x in range(0, SCREEN_WIDTH, GRID_SIZE):
        pygame.draw.line(screen, GRAY, (x, 0), (x, SCREEN_HEIGHT))
    for y in range(0, SCREEN_HEIGHT, GRID_SIZE):
        pygame.draw.line(screen, GRAY, (0, y), (SCREEN_WIDTH, y))


def draw_snake(screen, snake_segments):
    """Draws the snake on the screen with a border."""
    for segment in snake_segments:
        # Draw border (slightly larger rect in darker color)
        pygame.draw.rect(screen, DARKER_GREEN, (segment[0] * GRID_SIZE, segment[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        # Draw main body (slightly smaller rect in vibrant color, offset for border effect)
        pygame.draw.rect(screen, VIBRANT_GREEN, (segment[0] * GRID_SIZE + 1, segment[1] * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2))


def draw_food(screen, food_pos):
    """Draws the food on the screen with a border."""
    # Draw border
    pygame.draw.rect(screen, DARKER_RED, (food_pos[0] * GRID_SIZE, food_pos[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE))
    # Draw main body
    pygame.draw.rect(screen, BRIGHT_RED, (food_pos[0] * GRID_SIZE + 1, food_pos[1] * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2))


# --- Food Functions ---
def spawn_food(snake_segments):
    """Spawns food at a random location not occupied by the snake."""
    # GRID_WIDTH and GRID_HEIGHT are now global and updated
    while True:
        food_pos = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        if food_pos not in snake_segments:
            return food_pos


# --- Game Over Function ---
def game_over_screen(screen, score):
    """Displays the game over message and score."""
    # Access global SCREEN_WIDTH, SCREEN_HEIGHT for centering
    font = pygame.font.SysFont(None, 50)
    game_over_text = font.render("Game Over!", True, WHITE)
    score_text = font.render(f"Score: {score}", True, WHITE)
    prompt_text = pygame.font.SysFont(None, 30).render("Press R to Restart or Q to Quit", True, WHITE)

    screen.fill(DARK_GRAY) # Use new background color
    screen.blit(game_over_text, (SCREEN_WIDTH // 2 - game_over_text.get_width() // 2, SCREEN_HEIGHT // 3 - game_over_text.get_height() // 2))
    screen.blit(score_text, (SCREEN_WIDTH // 2 - score_text.get_width() // 2, SCREEN_HEIGHT // 2 - score_text.get_height() // 2))
    screen.blit(prompt_text, (SCREEN_WIDTH // 2 - prompt_text.get_width() // 2, SCREEN_HEIGHT * 2 // 3 - prompt_text.get_height() // 2))
    pygame.display.flip()

    waiting_for_input = True
    while waiting_for_input:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_q:
                    pygame.quit()
                    sys.exit()
                if event.key == pygame.K_r:
                    return True  # Restart game
        pygame.time.Clock().tick(5) # Keep CPU usage low while waiting


# --- Difficulty Selection Screen ---
def show_difficulty_selection_screen(screen):
    """Displays the difficulty selection screen and returns the chosen speed."""
    title_font = pygame.font.SysFont(None, 60)
    option_font = pygame.font.SysFont(None, 40)
    highlight_color = VIBRANT_GREEN # Use snake color for highlight

    options = {
        "1. Easy": SPEED_EASY,
        "2. Medium": SPEED_MEDIUM,
        "3. Hard": SPEED_HARD
    }
    option_texts = {}
    option_rects = {}

    screen.fill(DARK_GRAY)
    title_text = title_font.render("Select Difficulty", True, WHITE)
    title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 4))
    screen.blit(title_text, title_rect)

    y_offset = SCREEN_HEIGHT // 2 - 50
    for text, speed_val in options.items():
        option_surface = option_font.render(text, True, WHITE)
        option_rect = option_surface.get_rect(center=(SCREEN_WIDTH // 2, y_offset))
        option_texts[text] = {"surface": option_surface, "original_surface": option_surface, "rect": option_rect, "speed": speed_val, "color": WHITE}
        option_rects[option_rect] = text # For mouse collision
        y_offset += 50

    quit_text = option_font.render("Press Q to Quit Game", True, WHITE)
    quit_rect = quit_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT * 3 // 4 + 30))
    screen.blit(quit_text, quit_rect)

    pygame.display.flip()

    selecting = True
    while selecting:
        mouse_pos = pygame.mouse.get_pos()
        for text_key, data in option_texts.items():
            if data["rect"].collidepoint(mouse_pos):
                if data["color"] != highlight_color: # Avoid re-rendering if already highlighted
                    data["surface"] = option_font.render(text_key, True, highlight_color)
                    data["color"] = highlight_color
            else:
                if data["color"] != WHITE: # Avoid re-rendering if already white
                    data["surface"] = data["original_surface"] # Use cached original surface
                    data["color"] = WHITE
            screen.blit(data["surface"], data["rect"])


        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_q:
                    pygame.quit()
                    sys.exit()
                if event.key == pygame.K_1 or event.key == pygame.K_KP_1:
                    return SPEED_EASY
                if event.key == pygame.K_2 or event.key == pygame.K_KP_2:
                    return SPEED_MEDIUM
                if event.key == pygame.K_3 or event.key == pygame.K_KP_3:
                    return SPEED_HARD
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1: # Left mouse button
                    for rect, text_key in option_rects.items():
                        if rect.collidepoint(mouse_pos):
                            return option_texts[text_key]["speed"]
        pygame.display.update(title_rect) # Update only title area
        for data in option_texts.values(): # Update only option areas
            pygame.display.update(data["rect"])
        pygame.display.update(quit_rect) # Update quit text area

        pygame.time.Clock().tick(30) # Keep CPU usage reasonable on this screen


# --- Welcome Screen ---
def show_welcome_screen(screen):
    """Displays the welcome screen and waits for user input to continue."""
    title_font = pygame.font.SysFont(None, 70)
    info_font = pygame.font.SysFont(None, 35)
    prompt_font = pygame.font.SysFont(None, 40)

    screen.fill(DARK_GRAY)

    title_text = title_font.render("Snake Game", True, WHITE)
    title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 4))

    instruction_line1 = "Use Arrow Keys to Move."
    instruction_line2 = "Eat the Red Food."
    instruction_line3 = "Avoid Walls and Yourself!"
    instruction_surfaces = [
        info_font.render(instruction_line1, True, WHITE),
        info_font.render(instruction_line2, True, WHITE),
        info_font.render(instruction_line3, True, WHITE)
    ]

    prompt_text_surface = prompt_font.render("Press any key or Click to continue...", True, VIBRANT_GREEN)
    prompt_rect = prompt_text_surface.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT * 3 // 4 + 40))

    screen.blit(title_text, title_rect)
    
    current_y_offset = title_rect.bottom + 50
    for surface in instruction_surfaces:
        rect = surface.get_rect(center=(SCREEN_WIDTH // 2, current_y_offset))
        screen.blit(surface, rect)
        current_y_offset += 40
        
    screen.blit(prompt_text_surface, prompt_rect)

    pygame.display.flip()

    waiting_for_input = True
    while waiting_for_input:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                waiting_for_input = False # Any key press
            if event.type == pygame.MOUSEBUTTONDOWN:
                waiting_for_input = False # Any mouse click
        pygame.time.Clock().tick(15) # Keep CPU usage low


# --- Main Game Loop ---
def game_loop():
    """Main function to run the Snake game."""
    # initialize_game now sets global screen dimensions
    screen, clock = initialize_game()

    show_welcome_screen(screen) # Show welcome screen once at the start

    while True: # Outer loop for restarting the game
        current_snake_speed = show_difficulty_selection_screen(screen)
        if current_snake_speed is None: # e.g. if selection screen had a quit that returned None
            pygame.quit()
            sys.exit()

        # Initial game state - uses global GRID_WIDTH, GRID_HEIGHT
        snake_segments = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]  # Start in the middle
        snake_direction = RIGHT
        food_pos = spawn_food(snake_segments) # Uses global GRID_WIDTH, GRID_HEIGHT
        score = 0
        game_running = True
        game_paused = False

        while game_running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_UP and snake_direction != DOWN:
                        snake_direction = UP
                    elif event.key == pygame.K_DOWN and snake_direction != UP:
                        snake_direction = DOWN
                    elif event.key == pygame.K_LEFT and snake_direction != RIGHT:
                        snake_direction = LEFT
                    elif event.key == pygame.K_RIGHT and snake_direction != LEFT:
                        snake_direction = RIGHT
                    elif event.key == pygame.K_p: # Pause game
                        game_paused = not game_paused
                    elif event.key == pygame.K_ESCAPE: # Go to game over screen (quit/restart)
                        if game_over_screen(screen, score):
                            game_running = False # To break inner loop and restart
                        else: # Quit
                            pygame.quit()
                            sys.exit()


            if game_paused:
                # Display Pause Message - uses global SCREEN_WIDTH, SCREEN_HEIGHT
                font = pygame.font.SysFont(None, 50)
                pause_text = font.render("Paused", True, WHITE)
                screen.blit(pause_text, (SCREEN_WIDTH // 2 - pause_text.get_width() // 2, SCREEN_HEIGHT // 2 - pause_text.get_height() // 2))
                pygame.display.flip()
                clock.tick(5) # Keep CPU usage low
                continue # Skip rest of the game loop if paused

            # --- Game Logic ---
            # Move snake
            current_head = snake_segments[0]
            new_head = (current_head[0] + snake_direction[0], current_head[1] + snake_direction[1])

            # Check for collisions
            # 1. Boundary collision - uses global GRID_WIDTH, GRID_HEIGHT
            if not (0 <= new_head[0] < GRID_WIDTH and 0 <= new_head[1] < GRID_HEIGHT):
                if game_over_sound:
                    game_over_sound.play()
                if game_over_screen(screen, score): # Returns true if restart
                    game_running = False # Break inner loop, will restart due to outer loop
                    continue
                else: # Quit
                    pygame.quit()
                    sys.exit()

            # 2. Self-collision (ignore if new_head is the same as the very last segment before growing)
            if new_head in snake_segments[:-1]: # Check all but the tail
                if game_over_sound:
                    game_over_sound.play()
                if game_over_screen(screen, score):
                    game_running = False
                    continue
                else:
                    pygame.quit()
                    sys.exit()


            snake_segments.insert(0, new_head) # Add new head

            # Check for food eaten
            if new_head == food_pos:
                score += 1
                if eat_sound:
                    eat_sound.play()
                food_pos = spawn_food(snake_segments)
            else:
                snake_segments.pop()  # Remove tail if no food eaten

            # --- Drawing ---
            screen.fill(DARK_GRAY) # Use new background color
            # draw_grid(screen) # Optional: draw grid lines
            draw_snake(screen, snake_segments)
            draw_food(screen, food_pos)

            # Display score
            score_font = pygame.font.SysFont(None, 30)
            score_surface = score_font.render(f"Score: {score}", True, WHITE)
            screen.blit(score_surface, (10, 10)) # Positioned at top-left, should be fine

            pygame.display.flip()  # Update the full display

            clock.tick(current_snake_speed) # Control game speed based on difficulty

        # If game_running became false because of game over and restart was chosen
        if not game_running:
            continue # Restart the game by going to the beginning of the outer while True loop


if __name__ == "__main__":
    game_loop()
    pygame.quit() # Ensure pygame quits if loop somehow exits without sys.exit()
    sys.exit()
