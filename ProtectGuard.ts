import { events } from "bdsx/event";
import { command } from "bdsx/command";
import { CANCEL } from "bdsx/common";
import * as fs from "fs";
import { CxxString, int32_t } from "bdsx/nativetype";
import { bedrockServer } from "bdsx/launcher";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { timeout } from "bdsx/util";

var a = true;
var masterData: {
  Name: string;
  rb: string;
  block: string;
  x: int32_t;
  y: int32_t;
  z: int32_t;
  date: string;
}[] = [];
const date = new Date();
let jsonObject: any;
let x: number;
let y: number;
let z: number;
let cmd: string;
let jsi: object;

const RegisterCmd = function () {
  command
    .register("pg", "protect world")
    .overload(
      (param, origin, output) => {
        const actor = origin.getEntity();
        Inspect(actor);
      },
      {
        option: command.enum("ProtectGuard.i", "i"),
      }
    )
    .overload(
      (param, origin, output) => {
        const actor = origin.getEntity();
        Inspect(actor);
      },
      {
        option: command.enum("ProtectGuard.inspect", "inspect"),
      }
    )
    .overload(
      (param, origin, output) => {
        const actor = origin.getEntity();
        cmd = `tellraw @s {"rawtext":[{"text":"§l§f----§3ProtectGuard§f----\n§3Version: §fProtectGuard v1.0\n§3Data: §f/bedrock_server/ProtectGuard\n§3Download §fhttps://github.com/RuneNight/GuardProtect\n§3Lisense §fMIT"}]}`;
        actor?.runCommand(cmd);
      },
      {
        option: command.enum("ProtectGuard.status", "status"),
      }
    )
    .overload(
      (param, origin, output) => {
        const actor = origin.getEntity();
        if (
          param.action == "place" ||
          param.action == "remove" ||
          param.action == "all"
        ) {
          var pg = `§l§f----§3ProtectGuard Restore§f----§r\n`;
          a = true;
          let rba = "";
          try {
            jsonObject = readJson();
          } catch (e) {
            console.log(e);
          }
          try {
            if (param.action == "place") {
              if (param.block != "all") {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (
                      item.Name == param.user &&
                      item.block == param.block &&
                      item.rb == "b"
                    )
                      return true;
                  }) || {};
              } else {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user && item.rb == "b") return true;
                  }) || {};
              }
            } else if (param.action == "remove") {
              if (param.block != "all") {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (
                      item.Name == param.user &&
                      item.block == param.block &&
                      item.rb == "r"
                    )
                      return true;
                  }) || {};
              } else {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user && item.rb == "b") return true;
                  }) || {};
              }
            } else if (param.action == "all") {
              if (param.block != "all") {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user) return true;
                  }) || {};
              } else {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (
                      item.Name == param.user &&
                      item.block == param.block &&
                      item.rb == "b"
                    )
                      return true;
                  }) || {};
              }
            }
            for (const i in jsi) {
              if (jsi[i].rb == "b") {
                rba = "placed";
                actor?.runCommand(
                  "setblock " +
                    jsi[i].x +
                    " " +
                    jsi[i].y +
                    " " +
                    jsi[i].z +
                    " " +
                    jsi[i].block
                );
              } else {
                rba = "removed";
                actor?.runCommand(
                  "setblock " +
                    jsi[i].x +
                    " " +
                    jsi[i].y +
                    " " +
                    jsi[i].z +
                    " air"
                );
              }
              cmd = Cmd(
                pg,
                jsi[i].date,
                jsi[i].Name,
                rba,
                jsi[i].block,
                jsi[i].x,
                jsi[i].y,
                jsi[i].z
              );
              pg = "";
              actor?.runCommand(cmd);
              a = false;
            }
          } catch (e) {
            console.log(e);
          }
          if (a) {
            cmd = Nodata(param.user);
            actor?.runCommand(cmd);
          }
        } else {
          actor?.runCommand(
            `tellraw @s {"rawtext":[{"text":"§cNoActionParam..."}]}`
          );
        }
      },
      {
        option: command.enum("ProtectGuard.restore", "restore"),
        user: CxxString,
        block: CxxString,
        action: CxxString,
      }
    )
    .overload(
      (param, origin) => {
        const actor = origin.getEntity();
        var pg = `§l§f----§3ProtectGuard§f----§r\n`;
        a = true;
        let rba = "";
        try {
          jsonObject = readJson();
        } catch (e) {
          console.log(e);
        }
        try {
          jsi;
          jsonObject.masterData.filter((item: any) => {
            if (item.Name == param.text) return true;
          }) || {};
          for (const i in jsi) {
            if (jsi[i].rb == "b") {
              rba = "placed";
            } else {
              rba = "removed";
            }
            cmd = Cmd(
              pg,
              jsi[i].date,
              jsi[i].Name,
              rba,
              jsi[i].block,
              jsi[i].x,
              jsi[i].y,
              jsi[i].z
            );
            pg = "";
            actor?.runCommand(cmd);
            a = false;
          }
        } catch (e) {
          console.log(e);
        }
        if (a) {
          cmd = Nodata(param.text);
          actor?.runCommand(cmd);
        }
      },
      {
        option: command.enum("ProtectGuard.lookup", "lookup"),
        user: command.enum("ProtectGuard.lookup.user", "user"),
        text: CxxString,
      }
    )
    .overload(
      (param, origin) => {
        const actor = origin.getEntity();
        if (
          param.action == "place" ||
          param.action == "remove" ||
          param.action == "all"
        ) {
          var pg = `§l§f----§3ProtectGuard Rollback§f----§r\n`;
          a = true;
          let rba = "";
          try {
            jsonObject = readJson();
          } catch (e) {
            console.log(e);
          }
          try {
            if (param.action == "place") {
              if (param.block != "all") {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (
                      item.Name == param.user &&
                      item.block == param.block &&
                      item.rb == "b"
                    )
                      return true;
                  }) || {};
              } else {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user && item.rb == "b") return true;
                  }) || {};
              }
            } else if (param.action == "remove") {
              if (param.block != "all") {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (
                      item.Name == param.user &&
                      item.block == param.block &&
                      item.rb == "r"
                    )
                      return true;
                  }) || {};
              } else {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user && item.rb == "b") return true;
                  }) || {};
              }
            } else if (param.action == "all") {
              if (param.block != "all") {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user) return true;
                  }) || {};
              } else {
                jsi =
                  jsonObject.masterData.filter((item: any) => {
                    if (item.Name == param.user && item.rb == "b") return true;
                  }) || {};
              }
            }
            for (const i in jsi) {
              if (jsi[i].rb == "b") {
                rba = "placed";
                actor?.runCommand(
                  "setblock " +
                    jsi[i].x +
                    " " +
                    jsi[i].y +
                    " " +
                    jsi[i].z +
                    " air"
                );
              } else {
                rba = "removed";
                actor?.runCommand(
                  "setblock " +
                    jsi[i].x +
                    " " +
                    jsi[i].y +
                    " " +
                    jsi[i].z +
                    " " +
                    jsi[i].block
                );
              }
              cmd = Cmd(
                pg,
                jsi[i].date,
                jsi[i].Name,
                rba,
                jsi[i].block,
                jsi[i].x,
                jsi[i].y,
                jsi[i].z
              );
              pg = "";
              actor?.runCommand(cmd);
              a = false;
            }
          } catch (e) {
            console.log(e);
          }
          if (a) {
            cmd = Nodata(param.user);
            actor?.runCommand(cmd);
          }
        } else {
          actor?.runCommand(
            `tellraw @s {"rawtext":[{"text":"§cNoActionParam..."}]}`
          );
        }
      },
      {
        option: command.enum("ProtectGuard.rollback", "rollback"),
        user: CxxString,
        block: CxxString,
        action: CxxString,
      }
    )
    .overload(
      (param, origin) => {
        const actor = origin.getEntity();
        var pg = `§l§f----§3ProtectGuard§f----§r\n`;
        a = true;
        let rba = "";
        try {
          jsonObject = readJson();
        } catch (e) {
          console.log(e);
        }
        try {
          jsi =
            jsonObject.MasterData.filter((item: any) => {
              if (item.x == param.x && item.y == param.y && item.z == param.z)
                return true;
            }) || {};
          for (const i in jsi) {
            if (jsi[i].rb == "b") {
              rba = "placed";
            } else {
              rba = "removed";
            }
            cmd = Cmd(
              pg,
              jsi[i].Now,
              jsi[i].Name,
              rba,
              jsi[i].block,
              jsi[i].x,
              jsi[i].y,
              jsi[i].z
            );
            pg = "";
            actor?.runCommand(cmd);
            a = false;
          }
        } catch (e) {}
        if (a) {
          let xyz = param.x + `/` + param.y + `/` + param.z;
          cmd = Nodata(xyz);
          actor?.runCommand(cmd);
        }
      },
      {
        option: command.enum("ProtectGuard.lookup", "lookup"),
        user: command.enum("ProtectGuard.lookup.xyz", "xyz"),
        x: int32_t,
        y: int32_t,
        z: int32_t,
      }
    )
    .overload(
      (param, origin) => {
        const actor = origin.getEntity();
        var pg = `§l§f----§3ProtectGuard§f----§r\n`;
        a = true;
        let rba = "";
        let x2 = actor?.getPosition().x;
        let y2 = actor?.getPosition().y;
        let z2 = actor?.getPosition().x;

        try {
          jsonObject = readJson();
        } catch (e) {
          console.log(e);
        }
        try {
          jsi =
            jsonObject.masterData.filter((item: any) => {
              if (x2 != undefined && y2 != undefined && z2 != undefined) {
                x2 = Math.round(x2);
                y2 = Math.round(y2);
                z2 = Math.round(z2);
                if (item.x < x2 + param.r || item.x < x2 - param.r) {
                  if (item.y < y2 + param.r || item.y < y2 - param.r) {
                    if (item.z < z2 + param.r || item.z < z2 - param.r) {
                      return true;
                    }
                  }
                }
              }
            }) || {};
          for (const i in jsi) {
            if (jsi[i].rb == "b") {
              rba = "placed";
            } else {
              rba = "removed";
            }
            cmd = Cmd(
              pg,
              jsi[i].Now,
              jsi[i].Name,
              rba,
              jsi[i].block,
              jsi[i].x,
              jsi[i].y,
              jsi[i].z
            );
            pg = "";
            actor?.runCommand(cmd);
            a = false;
          }
        } catch (e) {
          console.log(e);
        }
        if (a) {
          let xyz = x2 + "/" + y2 + "/" + z2;
          cmd = Nodata(xyz);
          actor?.runCommand(cmd);
        }
      },
      {
        option: command.enum("ProtectGuard.near", "near"),
        r: int32_t,
      }
    )
    .overload(
      (param, origin) => {
        const actor = origin.getEntity();
        cmd = `tellraw @s {"rawtext":[{"text":"§l§f---- §3ProtectGuard Help §f----\n§3/pg §7help §f- Display more info for that command.\n§3/pg §7inspect §f - Turns the block inspector on or off.\n§3/pg §7rollback §3<params> §f- Rollback block data.\n§3/pg §7lookup §3<params> §f- Advanced block data lookup.\n§3/pg §7status §f- Displays the plugin status."}]}`;
        actor?.runCommand(cmd);
      },
      {
        option: command.enum("ProtectGuard.help", "help"),
      }
    );
};

