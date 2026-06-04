declare module '@otplib/preset-browser' {
  export const authenticator: {
    generate(secret: string): string;
    check(token: string, secret: string): boolean;
  };
}
