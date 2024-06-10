# AnnaBot

AnnaBot is a React Native ChatGPT clone with the following features:

- [Clerk](https://go.clerk.com/wvMHe8T) for user authentication
- [Expo Router](https://docs.expo.dev/routing/introduction/) file-based navigation and API Routes
- [OpenAI API](https://platform.openai.com/) for GPT chat completions and image generation
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) 3 for animations
- [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) for gestures
- [Redash](https://github.com/wcandillon/react-native-redash) for animated text
- [Zeego](https://zeego.dev/start) for native menus
- [RN MMKV](https://github.com/mrousavy/react-native-mmkv) for efficient key/value storage
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite-next/) for storing chats and messages
- [Bottom Sheet](https://ui.gorhom.dev/components/bottom-sheet/) for bottom sheet component
- [FlashList](https://shopify.github.io/flash-list/) for efficient list rendering
- [React Native OpenAI](https://github.com/candlefinance/react-native-openai) for streaming
- [Image Zoom](https://github.com/likashefqet/react-native-image-zoom) for image zoom component
- [Shimmer Placeholder](https://github.com/tomzaku/react-native-shimmer-placeholder) for loading placeholders

Keep an eye out for AnnaBot's upcoming rebrand...

## Get started

### Prerequisites
**Node.js**: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).

**Xcode**: If you using a macOS and intend to run the app on an iOS simulator, ensure Xcode is installed.

### Instructions
1. Create a [Clerk](https://clerk.com/) account and project

2. Copy your Clerk project's publishable key

3. In the root folder of your project, create a .env file and add your Clerk project's publishable key
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY={PASTE CLERK PUBLISHABLE KEY HERE}
   ```

5. Install dependencies

   ```bash
   npm install
   ```

6. Start the app

   ```bash
    npx expo run:ios
   ```

*Note: This command will only work on macOS since it requires Xcode. If you're on Windows or Linux, you'll need to use a physical iOS device or switch to a Mac for iOS development.*
