import { EventProviderFactory } from "uxmid-core";

const eventFactory = EventProviderFactory.instance.getProvider("application");
eventFactory.hasListener("global");

const element = document.createElement("div");
element.innerHTML = "Hello Webpack5";
document.body.appendChild(element);
