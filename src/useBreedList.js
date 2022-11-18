import { useState, useEffect, useDebugValue } from "react";

const localCache = {}; // normally would be best to use localStorage here

export default function useBreedList(animal) {
  const [breedList, setBreedList] = useState([]);
  const [status, setStatus] = useState("unloaded");
  useDebugValue("Number of values in cache: " + Object.keys(localCache).length);

  useEffect(() => {
    if (!animal) {
      setBreedList([]);
    } else if (localCache[animal]) {
      setBreedList(localCache[animal]); // if we've already searched for this animal, get the data from the local cache, rather than requesting from the API again
    } else {
      requestBreedList();
    }

    async function requestBreedList() {
      setBreedList([]); // immediately stops providing breeds if you switch animals
      setStatus("loading");

      const res = await fetch(
        `http://pets-v2.dev-apis.com/breeds?animal=${animal}` // get breeds from API
      );
      const json = await res.json();
      localCache[animal] = json.breeds || []; // stores animal breeds in local cache
      setBreedList(localCache[animal]);
      setStatus("loaded");
    }
  }, [animal]); // whenever [animal] changes, we re-request useEffect
  return [breedList, status];
}
