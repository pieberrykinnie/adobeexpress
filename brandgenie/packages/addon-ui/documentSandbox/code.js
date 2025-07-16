import addOnSandboxSdk from "add-on-sdk-document-sandbox";

const { runtime } = addOnSandboxSdk.instance;

function start() {
  runtime.exposeApi({
    ping() {
      console.log("BrandGenie sandbox ready");
    },
  });
}

start();