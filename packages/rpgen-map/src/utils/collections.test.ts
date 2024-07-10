import { LargeMap } from "@/utils/collections.js";

describe("LargeMap class", () => {
  const createLargeMap = (): LargeMap<string, string> => {
    const map = new LargeMap<string, string>(1); // Map size limited to 1

    map.set("name", "Taro");
    map.set("country", "Japan"); // map changed

    return map;
  };

  test("set/get method", () => {
    const map = createLargeMap();

    expect(map.get("name")).toBe("Taro");
    expect(map.get("country")).toBe("Japan");
    expect(new LargeMap().get("age")).toBe(undefined);
  });

  test("forEach method", () => {
    const map = createLargeMap();

    let count = 0;

    // biome-ignore lint/complexity/noForEach: test forEach method
    map.forEach(() => count++);

    expect(count).toBe(2);
  });

  test("clear method", () => {
    const map = createLargeMap();

    expect(map.size).toBe(2);

    map.clear();

    expect(map.size).toBe(0);
  });

  test("size property", () => {
    const map = new LargeMap(1); // Map size limited to 1

    map.set("name", "Taro");
    map.set("country", "Japan"); // map changed

    expect(map.size).toBe(2);
    expect(new LargeMap().size).toBe(0);
  });

  test("delete method", () => {
    const map = createLargeMap();

    expect(map.delete("country")).toBe(true); // delete next map value
    expect(map.delete("name")).toBe(true);
    expect(map.get("name")).toBe(undefined);
    expect(new LargeMap().delete("age")).toBe(false);
  });

  test("keys method", () => {
    const map = createLargeMap();

    expect([...map.keys()]).toStrictEqual(["name", "country"]);
  });

  test("values method", () => {
    const map = createLargeMap();

    expect([...map.values()]).toStrictEqual(["Taro", "Japan"]);
  });

  test("has method", () => {
    const map = createLargeMap();

    expect(map.has("name")).toBe(true);
    expect(new LargeMap().has("age")).toBe(false);
  });

  test("@@iterator method", () => {
    const map = createLargeMap();

    expect([...map]).toStrictEqual([
      ["name", "Taro"],
      ["country", "Japan"],
    ]);
    expect([...new LargeMap()]).toStrictEqual([]);
  });

  test("@@toStringTag property", () => {
    expect(new LargeMap()[Symbol.toStringTag]).toBe("Map");
  });
});
