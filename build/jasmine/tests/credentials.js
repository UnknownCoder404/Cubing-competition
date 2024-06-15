import {
  getToken,
  getUsername,
  getRole,
  getId,
  isUser,
  isAdmin,
} from "../../Scripts/credentials.js";

describe("test suite: getToken", () => {
  beforeEach(() => {
    spyOn(Storage.prototype, "getItem").and.callFake((key) => {
      if (key === "token") {
        return "token";
      }
      return null;
    });
    spyOn(Storage.prototype, "setItem").and.callFake(() => {});
    spyOn(Storage.prototype, "removeItem").and.callFake(() => {});
  });

  it("should return the token", () => {
    localStorage.setItem("token", "token");
    const token = getToken();
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "token");
    expect(token).toBe("token");
  });

  it("Should return null if token is not set", () => {
    localStorage.getItem.and.callFake(() => null);
    const token = getToken();
    expect(token).toBe(null);
  });
});

describe("test suite: getUsername", () => {
  beforeEach(() => {
    spyOn(Storage.prototype, "getItem").and.callFake((key) => {
      if (key === "username") {
        return "username";
      }
      return null;
    });
    spyOn(Storage.prototype, "setItem").and.callFake(() => {});
    spyOn(Storage.prototype, "removeItem").and.callFake(() => {});
  });

  it("should return the username", () => {
    localStorage.setItem("username", "username");
    const username = getUsername();
    expect(localStorage.setItem).toHaveBeenCalledWith("username", "username");
    expect(username).toBe("username");
  });

  it("Should return null if username is not set", () => {
    localStorage.getItem.and.callFake(() => null);
    const username = getUsername();
    expect(username).toBe(null);
  });
});
