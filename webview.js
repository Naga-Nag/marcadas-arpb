import { Webview } from "webview-bun";
const webview = new Webview();

webview.title = "Marcadas";
webview.navigate("http://localhost");
webview.run();