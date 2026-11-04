// Shiki 4's Oniguruma loader calls Response#bytes() while the module loads.
// Node 20 (the Cloudflare Pages build runtime) does not implement that method.
if (typeof Response !== "undefined" && !("bytes" in Response.prototype)) {
  Object.defineProperty(Response.prototype, "bytes", {
    configurable: true,
    writable: true,
    value: function bytes(this: Response) {
      return this.arrayBuffer().then((buffer) => new Uint8Array(buffer));
    },
  });
}
