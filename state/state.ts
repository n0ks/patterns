interface IPlayerState {
  getName(): string;
  attack(): void;
  idle(): void;
  defend(): void;
}

class Player {
  private state: IPlayerState = new PlayerIdle(this);
  isStunned: boolean = false;

  getPlayerState(): IPlayerState {
    return this.state;
  }

  setPlayerState(state: IPlayerState): void {
    this.state = state;
    console.log("player state is now", this.getStateName());
  }

  getStateName(): string {
    return this.state.getName();
  }

  attack(): void {
    if (this.isStunned) {
      console.log("player is stunned and cannot attack");
      return;
    }

    console.log("player will attack");
    this.state.attack();
  }

  defend(): void {
    console.log("player will defend");
    this.state.defend();
  }

  idle(): void {
    console.log("player is idling ");
    this.state.idle();
  }

  setStunned(value: boolean) {
    if (value) console.log("player is stunned!");

    this.isStunned = value;
  }
}

class PlayerIdle implements IPlayerState {
  private name = "PlayerIdle";

  constructor(public readonly player: Player) {}

  getName(): string {
    return this.name;
  }

  attack(): void {
    this.player.setPlayerState(new PlayerAttack(this.player));
  }

  idle(): void {
    console.log("player is already in idle");
  }

  defend(): void {
    this.player.setPlayerState(new PlayerDefend(this.player));
  }
}

class PlayerAttack implements IPlayerState {
  private name = "PlayerAttack";

  constructor(public readonly player: Player) {}

  getName(): string {
    return this.name;
  }

  attack(): void {
    console.log("player is already attacking");
  }

  idle(): void {
    this.player.setPlayerState(new PlayerIdle(this.player));
  }

  defend(): void {
    this.player.setPlayerState(new PlayerDefend(this.player));
  }
}

class PlayerDefend implements IPlayerState {
  private name = "PlayerDefend";

  constructor(public readonly player: Player) {}

  getName(): string {
    return this.name;
  }
  attack(): void {
    this.player.setPlayerState(new PlayerAttack(this.player));
  }

  idle(): void {
    this.player.setPlayerState(new PlayerIdle(this.player));
  }

  defend(): void {
    console.log("player is already defending");
  }
}

let player = new Player();

player.attack();

player.defend();

player.setStunned(true);

player.attack();

player.setStunned(false);

player.defend();
// player.defend();