RegisterCmd();
command.find("pg").signature.permissionLevel = CommandPermissionLevel.Operator;
events.blockDestroy.on((ev) => {
  if (ev.player.hasTag("inspect")) {
    a = true;
    var pg =
      `§l§f----§3ProtectGuard§f---- §r§7(x` +
      ev.blockPos.x +
      `/y` +
      ev.blockPos.y +
      `/z` +
      ev.blockPos.z +
      `)\n`;
    let rba = "";
    try {
      jsonObject = readJson();
    } catch (e) {
      console.log(e);
    }
    try {
      jsi =
        jsonObject.masterData.filter((item: any) => {
          if (
            item.x == ev.blockPos.x &&
            item.y == ev.blockPos.y &&
            item.z == ev.blockPos.z
          )
            return true;
        }) || {};
      for (const i in jsi) {
        if (jsi[i].rb == "b") {
          rba = "placed";
        } else {
          rba = "removed";
        }

        cmd = Cmd(
          pg,
          jsi[i].Now,
          jsi[i].Name,
          rba,
          jsi[i].block,
          jsi[i].x,
          jsi[i].y,
          jsi[i].z
        );
        pg = "";
        ev.player.runCommand(cmd);
        a = false;
      }
    } catch (e) {}
    if (a) {
      cmd = Nodata(
        ev.blockSource.getBlock(ev.blockPos).getName().replace("minecraft:", "")
      );
      ev.player.runCommand(cmd);
    }
    return CANCEL;
  } else {
    var Now = TimeNow();
    var data = {
      Name: ev.player.getName(),
      rb: "r",
      block: ev.blockSource
        .getBlock(ev.blockPos)
        .getName()
        .replace("minecraft:", ""),
      x: ev.blockPos.x,
      y: ev.blockPos.y,
      z: ev.blockPos.z,
      date: Now,
    };
    masterData.push(data);
    let masterData2: string = JSON.stringify({ masterData }, null, " ");
    fs.writeFileSync("./block.json", masterData2);
  }
});
events.blockPlace.on((ev) => {
  if (ev.player.hasTag("inspect")) {
    a = true;
    var pg =
      `§l§f----§3ProtectGuard§f---- §r§7(x` +
      ev.blockPos.x +
      `/y` +
      ev.blockPos.y +
      `/z` +
      ev.blockPos.z +
      `)\n`;
    let rba = "";
    try {
      jsonObject = readJson();
    } catch (e) {}
    try {
      jsi =
        jsonObject.masterData.filter((item: any) => {
          if (
            item.x == ev.blockPos.x &&
            item.y == ev.blockPos.y &&
            item.z == ev.blockPos.z
          )
            return true;
        }) || {};
      for (const i in jsi) {
        if (jsi[i].rb == "b") {
          rba = "placed";
        } else {
          rba = "removed";
        }
        cmd = Cmd(
          pg,
          jsi[i].Now,
          jsi[i].Name,
          rba,
          jsi[i].block,
          jsi[i].x,
          jsi[i].y,
          jsi[i].z
        );
        pg = "";
        ev.player.runCommand(cmd);
        a = false;
      }
    } catch (e) {}
    if (a) {
      cmd = Nodata(ev.block.getName().replace("minecraft:", ""));
      ev.player.runCommand(cmd);
    }
    return CANCEL;
  } else {
    var Now = TimeNow();
    var data = {
      Name: ev.player.getName(),
      rb: "b",
      block: ev.block.getName().replace("minecraft:", ""),
      x: ev.blockPos.x,
      y: ev.blockPos.y,
      z: ev.blockPos.z,
      date: Now,
    };
    masterData.push(data);
    let masterData2: string = JSON.stringify({ masterData }, null, " ");
    fs.writeFileSync("./block.json", masterData2);
  }
});

