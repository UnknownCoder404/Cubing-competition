export type user = {
  username: string;
  password: string;
  role: "admin" | "user";
  rounds: any;
  group: 1 | 2;
};
