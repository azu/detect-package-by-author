import { request } from "undici";

export type PackageMeta = {
    name: string;
    scope: string;
    version: string;
    date: string;
    links: { npm: string };
    author: {
        name: string;
        email: string;
        username: string;
    };
    publisher: { username: string; email: string };
    maintainers: {
        name: string;
        email: string;
        username: string;
    }[];
};
export const fetchPackagesByMaintainer = async (name: string): Promise<PackageMeta[]> => {
    const LIMIT = 250;
    const packages: PackageMeta[] = [];
    let from = 0;
    let shouldFetch = true;
    while (shouldFetch) {
        console.log("name", name);
        const API = `https://api.npms.io/v2/search?q=maintainer:${encodeURIComponent(name)}&size=${LIMIT}&from=${from}`;
        const { body } = await request(API);
        const json = await body.json();
        console.log(json);
        if (json.results.length < 250) {
            shouldFetch = false;
        }
        from += LIMIT;
        const packageNames = json.results.map((r: any) => {
            return r.package;
        });
        packages.push(...packageNames);
    }
    return packages;
};

export const formatPackages = (packages: PackageMeta[]): string => {
    return packages
        .map((pkg) => {
            const name = pkg.scope !== "unscoped" ? `@${pkg.scope}/${pkg.name}` : pkg.name;
            return `${name}\n${pkg.links.npm}`;
        })
        .join("\n\n");
};
