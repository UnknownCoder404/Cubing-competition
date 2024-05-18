export type user = {
  save(): Promise<void>;
  username: string;
  password: string;
  role: "admin" | "user";
  rounds: any;
  group: 1 | 2;
};
