// drawing.js
class GenericElement {
  constructor(name) {
    this.name = name;
    this.attribute = {};
    this.content = [];
  }

  addAttr(name, value) {
    this.attribute[name] = value;
  }

  setAttr(name, value) {
    this.attribute[name] = value;
  }

  addAttrs(obj) {
    Object.assign(this.attribute, obj);
  }

  removeAttrs(arr) {
    const attrProp = Object.getOwnPropertyNames(this.attribute);
    const targetProp = arr.filter((x) => attrProp.includes(x));
    targetProp.map((x) => delete this.attribute[x]);
  }

  addChild(child) {
    this.content.push(child);
  }

  toString() {
    return (
      `<${this.name} ` +
      Object.entries(this.attribute)
        .map(([name, value]) => `${name}="${value}"`)
        .join(" ") +
      `>\n` +
      (this.content.length
        ? this.content.map((child) => child.toString()).join("\n") + "\n"
        : "") +
      `</${this.name}>`
    );
  }

  write(fileName, cb) {
    const fs = require("fs");
    fs.writeFile(fileName, this.toString(), cb);
  }
}

class RootElement extends GenericElement {
  constructor() {
    super("svg");
    this.attribute.xmlns = "http://www.w3.org/2000/svg";
  }
}

class RectangleElement extends GenericElement {
  constructor(x, y, width, height, fill) {
    super("rect");
    this.attribute.x = x;
    this.attribute.y = y;
    this.attribute.width = width;
    this.attribute.height = height;
    this.attribute.fill = fill;
  }

  toString() {
    return (
      `<${this.name} ` +
      Object.entries(this.attribute)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ") +
      ">" +
      "\n" +
      `</${this.name}>`
    );
  }
}

class TextElement extends GenericElement {
  constructor(x, y, fontSize, fill, content) {
    super("text");
    this.attribute.x = x;
    this.attribute.y = y;
    this.attribute["font-size"] = fontSize;
    this.attribute.fill = fill;
    this.content = content;
  }

  toString() {
    return (
      `<${this.name} ` +
      Object.entries(this.attribute)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ") +
      `>` +
      this.content +
      "\n" +
      `</${this.name}>`
    );
  }
}

// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({ width: 800, height: 170, abc: 200, def: 400 });
root.removeAttrs(["abc", "def", "non-existent-attribute"]);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement("circle");
c.addAttr("r", 75);
c.addAttr("fill", "yellow");
c.addAttrs({ cx: 200, cy: 80 });
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, "blue");
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, "red", "wat is a prototype? 😬");
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write("test.svg", () => console.log("done writing!"));

module.exports = {
  GenericElement,
  RootElement,
  RectangleElement,
  TextElement,
};
