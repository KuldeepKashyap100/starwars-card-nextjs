export async function clientFetch(
  url: string,
  beforeFetchCallback = () => {},
  afterFetchCallback = () => {},
  errorCallback = (message: string) => {},
  config: RequestInit = {},
) {
  try {
    beforeFetchCallback();
    const response = await fetch(url, config);

    if (!response.ok) throw new Error("something went wrong.");
    const data = await response.json();

    return data;
  } catch (error: any) {
    console.log(error);
    errorCallback(error?.message);
    return null;
  }
  finally {
    afterFetchCallback();
  }
}
