class GuildMemberRequest {
  accepted = false;
  constructor(public level: number) {}
}

abstract class GuildHandler {
  protected next: GuildHandler | null = null;

  setHandler(handler: GuildHandler): GuildHandler {
    this.next = handler;
    return handler;
  }

  handle(member: GuildMemberRequest): GuildMemberRequest {
    if (this.next) return this.next.handle(member);
    return member;
  }
}

class GuildAcolyteHandler extends GuildHandler {
  handle(member: GuildMemberRequest): GuildMemberRequest {
    if (member.level <= 15) {
      console.info("📰 Guild Acolyte accepted a new member");
      member.accepted = true;

      return member;
    }

    console.info(
      "Only Guild Master or Guild Mod can accept members above level 15"
    );
    return super.handle(member);
  }
}

class GuildModHandler extends GuildHandler {
  handle(member: GuildMemberRequest): GuildMemberRequest {
    if (member.level <= 30) {
      console.info("📰 Guild Mod accepted a new member");
      member.accepted = true;
      return member;
    }

    console.info("Only Guild Master can accept members above level 30");
    return super.handle(member);
  }
}

class GuildMasterHandler extends GuildHandler {
  handle(member: GuildMemberRequest): GuildMemberRequest {
    console.info("📰 Guild Master accepted a new member");
    // can accept any member
    member.accepted = true;
    return member;
  }
}

let memberRequest = new GuildMemberRequest(55);
let guildAcolyte = new GuildAcolyteHandler();

guildAcolyte
  .setHandler(new GuildModHandler())
  .setHandler(new GuildMasterHandler());

guildAcolyte.handle(memberRequest);