events.playerJoin.on((ev) => {
  ev.player.runCommand("tag @s remove inspect");
});

const Inspect = function (actor) {
  if (actor?.hasTag("inspect")) {
    cmd = `tellraw @s {"rawtext":[{"text":"§l§3ProtectGuard §f- Inspect now disabled"}]}`;
    actor?.removeTag("inspect");
    actor?.runCommand(cmd);
  } else {
    cmd = `tellraw @s {"rawtext":[{"text":"§l§3ProtectGuard §f- Inspect now enabled"}]}`;
    actor?.addTag("inspect");
    actor?.runCommand(cmd);
  }
};

const readJson = function () {
  return JSON.parse(fs.readFileSync("./block.json", "utf8"));
};
const Nodata = function (name) {
  return (
    `tellraw @s {"rawtext":[{"text":"§l§3ProtectGuard §f- No block data found at ` +
    name +
    `"}]}`
  );
};
const Cmd = function (pg, now, name, rba, block, x, y, z) {
  return (
    `tellraw @s {"rawtext":[{"text":"` +
    pg +
    `§7` +
    now +
    ` §l§f - §3` +
    name +
    ` §f` +
    rba +
    ` §3` +
    block +
    ` §r§7(location: ` +
    x +
    `/` +
    y +
    `/` +
    z +
    ` )"}]}`
  );
};

const TimeNow = function () {
  let TYear: string = date.getFullYear().toString();
  var TMonth2: number = date.getMonth() + 1;
  var TMonth: string = TMonth2.toString();
  let TDate: string = date.getDate().toString();
  let THour: string = date.getHours().toString();
  let TMinutes: string = date.getMinutes().toString();
  let TSeconds: string = date.getSeconds().toString();
  var Now: string =
    TYear +
    "/" +
    TMonth +
    "/" +
    TDate +
    "/" +
    THour +
    "/" +
    TMinutes +
    "/" +
    TSeconds;
  return Now;
};
