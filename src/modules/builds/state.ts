import { create } from "zustand";

export interface IBuild {
  splash: string;
  real: string;
  version: string;
  verified: boolean;
  path: string;
  loading: boolean;
  open: boolean;
}

export interface BuildsState {
  downloadPath: string;
  setDownloadPath: (p: string) => void;
  builds: Map<string, IBuild>;
  add: (p: string, b: IBuild) => void;
  remove: (p: string) => void;
  clear: () => void;
  availableBuilds: any[];
  fetchedOnce: boolean;
}

const defaultBuilds = (): Map<string, IBuild> => {
  const builds = new Map<string, IBuild>();
  return builds;
};

const getBuildsFromStorage = (): Map<string, IBuild> => {
  if (typeof window !== "undefined") {
    const buildsObject = localStorage.getItem("builds");
    if (!buildsObject) return defaultBuilds();

    const builds = JSON.parse(buildsObject);
    return new Map(Object.entries(builds));
  }
  return defaultBuilds();
};

const useBuilds = create<BuildsState>((set, get) => ({
  downloadPath: typeof window !== "undefined" ? localStorage.getItem("download_path") || "" : "",
  setDownloadPath: (p) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("download_path", p);
      set({ downloadPath: p });
    }
  },
  builds: getBuildsFromStorage(),
  add: (p, b) => {
    if (typeof window !== "undefined") {
      const paths = get().builds;
      paths.set(p, b as IBuild);
      localStorage.setItem("builds", JSON.stringify(Object.fromEntries(paths)));
      set({ builds: paths });
    }
  },
  remove: (p) => {
    if (typeof window !== "undefined") {
      const paths = get().builds;
      paths.delete(p);
      localStorage.setItem("builds", JSON.stringify(Object.fromEntries(paths)));
      set({ builds: paths });
    }
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("builds");
      set({ builds: defaultBuilds() });
    }
  },
  availableBuilds: [],
  fetchedOnce: false,
}));

export default useBuilds;