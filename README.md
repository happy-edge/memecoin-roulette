# 🎰 Memecoin Roulette

Spin the wheel, ape into a random memecoin. Powered by [Jupiter](https://jup.ag).

![Memecoin Roulette](https://img.shields.io/badge/Status-Degen-ff69b4)
![Jupiter](https://img.shields.io/badge/Powered%20by-Jupiter-blue)

## Features

- 🎡 Spinning wheel with 8 popular memecoins
- 🎯 Configurable bet amount in SOL
- 🚀 One-click swap via Jupiter Plugin
- ✨ Smooth animations & glow effects
- 📱 Mobile responsive

## Tokens

| Emoji | Symbol | Name |
|-------|--------|------|
| 🐕 | BONK | Bonk |
| 🎩 | WIF | dogwifhat |
| 🐱 | POPCAT | Popcat |
| 😺 | MEW | cat in a dogs world |
| 💪 | GIGA | Gigachad |
| 🥜 | PNUT | Peanut Squirrel |
| 🦛 | MOODENG | Moo Deng |
| 🐐 | GOAT | Goatseus Maximus |

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/happy-edge/memecoin-roulette)

## How It Works

```typescript
// When user clicks "APE IN":
window.Jupiter.init({
  displayMode: 'modal',
  formProps: {
    initialInputMint: SOL_MINT,
    initialOutputMint: selectedCoin.mint,
    initialAmount: lamports.toString(),
  },
});
```

The Jupiter Plugin handles:
- Wallet connection
- Quote fetching
- Transaction signing
- Swap execution

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jupiter Plugin](https://plugin.jup.ag/)

## Disclaimer

⚠️ This is for entertainment only. You will probably lose money. NFA. DYOR.

## License

MIT
