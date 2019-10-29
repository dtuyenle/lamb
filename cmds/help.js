const menus = {
  main: `
    ##          ###    ##     ## ########   ######  ##     ##  #######  ########
    ##         ## ##   ###   ### ##     ## ##    ## ##     ## ##     ## ##     ##
    ##        ##   ##  #### #### ##     ## ##       ##     ## ##     ## ##     ##
    ##       ##     ## ## ### ## ########  ##       ######### ##     ## ########
    ##       ######### ##     ## ##     ## ##       ##     ## ##     ## ##
    ##       ##     ## ##     ## ##     ## ##    ## ##     ## ##     ## ##
    ######## ##     ## ##     ## ########   ######  ##     ##  #######  ##

    static ........... generating static files from a UI lambda
    version ............ show package version
    help ............... show help menu for a command
  `,
  static: `
    To setup static page generation.

    Step 1: Create a child.js file for node workers based on the template from demo folder.
    Step 2: Specify staticConfig from your server js where you setup dynamic SSR.
    Step 3: Add your child.js into your webpack config.
    Step 4: Setup npm script. Example: lambchop static --func uiServer --stage development --env dev

    Note: An example can be found in demo folder from lambchop repo.
  `,
};

module.exports = (args) => {
  const helpCmd = args[1];

  switch (helpCmd) {
    case 'static':
      console.info(menus.static);
      break;

    default:
      console.info(menus.main);
      break;
  }
};
