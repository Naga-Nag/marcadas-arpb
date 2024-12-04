import { Webview } from "webview-bun";
const webview = new Webview();

webview.navigate("http://localhost");
webview.run();