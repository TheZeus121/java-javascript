import java.io.InputStreamReader;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class JsMain {
	public static void main(String[] args) {
		try {
			ScriptEngine engine = new ScriptEngineManager().getEngineByMimeType("application/javascript");
			ClassLoader cl = JsMain.class.getClassLoader();
			engine.eval(new InputStreamReader(cl.getResourceAsStream("res/script.js")));
		} catch (Exception e) {
			e.printStackTrace(System.err);
			System.exit(-1);
		}
	}
}
