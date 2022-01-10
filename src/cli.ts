import meow from "meow";
import { fetchPackagesByMaintainer, formatPackages } from "./index";

export const cli = meow(
    `
	Usage
	  $ detect-package-by-author <name>

	Examples
	  $ detect-package-by-author azu
`,
    {
        autoHelp: true,
        autoVersion: true
    }
);

export const run = async (
    input = cli.input
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const name: string | undefined = input[0];
    if (!name) {
        cli.showHelp();
    }
    const packages = await fetchPackagesByMaintainer(name);
    try {
        return {
            exitStatus: 0,
            stderr: null,
            stdout: formatPackages(packages)
        };
    } catch (error: any) {
        return {
            exitStatus: 1,
            stderr: error,
            stdout: null
        };
    }
};
