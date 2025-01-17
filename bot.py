from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackQueryHandler, CallbackContext

# Start command handler
def start(update: Update, context: CallbackContext):
    # Create buttons
    keyboard = [
        [InlineKeyboardButton("Launch App", url="https://example.com")],  # Replace with your website URL
        [InlineKeyboardButton("About", callback_data="about")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # Send welcome message with buttons
    update.message.reply_text(
        "Welcome to the Bot! Choose an option below:", reply_markup=reply_markup
    )

# Callback query handler for "About" button
def button_callback(update: Update, context: CallbackContext):
    query = update.callback_query
    query.answer()  # Acknowledge the callback
    
    if query.data == "about":
        query.edit_message_text(
            text="""
Hash : A unique digital fingerprint for a block.
Hash function : Miners use a cryptographic hash function (SHA-256) to create a hash for the block.
Target hash: Miners then take measures to find a hash that meets a specific target, which requires extensive computational power
we have our own hash that is installed in the Miner application that reduces extensively the computational power that is required
"""
        )

def main():
    # Replace 'YOUR_BOT_TOKEN' with your actual bot token
    updater = Updater("7699344801:AAF9hThXhYRGo6I-9Cl3wo0dcBfGd2c7YQs")
    dispatcher = updater.dispatcher

    # Add handlers
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CallbackQueryHandler(button_callback))

    # Start the bot
    updater.start_polling()
    print("Bot is running... Press Ctrl+C to stop.")
    updater.idle()

if __name__ == "__main__":
    main()
