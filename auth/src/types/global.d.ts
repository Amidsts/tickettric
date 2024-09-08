declare global {
 namespace NodeJS {
    interface Global {
      signup: () => Promise<string[]>;
    }
  }
}

// declare var global: NodeJS.Global & typeof globalThis = {signup: () => Promise<string[]>}

export {}
