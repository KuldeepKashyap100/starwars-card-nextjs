import HttpError from "./HttpError";
import cache from "./Cache";

export default async function serverFetch(
  url: string,
  config: RequestInit = {}
) {
  if (cache.has(url)) {
    return { ...cache.get(url) };
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error("Failed to connect");
    const data = await response.json();

    cache.set(url, data);
    return data;
  } catch (error: any) {
    console.log(error);
    throw new HttpError("something went wrong.", 500);
  }
}
