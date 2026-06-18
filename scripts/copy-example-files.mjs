/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Copy every `*.example.ts` file under a directory to its non-example
 * counterpart, but only when the target does not already exist.
 *
 * Mirrors the starter app's example-seeding step: a fresh clone ships the
 * committed `*.example.ts` templates and the real (generated) files are
 * git-ignored, so they must be seeded before the project will type-check.
 *
 * @param {string} directory
 */
const seedExampleFiles = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            seedExampleFiles(path);

            continue;
        }

        if (!path.endsWith('.example.ts')) {
            continue;
        }

        const target = path.replace(/\.example\.ts$/, '.ts');

        if (!existsSync(target)) {
            copyFileSync(path, target);
        }
    }
};

seedExampleFiles('src');
