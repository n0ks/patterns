import { promises } from "fs";
import { resolve } from "node:path";
type PlayerData = { level: number; xp: number; lifePoints: number };

abstract class PlayerDataParser {
  data: PlayerData | null = null;

  constructor(public file: string) {}

  async load(): Promise<void> {
    this.data = await this.readFile();
    this.data = this.levelUp();
  }

  protected levelUp(): PlayerData {
    let o = Object.assign({}, this.data, { level: (this.data!.level += 1) });
    return o;
  }

  protected abstract readFile(): Promise<PlayerData>;
}

class PlayerTextParser extends PlayerDataParser {
  async readFile(): Promise<PlayerData> {
    let data = await promises.readFile(this.file);
    let lines = data.toString().split(" ");

    console.log("loaded text file", lines);

    return {
      level: parseInt(lines[0]),
      xp: parseInt(lines[1]),
      lifePoints: parseInt(lines[2]),
    };
  }
}

class PlayerJsonParser extends PlayerDataParser {

  async readFile(): Promise<PlayerData> {
    let data = await promises.readFile(this.file);

    let js = JSON.parse(data.toString());

    console.log("loaded json file", js);

    return js as PlayerData;
  }
}

(async () => {
  let playerText = new PlayerTextParser(resolve(__dirname, "player.txt"));
  let playerJson = new PlayerJsonParser(resolve(__dirname, "player.json"));

  await playerText.load();
  await playerJson.load();

  console.log(playerText.data);

  console.log(playerJson.data);
})();
