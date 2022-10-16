import Phaser from "phaser";
import { styleNormalFont } from "../modules/fonts.js";
import { getUsers } from "../modules/getUsers.js";
import { width, height } from "../modules/constants.js";

const ENERGY_THRESHOLD = 300;

export class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene",
      active: true
    });
  }

  createUsers(usersList) {
    this.users = usersList.map(username => {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const color = Phaser.Display.Color.RandomRGB();
      const textObject = this.add.text(x, y, username, { ...styleNormalFont, stroke: color.rgba });
      const velocity = Phaser.Math.Between(0, 200);
      this.physics.world.enable([textObject]);
      textObject.body
        .setCollideWorldBounds(true)
        .setBounce(1.01)
        .setVelocity(velocity);
      return textObject;
    });
  }

  twerkUsers() {
    this.users && this.users.forEach(textObject => {
      let { x, y } = textObject;
      x += Phaser.Math.Between(-1, 1);
      y += Phaser.Math.Between(-1, 1);
      textObject.setPosition(x, y);
    });
  }

  collideObject(first, second) {
    const getEnergy = (element) => element.body.velocity.length();
    const isEnoughEnergy = getEnergy(first) > ENERGY_THRESHOLD || getEnergy(second) > ENERGY_THRESHOLD;
    const isEnabledExplode = true;

    if (isEnoughEnergy && isEnabledExplode) {
      if (first.body.velocity > second.body.velocity) {
        this.destroyUser(first);
      } else {
        this.destroyUser(second);
      }
    }
  }

  destroyUser(user) {
    this.users = this.users.filter(searchUser => searchUser !== user);
    user.destroy();
  }

  create() {
    getUsers().then(usersList => this.createUsers(usersList));
  }

  update() {
    this.users && this.physics.world.collide(this.users, this.users, (obj1, obj2) => this.collideObject(obj1, obj2));
    this.users && this.users.forEach(user => {
      user.body.velocity.scale(0.9999999);
      // user.body.setVelocity(velocity);
    });
  }
};
