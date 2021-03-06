export class Configuration {
  // Important: this constructor and the config.json file must have the same mapping to work properly!
  constructor(public useCustomBackgroundImage: boolean,
              public useScene: boolean,
              public defaultScene: string,
              public showClock: boolean,
              public showFuckOff: boolean,
              public openLinkInNewTab: boolean,
              public showList: boolean,
              public suggestions: boolean,
              public searchDelimiter: string,
              public amountOfSuggestions: number,
              public searchEngine: string[],
              public list: string[][]) {
  }

}
