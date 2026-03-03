# Isa 2.0 😌 - Strategic Career Market Analyst

A Telegram bot and AI-powered tool that analyzes job descriptions and provides strategic insights for Senior Product Designers in the B2C health sector.

## Features

- **Job Analysis**: Analyze multiple job descriptions to identify patterns and trends
- **Skill Extraction**: Identify repeated skills across positions
- **AI Signal Detection**: Find AI-related opportunities and requirements
- **Culture Analysis**: Detect company culture signals (pressure vs stability)
- **Strategic Recommendations**: Get personalized insights on which skills to prioritize
- **Fit Assessment**: Identify exceptionally strong role fits

## Tech Stack

- **Backend**: Python, Flask
- **AI/LLM**: Claude API (Anthropic)
- **Communication**: Telegram Bot API
- **Frontend**: React (CareerAgent.jsx)

## Getting Started

### Prerequisites

- Python 3.8+
- A Telegram Bot Token (get from @BotFather on Telegram)
- An Anthropic Claude API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/isabelferrer-dalmau/Isa2.0.git
   cd Isa2.0
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```bash
   export TELEGRAM_TOKEN="your_telegram_token_here"
   export CLAUDE_API_KEY="your_claude_api_key_here"
   ```

4. Run the application:
   ```bash
   python app.py
   ```

### Deployment

This application is configured for deployment on platforms that support Python (Heroku, Railway, Render, etc.). The `runtime.txt` file specifies the Python version.

## Usage

1. Start the bot on Telegram with `/start`
2. Send 5 job descriptions (copy-paste) as a single message
3. Isa will analyze and provide strategic insights

## Project Structure

```
.
├── app.py                 # Flask backend and Telegram bot webhook
├── requirements.txt       # Python dependencies
├── runtime.txt           # Python version specification
├── index.html            # GitHub Pages landing page
├── README.md             # This file
├── _config.yml           # GitHub Pages configuration
├── .nojekyll             # GitHub Pages configuration
└── src/
    └── CareerAgent.jsx   # React component for career analysis
```

## Environment Variables

- `TELEGRAM_TOKEN`: Your Telegram Bot Token from @BotFather
- `CLAUDE_API_KEY`: Your Anthropic API key (get from console.anthropic.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Isabel Ferrer-Dalmau

---

**Note**: This tool is tailored for Senior Product Designers in the B2C health sector but can be adapted for other professional profiles.
