export class WelcomeState {
   constructor(game, screen) {
      this.game = game;
      this.screen = screen
   }

   async loadView() {
      const response = await fetch('./welcome.html');
      const welcomeScreenHtml = await response.text();
      this.screen.classList = ["welcome"]
      this.screen.htmlTemplate = welcomeScreenHtml;
   }

   // remember that in the handleEvent this is bound to the Game instance.
   handleEvent(event) {
      console.log(`Received event: ${event.key}`)
      if (event.key === " ") {
         this.startGame();
      }
   }
}
