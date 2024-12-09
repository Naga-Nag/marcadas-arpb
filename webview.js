import { Webview } from "webview-bun";
const webview = new Webview();

webview.title = "Presentismo";
webview.navigate("http://localhost");
webview.run();