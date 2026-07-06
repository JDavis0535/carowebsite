export {};

declare global {
  interface Window {
    cart?: {
      add: (item: {
        id?: string;
        name?: string;
        size?: string;
        price: number;
        image?: string;
        qty?: number;
      }) => void;
      open: () => void;
      close: () => void;
      clear: () => void;
    };
  }
}
