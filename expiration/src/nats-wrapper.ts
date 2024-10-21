import nats, { Stan } from "node-nats-streaming";

class NatsWraper {
  private _client?: Stan;

  get client() {
    if (!this._client)
      throw Error("Cannot access NATS client before initialisation");

    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client?.on("connect", () => {
        console.log("Connected to NATS");
        resolve("");
      });

      this._client?.on("error", (error) => {
        throw error
      });
    });
  }
}

export const natsWrapper = new NatsWraper();
